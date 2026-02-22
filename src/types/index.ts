export interface ScanResult {
  id: string;
  type: 'file' | 'url' | 'hash';
  target: string;
  hash?: string;
  timestamp: number;
  status: 'clean' | 'suspicious' | 'malicious' | 'pending' | 'error';
  stats?: {
    malicious: number;
    suspicious: number;
    harmless: number;
    undetected: number;
  };
  detections?: Detection[];
  aiAnalysis?: AIAnalysis;
  pipeline?: PipelineStage[];
}

export interface Detection {
  engine: string;
  category: 'malicious' | 'suspicious' | 'harmless' | 'undetected';
  result: string;
}

export interface AIAnalysis {
  entropy: number;
  tlsh?: string;
  yaraMatches: string[];
  mlConfidence: number;
  threatScore: number;
  indicators: string[];
}

export interface PipelineStage {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  result?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}

export interface ScanHistory {
  scans: ScanResult[];
}

export interface ThreatIntel {
  id: string;
  type: 'malware' | 'phishing' | 'apt' | 'vulnerability';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: number;
  source: string;
  indicators: string[];
}
