import { useState, useRef, useCallback, useEffect, type DragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Link as LinkIcon, FileSearch, AlertTriangle, CheckCircle, Loader2, ChevronDown, ChevronUp, Clock, Database, Brain, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import type { ScanResult, PipelineStage } from '@/types';
import { computeFileHash } from '@/utils/crypto';
import { analyzeFile, analyzeHash, analyzeUrl } from '@/utils/algorithms';
import { scanFileHash, scanUrl, uploadFile } from '@/utils/virustotal';
import { incrementLookupCount } from '@/utils/analytics';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { PageBackground } from '@/components/PageBackground';
import { Logo } from '@/components/Logo';


const SCAN_HISTORY_KEY = 'cybee_scan_history';

// ── localStorage helpers (used for guests / offline fallback) ──────────────
function getLocalHistory(): ScanResult[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(SCAN_HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveLocalHistory(history: ScanResult[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
}

// ── Firestore helpers (used when user is logged in) ────────────────────────
async function loadFirestoreHistory(uid: string): Promise<ScanResult[]> {
  if (!db) return [];
  try {
    const q = query(
      collection(db, 'users', uid, 'scans'),
      orderBy('timestamp', 'desc'),
      limit(50),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as ScanResult);
  } catch {
    return [];
  }
}

async function saveFirestoreScan(uid: string, result: ScanResult): Promise<void> {
  if (!db) return;
  try {
    await addDoc(collection(db, 'users', uid, 'scans'), result);
  } catch (err) {
    console.warn('Failed to save scan to Firestore:', err);
  }
}

function PipelineVisualization({ stages }: { stages: PipelineStage[] }) {
  const [expanded, setExpanded] = useState(false);
  
  const completedStages = stages.filter(s => s.status === 'completed').length;
  const progress = (completedStages / stages.length) * 100;
  
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-amber-500" />
          <span className="font-medium">Analysis Pipeline</span>
          <span className="text-sm text-gray-400">({completedStages}/{stages.length})</span>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      
      <Progress value={progress} className="mt-3 h-1" />
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 space-y-2 overflow-hidden"
          >
            {stages.map((stage) => (
              <div
                key={stage.name}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    stage.status === 'completed' ? 'bg-green-500' :
                    stage.status === 'running' ? 'bg-amber-500 animate-pulse' :
                    stage.status === 'error' ? 'bg-red-500' :
                    'bg-gray-600'
                  }`} />
                  <span className="text-sm">{stage.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {stage.result && (
                    <span className="text-xs text-gray-400">{stage.result}</span>
                  )}
                  {stage.status === 'running' && (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScanResultCard({ result }: { result: ScanResult }) {
  const getStatusColor = () => {
    switch (result.status) {
      case 'clean': return 'text-green-500';
      case 'suspicious': return 'text-amber-500';
      case 'malicious': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (result.status) {
      case 'clean': return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'suspicious': return <AlertTriangle className="w-12 h-12 text-amber-500" />;
      case 'malicious': return <Logo size={56} />;
      default: return <Logo size={56} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 rounded-2xl border border-white/10 p-6"
    >
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-2xl font-bold ${getStatusColor()}`}>
              {result.status === 'clean' ? 'Clean' : 
               result.status === 'suspicious' ? 'Suspicious' : 
               result.status === 'malicious' ? 'Malicious' : 'Unknown'}
            </h3>
            {result.aiAnalysis && (
              <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                Score: {result.aiAnalysis.threatScore}/100
              </span>
            )}
          </div>
          
          <p className="text-gray-400 mb-4 break-all">{result.target}</p>
          
          {result.stats && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 rounded-lg bg-red-500/10">
                <div className="text-xl font-bold text-red-500">{result.stats.malicious}</div>
                <div className="text-xs text-gray-400">Malicious</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-500/10">
                <div className="text-xl font-bold text-amber-500">{result.stats.suspicious}</div>
                <div className="text-xs text-gray-400">Suspicious</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-500/10">
                <div className="text-xl font-bold text-green-500">{result.stats.harmless}</div>
                <div className="text-xs text-gray-400">Clean</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-500/10">
                <div className="text-xl font-bold text-gray-400">{result.stats.undetected}</div>
                <div className="text-xs text-gray-400">Undetected</div>
              </div>
            </div>
          )}
          
          {result.aiAnalysis && (
            <div className="space-y-4">
              {result.pipeline && result.pipeline.length > 0 && (
                <PipelineVisualization stages={result.pipeline} />
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-amber-500" />
                    <span className="font-medium">AI Analysis</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Entropy:</span>
                      <span>{result.aiAnalysis.entropy.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ML Confidence:</span>
                      <span>{(result.aiAnalysis.mlConfidence * 100).toFixed(1)}%</span>
                    </div>
                    {result.aiAnalysis.tlsh && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">TLSH:</span>
                        <span className="font-mono text-xs">{result.aiAnalysis.tlsh.substring(0, 20)}...</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {result.aiAnalysis.yaraMatches.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">YARA Matches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.aiAnalysis.yaraMatches.map((match) => (
                        <span
                          key={match}
                          className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs"
                        >
                          {match}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {result.aiAnalysis.indicators.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="font-medium">Indicators</span>
                  </div>
                  <ul className="space-y-1">
                    {result.aiAnalysis.indicators.map((indicator, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-500" />
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ScanPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('file');
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [hashInput, setHashInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load scan history: Firestore for logged-in users, localStorage for guests
  useEffect(() => {
    if (user) {
      loadFirestoreHistory(user.id).then(setScanHistory);
    } else {
      setScanHistory(getLocalHistory());
    }
  }, [user]);

  const handleFileScan = useCallback(async (file: File) => {
    setIsScanning(true);
    setCurrentResult(null);
    
    try {
      const hash = await computeFileHash(file);
      
      const result: ScanResult = {
        id: Date.now().toString(),
        type: 'file',
        target: file.name,
        hash,
        timestamp: Date.now(),
        status: 'pending',
      };
      
      const liveStages: import('@/types').PipelineStage[] = [];
      const { aiAnalysis, pipeline } = await analyzeFile(file, (stage) => {
        const idx = liveStages.findIndex(s => s.name === stage.name);
        if (idx >= 0) {
          liveStages[idx] = stage;
        } else {
          liveStages.push(stage);
        }
        result.pipeline = [...liveStages];
        setCurrentResult({ ...result });
      });
      
      const vtResult = await uploadFile(file);
      
      result.aiAnalysis = aiAnalysis;
      result.pipeline = pipeline;
      result.stats = vtResult.stats;
      result.detections = vtResult.detections;
      result.status = vtResult.status as ScanResult['status'];
      
      setCurrentResult(result);

      const newHistory = [result, ...scanHistory];
      setScanHistory(newHistory);

      if (user) {
        await saveFirestoreScan(user.id, result);
      } else {
        saveLocalHistory(newHistory);
      }

      await incrementLookupCount(result.target, 'file');

      toast.success('Scan completed successfully');
    } catch {
      toast.error('Scan failed', { description: 'Please try again' });
    } finally {
      setIsScanning(false);
    }
  }, [user, scanHistory]);

  const handleUrlScan = useCallback(async () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }
    
    setIsScanning(true);
    setCurrentResult(null);
    
    try {
      const result: ScanResult = {
        id: Date.now().toString(),
        type: 'url',
        target: urlInput,
        timestamp: Date.now(),
        status: 'pending',
      };
      
      const { aiAnalysis, pipeline } = await analyzeUrl(urlInput);
      const vtResult = await scanUrl(urlInput);
      
      result.aiAnalysis = aiAnalysis;
      result.pipeline = pipeline;
      result.stats = vtResult.stats;
      result.status = vtResult.status as ScanResult['status'];
      
      setCurrentResult(result);

      const newHistory = [result, ...scanHistory];
      setScanHistory(newHistory);

      if (user) {
        await saveFirestoreScan(user.id, result);
      } else {
        saveLocalHistory(newHistory);
      }

      await incrementLookupCount(result.target, 'url');

      toast.success('URL scan completed');
    } catch {
      toast.error('Scan failed');
    } finally {
      setIsScanning(false);
    }
  }, [user, scanHistory, urlInput]);

  const handleHashScan = useCallback(async () => {
    if (!hashInput.trim()) {
      toast.error('Please enter a hash');
      return;
    }
    
    setIsScanning(true);
    setCurrentResult(null);
    
    try {
      const result: ScanResult = {
        id: Date.now().toString(),
        type: 'hash',
        target: hashInput,
        timestamp: Date.now(),
        status: 'pending',
      };
      
      const { aiAnalysis, pipeline } = await analyzeHash(hashInput);
      const vtResult = await scanFileHash(hashInput);
      
      result.aiAnalysis = aiAnalysis;
      result.pipeline = pipeline;
      result.stats = vtResult.stats;
      result.status = vtResult.status as ScanResult['status'];
      
      setCurrentResult(result);

      const newHistory = [result, ...scanHistory];
      setScanHistory(newHistory);

      if (user) {
        await saveFirestoreScan(user.id, result);
      } else {
        saveLocalHistory(newHistory);
      }

      await incrementLookupCount(result.target, 'hash');

      toast.success('Hash lookup completed');
    } catch {
      toast.error('Lookup failed');
    } finally {
      setIsScanning(false);
    }
  }, [user, scanHistory, hashInput]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileScan(file);
  }, [handleFileScan]);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] py-12 overflow-hidden">
      <PageBackground />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Scan & <span className="text-amber-500">Analyze</span>
          </h1>
          <p className="text-gray-400">
            Upload files, scan URLs, or lookup hashes for comprehensive threat analysis
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white/5 mb-8">
            <TabsTrigger value="file" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <Upload className="w-4 h-4 mr-2" />
              File
            </TabsTrigger>
            <TabsTrigger value="url" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <LinkIcon className="w-4 h-4 mr-2" />
              URL
            </TabsTrigger>
            <TabsTrigger value="hash" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <FileSearch className="w-4 h-4 mr-2" />
              Hash
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 rounded-2xl border border-white/10 p-8"
            >
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-amber-500/50 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => e.target.files?.[0] && handleFileScan(e.target.files[0])}
                  className="hidden"
                />
                <Upload className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Drop a file here or click to browse</h3>
                <p className="text-gray-400 text-sm">Maximum file size: 32MB</p>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="url">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 rounded-2xl border border-white/10 p-8"
            >
              <div className="flex gap-4">
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter URL to scan (e.g., https://example.com)"
                  className="flex-1 bg-white/5 border-white/20"
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlScan()}
                />
                <Button
                  onClick={handleUrlScan}
                  disabled={isScanning}
                  className="bg-amber-500 hover:bg-amber-600 text-black"
                >
                  {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Scan'}
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="hash">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 rounded-2xl border border-white/10 p-8"
            >
              <div className="flex gap-4">
                <Input
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  placeholder="Enter MD5, SHA1, or SHA256 hash"
                  className="flex-1 bg-white/5 border-white/20"
                  onKeyDown={(e) => e.key === 'Enter' && handleHashScan()}
                />
                <Button
                  onClick={handleHashScan}
                  disabled={isScanning}
                  className="bg-amber-500 hover:bg-amber-600 text-black"
                >
                  {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lookup'}
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span className="text-gray-400">Analyzing with 10-stage pipeline...</span>
          </motion.div>
        )}

        {currentResult && (
          <div className="mt-8">
            <ScanResultCard result={currentResult} />
          </div>
        )}

        {scanHistory.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Recent Scans
            </h2>
            <div className="space-y-3">
              {scanHistory.slice(0, 5).map((scan) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => setCurrentResult(scan)}
                >
                  <div className="flex items-center gap-3">
                    {scan.type === 'file' && <Upload className="w-4 h-4 text-gray-400" />}
                    {scan.type === 'url' && <LinkIcon className="w-4 h-4 text-gray-400" />}
                    {scan.type === 'hash' && <FileSearch className="w-4 h-4 text-gray-400" />}
                    <span className="text-sm truncate max-w-[200px] sm:max-w-md">{scan.target}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-medium ${
                      scan.status === 'clean' ? 'text-green-500' :
                      scan.status === 'suspicious' ? 'text-amber-500' :
                      scan.status === 'malicious' ? 'text-red-500' :
                      'text-gray-500'
                    }`}>
                      {scan.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(scan.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
