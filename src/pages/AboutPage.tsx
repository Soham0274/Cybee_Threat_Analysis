import { motion } from 'framer-motion';
import { Code, Check, Zap, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageBackground } from '@/components/PageBackground';
import { Logo } from '@/components/Logo';


const features = [
  {
    icon: Zap,
    title: 'Real-time Scanning',
    description: '10-stage analysis pipeline with sub-2 second response times',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your files are never stored. Hashes only for lookups.',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: '70+ antivirus engines from around the world',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for personal use',
    features: [
      '4 scans per day',
      'File & URL scanning',
      'Basic threat intel',
      'Community support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'For security professionals',
    features: [
      'Unlimited scans',
      'API access',
      'Advanced threat intel',
      'Priority support',
      'Custom YARA rules',
      'Team collaboration',
    ],
    cta: 'Start Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Dedicated infrastructure',
      'SLA guarantee',
      'Custom integrations',
      'On-premise deployment',
      '24/7 phone support',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const apiEndpoints = [
  {
    method: 'POST',
    path: '/api/v1/scan/file',
    description: 'Upload and scan a file',
    params: ['file: binary', 'wait: boolean'],
  },
  {
    method: 'POST',
    path: '/api/v1/scan/url',
    description: 'Submit a URL for analysis',
    params: ['url: string', 'wait: boolean'],
  },
  {
    method: 'GET',
    path: '/api/v1/scan/{id}',
    description: 'Retrieve scan results',
    params: ['id: string'],
  },
  {
    method: 'GET',
    path: '/api/v1/hash/{hash}',
    description: 'Lookup file by hash',
    params: ['hash: string (MD5/SHA1/SHA256)'],
  },
  {
    method: 'GET',
    path: '/api/v1/intel/feeds',
    description: 'Get latest threat feeds',
    params: ['limit: number', 'severity: string'],
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] py-12 overflow-hidden">
      <PageBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <Logo size={80} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            About <span className="text-amber-500">Cybee</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            AI-powered threat detection platform combining machine learning, 
            behavioral analysis, and global threat intelligence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="pricing" className="w-full mb-20">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white/5 mb-8">
            <TabsTrigger value="pricing" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              Pricing
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              API Docs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pricing">
            <div className="grid md:grid-cols-3 gap-6">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-2xl p-8 ${
                    plan.highlighted
                      ? 'bg-gradient-to-b from-amber-500/20 to-transparent border-2 border-amber-500/50'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full bg-amber-500 text-black text-xs font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400">/{plan.period}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? 'bg-amber-500 hover:bg-amber-600 text-black'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="api">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">REST API v1</h3>
                  <p className="text-gray-400">Integrate threat detection into your applications</p>
                </div>
                <Button variant="outline" className="border-white/20">
                  <Code className="w-4 h-4 mr-2" />
                  View Full Docs
                </Button>
              </div>

              <div className="space-y-4">
                {apiEndpoints.map((endpoint) => (
                  <div
                    key={endpoint.path}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-mono ${
                        endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                        endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-amber-400 font-mono text-sm">{endpoint.path}</code>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{endpoint.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.params.map((param) => (
                        <span key={param} className="text-xs text-gray-500 font-mono">
                          {param}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-400">
                  <strong>Base URL:</strong> https://api.cybee.io/v1
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Authentication via Bearer token in Authorization header
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>



        <footer className="text-center text-gray-500 text-sm">
          <p>2024 Cybee. All rights reserved.</p>
          <p className="mt-2">
            Built with React, TypeScript, and Framer Motion. Powered by VirusTotal API.
          </p>
        </footer>
      </div>
    </div>
  );
}
