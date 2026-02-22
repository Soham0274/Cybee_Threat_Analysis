import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Upload, Link as LinkIcon, FileSearch, Zap, Lock, Globe, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { PageBackground } from '@/components/PageBackground';
import { Logo } from '@/components/Logo';

// Pre-compute particle positions so we never call Math.random during render
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 13) % 100),            // deterministic spread across X
  y: ((i * 53 + 7) % 100),             // deterministic spread across Y
  duration: 3 + (i % 5) * 0.4,         // 3–5s cycle
  delay: (i % 7) * 0.3,                // staggered starts
}));


const features = [
  {
    icon: Zap,
    title: 'Real-time Scanning',
    description: 'Get instant threat analysis with our 10-stage pipeline powered by AI and VirusTotal.',
  },
  {
    icon: Lock,
    title: 'AI-Powered Detection',
    description: 'Machine learning models trained on millions of malware samples for accurate detection.',
  },
  {
    icon: Globe,
    title: 'Global Intelligence',
    description: 'Access threat feeds from security researchers worldwide, updated in real-time.',
  },
];

const stats = [
  { value: '99.9%', label: 'Detection Rate' },
  { value: '50M+', label: 'Files Analyzed' },
  { value: '<2s', label: 'Avg Scan Time' },
  { value: '100+', label: 'Threat Feeds' },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <PageBackground />
        
        {/* Hexagonal Deco Mesh */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <path d="M25 0L50 14.4V43.4L25 57.8L0 43.4V14.4L25 0Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-amber-500/30" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-1 h-1 bg-amber-500/20 rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-amber-400">AI-Powered Threat Detection v2.0</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              >
                Advanced Threat
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                  Intelligence Dashboard
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-400 max-w-2xl mb-10"
              >
                Secure your digital assets with the "Cyber Bee". 
                Automated 10-stage analysis pipeline for files, URLs, and malicious signatures.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Link to={user ? "/scan" : "/register"}>
                  <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 h-14 text-lg">
                    {user ? 'Open Dashboard' : 'Get Started Free'}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 h-14 px-8 text-lg text-white">
                    Technical Specifications
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
              className="flex-1 hidden lg:flex justify-center items-center relative"
            >
              <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full animate-pulse" />
              <Logo size={320} className="drop-shadow-[0_0_50px_rgba(245,158,11,0.3)]" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-24"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 max-w-4xl mx-auto overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Logo size={128} className="rotate-12 opacity-10" />
              </div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-lg font-semibold text-white">Secure Command Center</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                <Link to="/scan" className="group">
                  <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-amber-500/30">
                    <Upload className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-white">Inspect File</span>
                    <span className="text-sm text-gray-500">Local Upload</span>
                  </div>
                </Link>
                
                <Link to="/scan" className="group">
                  <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-amber-500/30">
                    <LinkIcon className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-white">Scan Link</span>
                    <span className="text-sm text-gray-500">URL Reputation</span>
                  </div>
                </Link>
                
                <Link to="/scan" className="group">
                  <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-amber-500/30">
                    <FileSearch className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-white">Database Query</span>
                    <span className="text-sm text-gray-500">Hash Lookup</span>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-amber-500">Cybee</span>?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Advanced threat detection powered by cutting-edge AI and machine learning
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gradient-to-b from-[#0a0a0a] to-[#111] overflow-hidden">
        <PageBackground variant="subtle" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                10-Stage Analysis Pipeline
              </h2>
              <p className="text-gray-400 mb-8">
                Our comprehensive analysis pipeline combines multiple detection methods 
                for maximum accuracy and minimal false positives.
              </p>
              
              <div className="space-y-4">
                {[
                  'File Ingestion & Validation',
                  'Pre-filtering & Whitelist Check',
                  'File Parsing & Structure Analysis',
                  'Shannon Entropy Calculation',
                  'TLSH Fuzzy Hashing',
                  'YARA Pattern Matching',
                  'Random Forest ML Classification',
                  'VirusTotal API Integration',
                  'Phishing Heuristics (18 signals)',
                  'Final Threat Scoring',
                ].map((stage) => (
                  <div key={stage} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span className="text-gray-300">{stage}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-400">Pipeline Visualization</span>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                    Active
                  </span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: 'File Ingestion', status: 'completed', time: '0.2s' },
                    { name: 'Entropy Analysis', status: 'completed', time: '0.5s' },
                    { name: 'YARA Matching', status: 'running', time: '0.8s' },
                    { name: 'ML Classification', status: 'pending', time: '--' },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          item.status === 'completed' ? 'bg-green-500' :
                          item.status === 'running' ? 'bg-amber-500 animate-pulse' :
                          'bg-gray-600'
                        }`} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-[#111] overflow-hidden">
        <PageBackground variant="subtle" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Secure Your Digital World?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of security professionals using Cybee for threat detection. 
              Start scanning for free today.
            </p>
            <Link to={user ? "/scan" : "/register"}>
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8">
                {user ? 'Go to Dashboard' : 'Create Free Account'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-lg font-bold">
                Cy<span className="text-amber-500">bee</span>
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/scan" className="hover:text-white transition-colors">Scan</Link>
              <Link to="/intel" className="hover:text-white transition-colors">Intelligence</Link>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
            </div>
            
            <div className="text-sm text-gray-500">
              2024 Cybee. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
