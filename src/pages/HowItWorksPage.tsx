import { motion } from 'framer-motion';
import { Upload, Filter, FileCode, Activity, Fingerprint, Search, Brain, Globe, Calculator, CheckCircle } from 'lucide-react';
import { PageBackground } from '@/components/PageBackground';
import { Logo } from '@/components/Logo';


const pipelineStages = [
  {
    number: '01',
    icon: Upload,
    title: 'File Ingestion',
    description: 'Files are uploaded securely via drag-and-drop or file selection. Maximum size: 32MB.',
    details: ['SHA-256 hash computed', 'File metadata extracted', 'Format validation'],
    color: 'from-blue-500 to-blue-600',
  },
  {
    number: '02',
    icon: Filter,
    title: 'Pre-filtering',
    description: 'Quick checks against whitelist databases and known-good signatures.',
    details: ['Whitelist lookup', 'Trusted publisher check', 'Reputation database query'],
    color: 'from-green-500 to-green-600',
  },
  {
    number: '03',
    icon: FileCode,
    title: 'File Parsing',
    description: 'Deep structural analysis of file format and embedded content.',
    details: ['PE structure analysis', 'Resource extraction', 'Import table parsing'],
    color: 'from-purple-500 to-purple-600',
  },
  {
    number: '04',
    icon: Activity,
    title: 'Shannon Entropy',
    description: 'Calculates randomness to detect packing, encryption, or obfuscation.',
    details: ['Byte frequency analysis', 'Entropy score calculation', 'Section-level entropy'],
    color: 'from-orange-500 to-orange-600',
  },
  {
    number: '05',
    icon: Fingerprint,
    title: 'TLSH Fuzzy Hash',
    description: 'Trend Micro Locality Sensitive Hash for similarity detection.',
    details: ['Locality-sensitive hashing', 'Similarity score generation', 'Cluster matching'],
    color: 'from-pink-500 to-pink-600',
  },
  {
    number: '06',
    icon: Search,
    title: 'YARA Pattern Match',
    description: 'Signature-based detection using 50,000+ YARA rules.',
    details: ['Malware signatures', 'Behavioral patterns', 'APT indicators'],
    color: 'from-red-500 to-red-600',
  },
  {
    number: '07',
    icon: Brain,
    title: 'Random Forest ML',
    description: 'Machine learning classification trained on millions of samples.',
    details: ['Feature extraction', 'Ensemble classification', 'Confidence scoring'],
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    number: '08',
    icon: Globe,
    title: 'VirusTotal API',
    description: 'Query 70+ antivirus engines for comprehensive detection.',
    details: ['Multi-engine scan', 'Reputation check', 'Community scores'],
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    number: '09',
    icon: Logo,
    title: 'Phishing Heuristics',
    description: '18-signal scoring system for URL and email analysis.',
    details: ['Domain analysis', 'SSL certificate check', 'Content analysis'],
    color: 'from-amber-500 to-amber-600',
  },
  {
    number: '10',
    icon: Calculator,
    title: 'Final Scoring',
    description: 'Weighted aggregation of all signals into a threat score.',
    details: ['Signal weighting', 'Threshold application', 'Verdict generation'],
    color: 'from-emerald-500 to-emerald-600',
  },
];

const phishingSignals = [
  'HTTP instead of HTTPS',
  'IP address in domain',
  'Excessive subdomains',
  'Suspicious TLD (.tk, .ml, .xyz)',
  'Unusually long URL',
  'Numbers in domain name',
  'URL contains @ symbol',
  'Brand impersonation',
  'Misspelled domains',
  'URL shorteners',
  'Suspicious redirects',
  'Missing SPF/DKIM',
  'Suspicious attachments',
  'Urgent language',
  'Grammar errors',
  'Request for credentials',
  'Suspicious sender',
  'Mismatched URLs',
];

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] py-12 overflow-hidden">
      <PageBackground />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            How It <span className="text-amber-500">Works</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our 10-stage analysis pipeline combines multiple detection methods for maximum accuracy
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/50 via-amber-500/20 to-transparent hidden md:block" />
          
          <div className="space-y-8">
            {pipelineStages.map((stage, index) => (
              <motion.div
                key={stage.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative flex gap-6"
              >
                <div className="hidden md:flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center flex-shrink-0 z-10`}>
                    <stage.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-amber-500/30 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className={`md:hidden w-12 h-12 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center flex-shrink-0`}>
                      <stage.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-amber-500 font-mono text-sm">{stage.number}</span>
                        <h3 className="text-xl font-semibold text-white group-hover:text-amber-500 transition-colors">
                          {stage.title}
                        </h3>
                      </div>
                      <p className="text-gray-400 mb-4">{stage.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {stage.details.map((detail) => (
                          <span
                            key={detail}
                            className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400"
                          >
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-white/5 rounded-2xl border border-white/10 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Logo size={40} />
            Phishing Heuristics (18 Signals)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {phishingSignals.map((signal) => (
              <div
                key={signal}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
              >
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-sm text-gray-300">{signal}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-sm">
            Each signal contributes to a composite phishing score. Scores above 50 trigger warnings, 
            while scores above 80 indicate high-confidence phishing attempts.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
