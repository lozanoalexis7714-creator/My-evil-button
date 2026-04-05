import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Database, 
  Table, 
  Columns, 
  FileSpreadsheet, 
  ShieldAlert, 
  Zap, 
  Download, 
  ChevronRight, 
  ChevronDown, 
  Activity, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  RotateCcw, 
  Ghost, 
  Skull, 
  RefreshCw, 
  Check, 
  Archive, 
  X,
  Menu,
  Search,
  Link as LinkIcon,
  Globe,
  List,
  ShieldCheck,
  FileText,
  Eye,
  Copy,
  Smartphone,
  KeyRound,
  Unlock,
  Lock,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { cn } from './lib/utils';
import { DatabaseNode, ScanStats, Report, TargetURL } from './types';

// Mock Data for the Tree View
const INITIAL_DB_NODES: DatabaseNode[] = [
  {
    id: 'db1',
    name: 'ecommerce_prod',
    type: 'database',
    children: [
      {
        id: 't1',
        name: 'users',
        type: 'table',
        children: [
          { id: 'c1', name: 'id', type: 'column' },
          { id: 'c2', name: 'username', type: 'column' },
          { id: 'c3', name: 'password_hash', type: 'column' },
          { id: 'c4', name: 'email', type: 'column' },
          { id: 'c5', name: 'phone', type: 'column' },
        ],
        data: [
          { id: 1, username: 'admin', password_hash: '827ccb0eea8a706c4c34a16891f84e7b', email: 'admin@site.com', phone: '555-0101' },
          { id: 2, username: 'lexy', password_hash: '5f4dcc3b5aa765d61d8327deb882cf99', email: 'lexy@gmail.com', phone: '555-0102' },
          { id: 3, username: 'guest', password_hash: '098f6bcd4621d373cade4e832627b4f6', email: 'guest@site.com', phone: '555-0103' },
        ]
      },
      {
        id: 't2',
        name: 'orders',
        type: 'table',
        children: [
          { id: 'c6', name: 'id', type: 'column' },
          { id: 'c7', name: 'user_id', type: 'column' },
          { id: 'c8', name: 'total', type: 'column' },
        ]
      }
    ]
  },
  {
    id: 'db2',
    name: 'internal_hr',
    type: 'database',
    children: [
      {
        id: 't3',
        name: 'employees',
        type: 'table',
        children: [
          { id: 'c9', name: 'full_name', type: 'column' },
          { id: 'c10', name: 'salary', type: 'column' },
        ]
      }
    ]
  }
];

