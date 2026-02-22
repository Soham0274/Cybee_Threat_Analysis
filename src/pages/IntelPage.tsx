import { motion } from 'framer-motion';
import { Database, Brain, AlertTriangle, Activity, FileCode, Search, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageBackground } from '@/components/PageBackground';


const threatFeeds = [
  {
    id: 1,
    type: 'malware',
    title: 'New Ransomware Strain Detected',
    description: 'A new ransomware variant targeting healthcare systems has been identified. Uses AES-256 encryption.',
    severity: 'critical',
    timestamp: '2 hours ago',
    source: 'MalwareBytes',
    indicators: ['192.168.1.100', 'evil-domain.com', 'ransomware.exe'],
  },
  {
    id: 2,
    type: 'phishing',
    title: 'Bank Phishing Campaign',
    description: 'Large-scale phishing campaign impersonating major banks. Over 10,000 emails detected.',
    severity: 'high',
    timestamp: '4 hours ago',
    source: 'PhishTank',
    indicators: ['fake-bank.com', 'secure-verify.net'],
  },
  {
    id: 3,
    type: 'apt',
    title: 'APT29 Activity Spike',
    description: 'Increased activity from APT29 group targeting government organizations.',
    severity: 'critical',
    timestamp: '6 hours ago',
    source: 'CISA',
    indicators: ['apt-backdoor.exe', '45.32.167.89'],
  },
  {
    id: 4,
    type: 'vulnerability',
    title: 'CVE-2024-1234: Critical RCE',
    description: 'Remote code execution vulnerability in popular web framework. Patch immediately.',
    severity: 'critical',
    timestamp: '8 hours ago',
    source: 'NVD',
    indicators: ['CVSS: 9.8'],
  },
  {
    id: 5,
    type: 'malware',
    title: 'CryptoMiner Botnet',
    description: 'New botnet focusing on cryptocurrency mining on compromised systems.',
    severity: 'medium',
    timestamp: '12 hours ago',
    source: 'VirusTotal',
    indicators: ['miner-xmr.exe', 'pool.crypto.com'],
  },
];

const algorithms = [
  {
    name: 'Shannon Entropy',
    icon: Activity,
    description: 'Measures randomness in file data to detect packing/encryption.',
    details: 'Entropy values above 7.5 typically indicate packed or encrypted files. Values above 6.5 suggest possible obfuscation.',
    range: '0.0 - 8.0',
    threshold: '> 7.5 = Suspicious',
  },
  {
    name: 'TLSH Fuzzy Hash',
    icon: FileCode,
    description: 'Trend Micro Locality Sensitive Hash for similarity matching.',
    details: 'TLSH can identify similar files even with minor modifications. Distance scores below 30 indicate high similarity.',
    range: 'Hash + Distance',
    threshold: '< 30 = Similar',
  },
  {
    name: 'YARA Pattern Matching',
    icon: Search,
    description: 'Signature-based detection using pattern rules.',
    details: 'Matches known malware signatures, suspicious API calls, and behavioral patterns.',
    range: '0+ matches',
    threshold: 'Any match = Flag',
  },
  {
    name: 'Random Forest ML',
    icon: Brain,
    description: 'Ensemble learning for malware classification.',
    details: 'Trained on millions of samples to classify files with high accuracy and low false positives.',
    range: '0.0 - 1.0',
    threshold: '> 0.7 = Malicious',
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'text-red-500 bg-red-500/10';
    case 'high': return 'text-amber-500 bg-amber-500/10';
    case 'medium': return 'text-yellow-500 bg-yellow-500/10';
    default: return 'text-green-500 bg-green-500/10';
  }
};

export default function IntelPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] py-12 overflow-hidden">
      <PageBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Threat <span className="text-amber-500">Intelligence</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real-time threat feeds and detection algorithm insights from our global security network
          </p>
        </motion.div>

        <Tabs defaultValue="feeds" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white/5 mb-8">
            <TabsTrigger value="feeds" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <Globe className="w-4 h-4 mr-2" />
              Threat Feeds
            </TabsTrigger>
            <TabsTrigger value="algorithms" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <Brain className="w-4 h-4 mr-2" />
              Algorithms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feeds">
            <div className="grid gap-4">
              {threatFeeds.map((feed, index) => (
                <motion.div
                  key={feed.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 rounded-xl border border-white/10 p-6 hover:border-amber-500/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(feed.severity)}`}>
                          {feed.severity.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">{feed.timestamp}</span>
                        <span className="text-sm text-amber-500">{feed.source}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feed.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{feed.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {feed.indicators.map((indicator) => (
                          <code
                            key={indicator}
                            className="px-2 py-1 rounded bg-white/10 text-xs font-mono text-amber-400"
                          >
                            {indicator}
                          </code>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="algorithms">
            <div className="grid md:grid-cols-2 gap-6">
              {algorithms.map((algo, index) => (
                <motion.div
                  key={algo.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-xl border border-white/10 p-6 hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <algo.icon className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{algo.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{algo.description}</p>
                      <p className="text-gray-500 text-sm mb-4">{algo.details}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">Range: <span className="text-white">{algo.range}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">{algo.threshold}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-white/5 rounded-xl border border-white/10 p-8"
            >
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <Database className="w-6 h-6 text-amber-500" />
                Database Architecture
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-xl bg-white/5">
                  <div className="text-3xl font-bold text-amber-500 mb-2">70+</div>
                  <div className="text-gray-400">Antivirus Engines</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-white/5">
                  <div className="text-3xl font-bold text-amber-500 mb-2">100M+</div>
                  <div className="text-gray-400">Sample Database</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-white/5">
                  <div className="text-3xl font-bold text-amber-500 mb-2">50K+</div>
                  <div className="text-gray-400">YARA Rules</div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