export default function App() {
  const [curlInput, setCurlInput] = useState('');
  const [homepageUrl, setHomepageUrl] = useState('');
  const [isStealth, setIsStealth] = useState(false);
  const [isCrawl, setIsCrawl] = useState(true);
  const [isFullDiscovery, setIsFullDiscovery] = useState(false);
  const [isDeepSpider, setIsDeepSpider] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState<ScanStats>({
    payloadsSent: 0,
    totalPayloads: 1200,
    vulnerabilitiesFound: 0,
    timeElapsed: 0,
    status: 'idle',
    targetsFound: 0,
    targetsTested: 0,
  });
  const [targetQueue, setTargetQueue] = useState<TargetURL[]>([]);
  const [dbNodes, setDbNodes] = useState<DatabaseNode[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [crackedPasswords, setCrackedPasswords] = useState<Record<string, string>>({});
  const [crackingHashes, setCrackingHashes] = useState<Set<string>>(new Set());
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Sound effects (simulated)
  const playPing = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(() => {});
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedNodes(newExpanded);
  };

  const handleEvilButton = async () => {
    if (!isFullDiscovery && !curlInput) {
      addLog('ERROR: No cURL input provided.');
      return;
    }
    if (isFullDiscovery && !homepageUrl) {
      addLog('ERROR: No Homepage URL provided for Scout engine.');
      return;
    }

    setLogs([]);
    setStats(prev => ({ 
      ...prev, 
      status: isFullDiscovery ? 'crawling' : 'scanning', 
      payloadsSent: 0, 
      vulnerabilitiesFound: 0, 
      timeElapsed: 0,
      targetsFound: 0,
      targetsTested: 0
    }));
    setTargetQueue([]);
    setIsDeepSpider(false);
    
    const timer = setInterval(() => {
      setStats(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
    }, 1000);

    if (isFullDiscovery) {
      addLog(`Initializing "Scout" Discovery Engine for ${homepageUrl}...`);
      addLog('Starting automated site crawling (--crawl=3)...');
      
      // Phase 1: Initial Crawl
      const initialUrls: TargetURL[] = [
        { id: `t-init-1-${Date.now()}`, url: `${homepageUrl}/login`, status: 'pending', type: 'login', method: 'POST', params: ['user', 'pass'] },
        { id: `t-init-2-${Date.now()}`, url: `${homepageUrl}/search`, status: 'pending', type: 'search', method: 'GET', params: ['q'] },
        { id: `t-init-3-${Date.now()}`, url: `${homepageUrl}/newsletter`, status: 'pending', type: 'form', method: 'POST', params: ['email'] },
      ];

      for (const url of initialUrls) {
        await new Promise(r => setTimeout(r, 600));
        setTargetQueue(prev => [...prev, url]);
        setStats(prev => ({ ...prev, targetsFound: prev.targetsFound + 1 }));
        addLog(`[SCOUT] Identified Form: ${url.url} (${url.method})`);
      }

      // Phase 2: JS Interaction & Hidden Parameters
      addLog('Executing JavaScript Interaction Engine...');
      addLog('Simulating user events to detect dynamic parameters...');
      await new Promise(r => setTimeout(r, 1200));

      const jsUrls: TargetURL[] = [
        { id: `t-js-1-${Date.now()}`, url: `${homepageUrl}/api/v1/tracking`, status: 'pending', type: 'api', method: 'POST', params: ['_token', 'sid'], isJSGenerated: true },
        { id: `t-js-2-${Date.now()}`, url: `${homepageUrl}/products/filter`, status: 'pending', type: 'search', method: 'GET', params: ['cat', 'sort', 'view_mode'], isJSGenerated: true },
      ];

      for (const url of jsUrls) {
        await new Promise(r => setTimeout(r, 800));
        setTargetQueue(prev => [...prev, url]);
        setStats(prev => ({ ...prev, targetsFound: prev.targetsFound + 1 }));
        addLog(`[JS-ENGINE] Detected Hidden Entry Point: ${url.url} (via dynamic interaction)`);
      }

      // Phase 3: Automatic Deep Spider Switch
      addLog('Initial crawl results insufficient. AUTOMATICALLY SWITCHING TO DEEP SPIDER MODE...');
      setIsDeepSpider(true);
      await new Promise(r => setTimeout(r, 1500));

      const deepUrls: TargetURL[] = [
        { id: `t-deep-1-${Date.now()}`, url: `${homepageUrl}/admin/db_backup`, status: 'pending', type: 'page', method: 'GET', params: ['file_id'] },
        { id: `t-deep-2-${Date.now()}`, url: `${homepageUrl}/debug/console`, status: 'pending', type: 'form', method: 'POST', params: ['cmd', 'auth_key'] },
      ];

      for (const url of deepUrls) {
        await new Promise(r => setTimeout(r, 1000));
        setTargetQueue(prev => [...prev, url]);
        setStats(prev => ({ ...prev, targetsFound: prev.targetsFound + 1 }));
        addLog(`[DEEP-SPIDER] Found hidden administrative endpoint: ${url.url}`);
      }

      addLog('Advanced Discovery complete. Starting Batch Testing queue...');
      setStats(prev => ({ ...prev, status: 'scanning' }));

      const discoveredUrls = [...initialUrls, ...jsUrls, ...deepUrls];
      const consolidatedResults: any[] = [];

      for (let i = 0; i < discoveredUrls.length; i++) {
        const target = discoveredUrls[i];
        setTargetQueue(prev => prev.map(t => t.id === target.id ? { ...t, status: 'scanning' } : t));
        addLog(`[BATCH] Testing target ${i + 1}/${discoveredUrls.length}: ${target.url}`);
        
        // Simulate scan for each target
        await new Promise(r => setTimeout(r, 1500));
        const isVulnerable = Math.random() > 0.6;
        
        if (isVulnerable) {
          setStats(prev => ({ ...prev, vulnerabilitiesFound: prev.vulnerabilitiesFound + 1 }));
          addLog(`[ALERT] Vulnerability confirmed on ${target.url}`);
        }

        setTargetQueue(prev => prev.map(t => t.id === target.id ? { ...t, status: isVulnerable ? 'vulnerable' : 'safe' } : t));
        setStats(prev => ({ ...prev, targetsTested: prev.targetsTested + 1 }));
        
        consolidatedResults.push({
          url: target.url,
          type: target.type,
          status: isVulnerable ? 'VULNERABLE' : 'SAFE',
          details: isVulnerable ? 'SQL Injection detected in parameter' : 'No common vulnerabilities found'
        });
      }

      // Generate Consolidated Report
      const masterReport: Report = {
        id: `rep-scout-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        site: new URL(homepageUrl).hostname,
        date: new Date().toLocaleString(),
        vulnerabilitySummary: `Scout Engine tested ${discoveredUrls.length} targets. Found ${consolidatedResults.filter(r => r.status === 'VULNERABLE').length} vulnerabilities.`,
        data: consolidatedResults,
        type: 'consolidated'
      };
      setReports(prev => [masterReport, ...prev]);
      addLog('SUCCESS: Batch testing complete. Consolidated master report generated.');

      // Automatic Hash Cracking Integration
      const detectedHashes = new Set<string>();
      masterReport.data.forEach(row => {
        Object.values(row).forEach(val => {
          if (isHash(val)) detectedHashes.add(val as string);
        });
      });

      if (detectedHashes.size > 0) {
        addLog(`[AUTO-CRACK] Detected ${detectedHashes.size} unique hashes in Scout report. Initiating automated dictionary attack...`);
        for (const hash of Array.from(detectedHashes)) {
          handleDecipherHash(hash);
        }
      }
    } else {
      // Original Single Target Logic
      addLog('Initializing "The Evil Button" macro...');
      addLog('Parsing cURL into request.txt...');
      
      const steps = [
        { msg: 'Detecting WAF/IPS/IDS protection...', delay: 1000 },
        { msg: 'WAF Detected: Cloudflare. Applying tamper scripts...', delay: 1500 },
        { msg: 'Starting deep vulnerability scan (Level 5, Risk 3)...', delay: 1000 },
        { msg: 'VULNERABILITY CONFIRMED: Parameter "id" is exploitable.', delay: 1000, vuln: true },
        { msg: 'Fetching database names...', delay: 2000 },
        { msg: 'Databases discovered: ecommerce_prod, internal_hr', delay: 1000 },
        { msg: 'Auto-dumping "users" table to Reports folder...', delay: 2500 },
      ];

      let currentPayloads = 0;
      for (const step of steps) {
        await new Promise(r => setTimeout(r, step.delay));
        addLog(step.msg);
        if (step.vuln) {
          setStats(prev => ({ ...prev, vulnerabilitiesFound: prev.vulnerabilitiesFound + 1 }));
        }
        currentPayloads += Math.floor(Math.random() * 100) + 50;
        setStats(prev => ({ ...prev, payloadsSent: Math.min(currentPayloads, prev.totalPayloads) }));
      }

      setDbNodes(INITIAL_DB_NODES);
      
      const newReport: Report = {
        id: `rep-single-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        site: 'ecommerce-site.com',
        date: new Date().toLocaleString(),
        database: 'ecommerce_prod',
        table: 'users',
        vulnerabilitySummary: 'Critical UNION-based SQL injection found in "id" parameter.',
        data: INITIAL_DB_NODES[0].children![0].data!,
        type: 'single'
      };
      setReports(prev => [newReport, ...prev]);
      addLog('SUCCESS: Data dump complete. Report generated.');

      // Automatic Hash Cracking Integration
      const detectedHashes = new Set<string>();
      newReport.data.forEach(row => {
        Object.values(row).forEach(val => {
          if (isHash(val)) detectedHashes.add(val as string);
        });
      });

      if (detectedHashes.size > 0) {
        addLog(`[AUTO-CRACK] Detected ${detectedHashes.size} unique hashes. Initiating automated dictionary attack...`);
        for (const hash of Array.from(detectedHashes)) {
          handleDecipherHash(hash);
        }
      }
    }

    clearInterval(timer);
    setStats(prev => ({ ...prev, status: 'completed', payloadsSent: isFullDiscovery ? 0 : 1200 }));
    playPing();
  };

  const exportToCSV = (report: Report) => {
    // Enhance data with cracked passwords for side-by-side display
    const enhancedData = report.data.map(row => {
      const newRow: any = { ...row };
      Object.keys(row).forEach(key => {
        const val = row[key];
        if (isHash(val) && crackedPasswords[val]) {
          newRow[`${key}_CRACKED`] = crackedPasswords[val];
        }
      });
      return newRow;
    });

    const csv = Papa.unparse(enhancedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${report.site}_${report.table}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToText = (report: Report) => {
    let text = `==================================================\n`;
    text += `EVIL BUTTON PENTEST REPORT\n`;
    text += `==================================================\n\n`;
    text += `SITE: ${report.site}\n`;
    text += `DATE: ${report.date}\n`;
    text += `TYPE: ${report.type === 'consolidated' ? 'Consolidated Master Scan' : 'Single Table Dump'}\n`;
    if (report.database) text += `DATABASE: ${report.database}\n`;
    if (report.table) text += `TABLE: ${report.table}\n`;
    text += `\nSUMMARY:\n${report.vulnerabilitySummary}\n\n`;
    text += `--------------------------------------------------\n`;
    text += `EXTRACTED DATA:\n`;
    text += `--------------------------------------------------\n\n`;

    if (report.data.length > 0) {
      const keys = Object.keys(report.data[0]);
      report.data.forEach((row, index) => {
        text += `[ENTRY #${index + 1}]\n`;
        keys.forEach(key => {
          const val = row[key];
          text += `${key.toUpperCase()}: ${val}`;
          if (isHash(val) && crackedPasswords[val]) {
            text += ` [CRACKED: ${crackedPasswords[val]}]`;
          }
          text += `\n`;
        });
        text += `\n`;
      });
    } else {
      text += `No data entries found.\n`;
    }

    text += `\n==================================================\n`;
    text += `END OF REPORT\n`;
    text += `==================================================`;
    return text;
  };

  const exportToText = (report: Report) => {
    const text = convertToText(report);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${report.site}_report_${Date.now()}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog('Report copied to clipboard.');
  };

  const handleDecipherHash = async (hash: string) => {
    if (crackedPasswords[hash] || crackingHashes.has(hash)) return;

    setCrackingHashes(prev => new Set(prev).add(hash));
    addLog(`[CRACKER] Initializing Brute-Force/Rainbow Table attack on hash: ${hash.substring(0, 8)}...`);
    
    // Simulated cracking progress
    const steps = [
      'Identifying hash type: MD5 detected.',
      'Loading wordlist: rockyou.txt (14M entries)...',
      'Applying mutation rules (leetspeak, years)...',
      'Running GPU-accelerated brute force...',
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 800));
      addLog(`[CRACKER] ${step}`);
    }

    await new Promise(r => setTimeout(r, 1000));
    
    const HASH_MAP: Record<string, string> = {
      '827ccb0eea8a706c4c34a16891f84e7b': '12345',
      '5f4dcc3b5aa765d61d8327deb882cf99': 'password',
      '098f6bcd4621d373cade4e832627b4f6': 'test',
    };

    const result = HASH_MAP[hash] || 'P@ssw0rd123!'; // Fallback for simulation
    
    setCrackedPasswords(prev => ({ ...prev, [hash]: result }));
    setCrackingHashes(prev => {
      const next = new Set(prev);
      next.delete(hash);
      return next;
    });
    
    addLog(`[SUCCESS] Hash cracked! Result: ${result}`);
    playPing();
  };

  const isHash = (value: any) => {
    if (typeof value !== 'string') return false;
    return /^[a-f0-9]{32,128}$/i.test(value);
  };

  const renderTree = (nodes: DatabaseNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id} className="select-none">
        <div 
          className={cn(
            "flex items-center gap-2 py-2 px-2 hover:bg-white/5 cursor-pointer rounded transition-colors group",
            level > 0 && "ml-4"
          )}
          onClick={() => node.children && toggleNode(node.id)}
        >
          {node.children ? (
            expandedNodes.has(node.id) ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />
          ) : (
            <div className="w-[14px]" />
          )}
          
          {node.type === 'database' && <Database size={14} className="text-blue-400" />}
          {node.type === 'table' && <Table size={14} className="text-emerald-400" />}
          {node.type === 'column' && <Columns size={14} className="text-amber-400" />}
          
          <span className={cn(
            "text-sm font-medium",
            node.type === 'database' ? "text-zinc-200" : "text-zinc-400"
          )}>
            {node.name}
          </span>

          {node.type === 'table' && node.data && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addLog(`Selective dumping table: ${node.name}...`);
              }}
              className="ml-auto opacity-0 group-hover:opacity-100 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
            >
              Dump
            </button>
          )}
        </div>
        {node.children && expandedNodes.has(node.id) && renderTree(node.children, level + 1)}
      </div>
    ));
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0d0d0d]">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <Skull size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">EVIL BUTTON</h1>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">v2.4.0 Pro</p>
          </div>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden text-zinc-500 hover:text-white p-1"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center justify-between px-2 mb-4">
          <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Data Explorer</h2>
          <button onClick={() => setDbNodes([])} className="text-zinc-600 hover:text-zinc-400 transition-colors">
            <RotateCcw size={12} />
          </button>
        </div>
        
        {dbNodes.length > 0 ? (
          <div className="space-y-1">
            {renderTree(dbNodes)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            <Database size={32} className="text-zinc-800 mb-2" />
            <p className="text-xs text-zinc-600">No databases discovered yet.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-800 bg-black/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">System Status</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-500 font-mono uppercase">Online</span>
          </div>
        </div>
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 w-[12%]" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-300 font-sans overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-zinc-800",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header / Stats Bar */}
        <header className="h-auto lg:h-16 border-b border-zinc-800 flex flex-col lg:flex-row items-center px-4 lg:px-6 py-3 lg:py-0 gap-4 lg:gap-8 bg-[#0d0d0d]/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center gap-2 lg:hidden">
              <Skull size={20} className="text-red-500" />
              <span className="font-black text-sm tracking-tighter">EVIL BUTTON</span>
            </div>

            <div className="w-10 lg:hidden" /> {/* Spacer for centering */}
          </div>

          <div className="flex items-center justify-between lg:justify-start w-full lg:w-auto gap-4 lg:gap-8 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            <div className="flex items-center gap-2 shrink-0">
              <Activity size={16} className="text-red-500" />
              <div className="flex flex-col">
                <span className="text-[9px] text-zinc-500 uppercase font-bold leading-none mb-1">Payloads</span>
                <span className="text-xs lg:text-sm font-mono text-white leading-none whitespace-nowrap">{stats.payloadsSent} <span className="text-zinc-600">/ {stats.totalPayloads}</span></span>
              </div>
            </div>

            <div className="hidden lg:block w-px h-8 bg-zinc-800" />

            <div className="flex items-center gap-2 shrink-0">
              <ShieldAlert size={16} className={cn(stats.vulnerabilitiesFound > 0 ? "text-red-500" : "text-zinc-600")} />
              <div className="flex flex-col">
                <span className="text-[9px] text-zinc-500 uppercase font-bold leading-none mb-1">Vulns</span>
                <span className={cn("text-xs lg:text-sm font-mono leading-none whitespace-nowrap", stats.vulnerabilitiesFound > 0 ? "text-red-500" : "text-white")}>
                  {stats.vulnerabilitiesFound} <span className="text-zinc-600">conf.</span>
                </span>
              </div>
            </div>

            <div className="hidden lg:block w-px h-8 bg-zinc-800" />

            <div className="flex items-center gap-2 shrink-0">
              <Clock size={16} className="text-blue-500" />
              <div className="flex flex-col">
                <span className="text-[9px] text-zinc-500 uppercase font-bold leading-none mb-1">Time</span>
                <span className="text-xs lg:text-sm font-mono text-white leading-none whitespace-nowrap">
                  {Math.floor(stats.timeElapsed / 60).toString().padStart(2, '0')}:{(stats.timeElapsed % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex ml-auto items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">
              <Ghost size={14} className={cn(isStealth ? "text-emerald-400" : "text-zinc-600")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Stealth</span>
              <button 
                onClick={() => setIsStealth(!isStealth)}
                className={cn(
                  "w-8 h-4 rounded-full relative transition-colors",
                  isStealth ? "bg-emerald-500" : "bg-zinc-700"
                )}
              >
                <div className={cn(
                  "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                  isStealth ? "left-4.5" : "left-0.5"
                )} />
              </button>
            </div>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4 lg:space-y-6 scrollbar-thin">
          {/* Input Section */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-red-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Target Config</h3>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={isFullDiscovery} 
                    onChange={(e) => setIsFullDiscovery(e.target.checked)}
                    className="hidden"
                  />
                  <div className={cn(
                    "w-5 h-5 border rounded flex items-center justify-center transition-all",
                    isFullDiscovery ? "bg-amber-500 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]" : "border-zinc-700 group-hover:border-zinc-500"
                  )}>
                    {isFullDiscovery && <Search size={14} className="text-white" />}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase group-hover:text-zinc-300">Scout Engine</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={isCrawl} 
                    onChange={(e) => setIsCrawl(e.target.checked)}
                    className="hidden"
                  />
                  <div className={cn(
                    "w-5 h-5 border rounded flex items-center justify-center transition-all",
                    isCrawl ? "bg-red-500 border-red-500" : "border-zinc-700 group-hover:border-zinc-500"
                  )}>
                    {isCrawl && <Check size={14} className="text-white" />}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase group-hover:text-zinc-300">Auto-Crawl</span>
                </label>
                
                <div className="lg:hidden flex items-center gap-2 bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
                  <Ghost size={12} className={cn(isStealth ? "text-emerald-400" : "text-zinc-600")} />
                  <button 
                    onClick={() => setIsStealth(!isStealth)}
                    className={cn(
                      "w-7 h-3.5 rounded-full relative transition-colors",
                      isStealth ? "bg-emerald-500" : "bg-zinc-600"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all",
                      isStealth ? "left-4" : "left-0.5"
                    )} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {isFullDiscovery ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Globe size={18} className="text-zinc-600" />
                  </div>
                  <input 
                    type="text"
                    value={homepageUrl}
                    onChange={(e) => setHomepageUrl(e.target.value)}
                    placeholder="Enter Homepage URL (e.g., https://example.com)"
                    className="w-full h-14 bg-black/40 border border-zinc-800 rounded pl-12 pr-4 text-sm font-mono text-amber-500 focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-zinc-700"
                  />
                </div>
              ) : (
                <div className="relative">
                  <textarea 
                    value={curlInput}
                    onChange={(e) => setCurlInput(e.target.value)}
                    placeholder="Paste cURL request here..."
                    className="w-full h-32 lg:h-40 bg-black/40 border border-zinc-800 rounded p-4 text-xs font-mono text-emerald-500 focus:outline-none focus:border-red-500/50 transition-colors resize-none placeholder:text-zinc-700"
                  />
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={() => setCurlInput('')}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}

              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleEvilButton}
                disabled={stats.status !== 'idle' && stats.status !== 'completed'}
                className={cn(
                  "w-full h-16 lg:h-20 rounded-xl flex items-center justify-center gap-3 font-black text-xl lg:text-2xl tracking-tighter uppercase transition-all shadow-xl",
                  (stats.status !== 'idle' && stats.status !== 'completed')
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                    : isFullDiscovery 
                      ? "bg-amber-600 text-white hover:bg-amber-500 shadow-amber-600/20"
                      : "bg-red-600 text-white hover:bg-red-500 shadow-red-600/20"
                )}
              >
                {stats.status !== 'idle' && stats.status !== 'completed' ? (
                  <>
                    <RefreshCw size={28} className="animate-spin" />
                    {stats.status === 'crawling' ? 'Crawling Site...' : 'Scanning Queue...'}
                  </>
                ) : (
                  <>
                    <Zap size={28} fill="currentColor" />
                    {isFullDiscovery ? 'START SCOUT ENGINE' : 'THE EVIL BUTTON'}
                  </>
                )}
              </motion.button>
            </div>
          </section>

          {/* Middle Grid: Logs & Reports */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Target Queue (Scout Engine) */}
            <AnimatePresence>
              {isFullDiscovery && (
                <motion.section 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-zinc-900/40 border border-zinc-800 rounded-lg flex flex-col h-[450px]"
                >
                  <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <List size={18} className={cn(isDeepSpider ? "text-red-500" : "text-amber-500")} />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        {isDeepSpider ? "Deep Spider Queue" : "Target Queue"}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {isDeepSpider && (
                        <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 animate-pulse font-bold uppercase">
                          Deep Mode
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {stats.targetsTested} / {stats.targetsFound}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
                    {targetQueue.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center opacity-20">
                        <Search size={32} className="mb-2" />
                        <p className="text-[10px]">Queue empty. Start Scout engine.</p>
                      </div>
                    ) : (
                      targetQueue.map(target => (
                        <div key={target.id} className="bg-black/40 border border-zinc-800/50 rounded p-2 flex flex-col gap-1.5 group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              {target.type === 'login' && <ShieldAlert size={12} className="text-red-400 shrink-0" />}
                              {target.type === 'search' && <Search size={12} className="text-blue-400 shrink-0" />}
                              {target.type === 'form' && <FileSpreadsheet size={12} className="text-emerald-400 shrink-0" />}
                              {target.type === 'api' && <Zap size={12} className="text-purple-400 shrink-0" />}
                              {target.type === 'page' && <LinkIcon size={12} className="text-zinc-500 shrink-0" />}
                              <span className="text-[10px] font-mono truncate text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                {target.url.replace(homepageUrl, '') || '/'}
                              </span>
                            </div>
                            <div className="shrink-0 ml-2">
                              {target.status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />}
                              {target.status === 'scanning' && <RefreshCw size={10} className="text-amber-500 animate-spin" />}
                              {target.status === 'safe' && <ShieldCheck size={12} className="text-emerald-500" />}
                              {target.status === 'vulnerable' && <ShieldAlert size={12} className="text-red-500 animate-pulse" />}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {target.method && (
                              <span className={cn(
                                "text-[8px] px-1 rounded font-bold",
                                target.method === 'POST' ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"
                              )}>
                                {target.method}
                              </span>
                            )}
                            {target.isJSGenerated && (
                              <span className="text-[8px] px-1 bg-purple-500/10 text-purple-400 rounded font-bold">JS-DYNAMIC</span>
                            )}
                            {target.params && target.params.map((p, idx) => (
                              <span key={`${p}-${idx}`} className="text-[8px] px-1 bg-zinc-800 text-zinc-500 rounded border border-zinc-700">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Terminal Logs */}
            <section className={cn(
              "bg-black border border-zinc-800 rounded-lg flex flex-col h-[450px]",
              isFullDiscovery ? "xl:col-span-1" : "xl:col-span-2"
            )}>
              <div className="p-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase ml-2">engine.log</span>
                </div>
                <button onClick={() => setLogs([])} className="text-zinc-600 hover:text-zinc-400 p-1">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex-1 p-4 font-mono text-[10px] lg:text-[11px] overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
                {logs.length === 0 ? (
                  <div className="text-zinc-800 italic">Waiting for target...</div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className={cn(
                      "break-all leading-relaxed",
                      log.includes('ERROR') ? "text-red-500" : 
                      log.includes('SUCCESS') ? "text-emerald-400 font-bold" :
                      log.includes('VULNERABILITY') ? "text-red-400 animate-pulse" :
                      "text-zinc-400"
                    )}>
                      {log}
                    </div>
                  ))
                )}
                <div ref={logEndRef} />
              </div>
            </section>

            {/* Reports Section */}
            <section className="bg-zinc-900/30 border border-zinc-800 rounded-lg flex flex-col h-[350px] lg:h-[450px]">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet size={18} className="text-emerald-500" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Reports</h3>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {reports.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                {reports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-20">
                    <Archive size={40} className="mb-2" />
                    <p className="text-xs">No reports generated.</p>
                  </div>
                ) : (
                  reports.map(report => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={report.id} 
                      className="bg-black/40 border border-zinc-800 rounded-lg p-4 hover:border-emerald-500/50 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white mb-1 truncate">{report.site}</h4>
                          <p className="text-[10px] text-zinc-500">{report.date}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button 
                            onClick={() => setSelectedReport(report)}
                            className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                            title="Quick View Text"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => exportToText(report)}
                            className="p-2.5 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 hover:text-white transition-all"
                            title="Download TXT"
                          >
                            <FileText size={16} />
                          </button>
                          <button 
                            onClick={() => exportToCSV(report)}
                            className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                            title="Download CSV"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {report.type === 'consolidated' ? (
                          <div className="col-span-2 bg-zinc-900/50 p-2 rounded border border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <List size={14} className="text-amber-400" />
                              <span className="text-[10px] font-mono text-zinc-300">Batch Scan Results</span>
                            </div>
                            <span className="text-[10px] font-bold text-amber-500">{report.data.length} URLs</span>
                          </div>
                        ) : (
                          <>
                            <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800">
                              <span className="text-[8px] text-zinc-500 uppercase block mb-1">DB</span>
                              <span className="text-[10px] font-mono text-blue-400 truncate block">{report.database}</span>
                            </div>
                            <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800">
                              <span className="text-[8px] text-zinc-500 uppercase block mb-1">Table</span>
                              <span className="text-[10px] font-mono text-emerald-400 truncate block">{report.table}</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="bg-red-500/5 border border-red-500/20 p-2 rounded mb-3">
                        <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                          "{report.vulnerabilitySummary}"
                        </p>
                      </div>

                      {/* Hash Cracker Quick Access */}
                      {report.data.some(row => Object.values(row).some(isHash)) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Cpu size={12} className="text-amber-500" />
                            <span className="text-[9px] font-bold text-zinc-500 uppercase">Detected Hashes</span>
                          </div>
                          <div className="space-y-1.5">
                            {report.data.slice(0, 3).map((row, i) => {
                              const hashKey = Object.keys(row).find(k => isHash(row[k]));
                              if (!hashKey) return null;
                              const hash = row[hashKey];
                              const isCracking = crackingHashes.has(hash);
                              const cracked = crackedPasswords[hash];

                              return (
                                <div key={i} className="flex items-center justify-between bg-black/40 border border-zinc-800 rounded p-2">
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[8px] text-zinc-600 font-mono truncate">{hash}</span>
                                    {cracked && (
                                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                        <Unlock size={10} /> {cracked}
                                      </span>
                                    )}
                                  </div>
                                  <button 
                                    onClick={() => handleDecipherHash(hash)}
                                    disabled={isCracking || !!cracked}
                                    className={cn(
                                      "ml-2 px-2 py-1 rounded text-[9px] font-bold transition-all shrink-0",
                                      cracked 
                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                        : isCracking
                                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse"
                                          : "bg-red-600 text-white hover:bg-red-500"
                                    )}
                                  >
                                    {cracked ? 'CRACKED' : isCracking ? 'CRACKING...' : 'DECIPHER'}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Global Status Bar */}
        <footer className="h-12 bg-black border-t border-zinc-800 flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 min-w-[100px]">
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Progress</span>
            <span className="text-[10px] font-mono text-white">
              {isFullDiscovery 
                ? stats.targetsFound > 0 ? Math.round((stats.targetsTested / stats.targetsFound) * 100) : 0
                : Math.round((stats.payloadsSent / stats.totalPayloads) * 100)
              }%
            </span>
          </div>
          <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden relative">
            <motion.div 
              className={cn(
                "h-full shadow-[0_0_10px_rgba(220,38,38,0.5)]",
                isFullDiscovery ? "bg-amber-500" : "bg-red-600"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${
                isFullDiscovery 
                  ? stats.targetsFound > 0 ? (stats.targetsTested / stats.targetsFound) * 100 : 0
                  : (stats.payloadsSent / stats.totalPayloads) * 100
              }%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold shrink-0">
            <div className={cn(
              "w-2 h-2 rounded-full", 
              stats.status !== 'idle' && stats.status !== 'completed' ? "animate-ping" : "bg-zinc-700",
              stats.status === 'crawling' ? "bg-amber-500" : stats.status === 'scanning' ? "bg-red-500" : "bg-zinc-700"
            )} />
            <span className={cn(
              "hidden xs:inline", 
              stats.status === 'crawling' ? "text-amber-500" : stats.status === 'scanning' ? "text-red-500" : "text-zinc-600"
            )}>
              {stats.status === 'crawling' ? "CRAWLING" : stats.status === 'scanning' ? "ACTIVE" : "IDLE"}
            </span>
          </div>
        </footer>
      </main>

      {/* Success Notification */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <Smartphone size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Device-Friendly Text Report</h3>
                    <p className="text-[10px] text-zinc-500 font-mono">{selectedReport.site}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => copyToClipboard(convertToText(selectedReport))}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors flex items-center gap-2"
                  >
                    <Copy size={16} />
                    <span className="hidden sm:inline text-xs font-bold">Copy</span>
                  </button>
                  <button 
                    onClick={() => setSelectedReport(null)}
                    className="p-2 bg-zinc-800 hover:bg-red-500/20 hover:text-red-500 rounded-lg text-zinc-400 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 font-mono text-xs sm:text-sm text-emerald-500/90 leading-relaxed bg-black/40">
                <pre className="whitespace-pre-wrap break-words">
                  {convertToText(selectedReport)}
                </pre>
              </div>

              <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-center">
                <p className="text-[10px] text-zinc-500 italic">Formatted for readability on all mobile and desktop devices.</p>
              </div>
            </motion.div>
          </div>
        )}

        {stats.status === 'completed' && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-16 left-4 right-4 lg:left-auto lg:right-6 lg:w-80 bg-emerald-600 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 z-50 border border-emerald-400/30"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm">SUCCESSFUL DUMP</h4>
              <p className="text-xs text-emerald-100 truncate">Report generated and saved.</p>
            </div>
            <button onClick={() => setStats(prev => ({ ...prev, status: 'idle' }))} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
