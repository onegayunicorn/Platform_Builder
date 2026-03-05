/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Terminal, 
  Smartphone, 
  CheckCircle2, 
  Github, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Palette, 
  Code2, 
  BookOpen, 
  AlertCircle, 
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Activity,
  BarChart3,
  Globe,
  Cpu,
  Copy,
  Check,
  Play,
  Circle,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data for Dashboard Preview ---
const chartData = [
  { time: "00:00", value: 400 },
  { time: "04:00", value: 300 },
  { time: "08:00", value: 200 },
  { time: "12:00", value: 450 },
  { time: "16:00", value: 190 },
  { time: "20:00", value: 350 },
  { time: "24:00", value: 200 },
];

// --- Components ---

const SectionHeader = ({ title, subtitle, icon: Icon }: { title: string, subtitle?: string, icon?: any }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      {Icon && <Icon className="w-6 h-6 text-blue-500" />}
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
    </div>
    {subtitle && <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>}
  </div>
);

const WorkflowStep = ({ phase, title, time, output, icon: Icon, color }: { phase: string, title: string, time: string, output: string, icon: any, color: string }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="relative p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
  >
    <div className={cn("absolute top-0 left-0 w-1 h-full", color)} />
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2 rounded-lg", color.replace('bg-', 'bg-opacity-10 text-'))}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">{phase}</span>
    </div>
    <h3 className="text-lg font-semibold mb-1 text-slate-900 dark:text-white">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{output}</p>
    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
      <Zap className="w-3 h-3" />
      <span>{time}</span>
    </div>
  </motion.div>
);

const CodeBlock = ({ code, language = "bash", title }: { code: string, language?: string, title?: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 my-4 group relative">
      {title && (
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
          <span className="text-xs font-mono text-slate-400">{title}</span>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
          </div>
        </div>
      )}
      <button 
        onClick={copyToClipboard}
        className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-10"
        title="Copy to clipboard"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-blue-300 leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  );
};

const TerminalOutput = ({ logs, className }: { logs: string[], className?: string }) => {
  const terminalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={cn("bg-black text-green-400 font-mono p-4 rounded-xl h-64 overflow-y-auto border border-slate-800 shadow-2xl", className)} ref={terminalRef}>
      {logs.length === 0 ? (
        <div className="text-slate-600 italic">Waiting for process start...</div>
      ) : (
        logs.map((line, i) => (
          <div key={i} className="mb-1 flex gap-2">
            <span className="text-blue-500 shrink-0">$</span>
            <span className="break-all">{line}</span>
          </div>
        ))
      )}
    </div>
  );
};

const ThemeCard = ({ theme, id, bestFor, colors, mood, active, onSelect }: { theme: string, id: string, bestFor: string, colors: string, mood: string, active: boolean, onSelect: (id: string) => void }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    onClick={() => onSelect(id)}
    className={cn(
      "p-4 rounded-xl border transition-all cursor-pointer",
      active 
        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 ring-2 ring-blue-500/20" 
        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600"
    )}
  >
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-bold text-slate-900 dark:text-white">{theme}</h4>
      <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500">{mood}</span>
    </div>
    <p className="text-xs text-slate-500 mb-3">Best for: {bestFor}</p>
    <div className="flex gap-1">
      {colors.split(', ').map((c, i) => (
        <div key={i} className="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div className="h-full w-full bg-blue-500" style={{ opacity: 1 - (i * 0.2) }} />
        </div>
      ))}
    </div>
  </motion.div>
);

// --- Types ---
type PhaseStatus = 'pending' | 'in-progress' | 'completed';

interface ProjectState {
  name: string;
  theme: string;
  phases: {
    repo: PhaseStatus;
    web: PhaseStatus;
    android: PhaseStatus;
    tests: PhaseStatus;
    deploy: PhaseStatus;
  };
  androidApiLevel: number;
  testSuiteSize: 'small' | 'medium' | 'large';
}

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);

  // Project State with Persistence
  const [project, setProject] = useState<ProjectState>(() => {
    const saved = localStorage.getItem('platform-builder-project');
    return saved ? JSON.parse(saved) : {
      name: '',
      theme: 'quantum-nexus',
      phases: {
        repo: 'pending',
        web: 'pending',
        android: 'pending',
        tests: 'pending',
        deploy: 'pending'
      },
      androidApiLevel: 24,
      testSuiteSize: 'medium'
    };
  });

  useEffect(() => {
    localStorage.setItem('platform-builder-project', JSON.stringify(project));
  }, [project]);

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', project.theme);
  }, [project.theme]);

  const simulateCommand = async (cmd: string, output: string[], duration = 1500) => {
    setTerminalLogs(prev => [...prev, cmd]);
    await new Promise(r => setTimeout(r, 500));
    for (const line of output) {
      setTerminalLogs(prev => [...prev, line]);
      await new Promise(r => setTimeout(r, duration / output.length));
    }
  };

  const handleGetStarted = async () => {
    if (isBuilding) return;
    setIsBuilding(true);
    setActiveTab('workflow');
    
    setProject(prev => ({
      ...prev,
      name: prev.name || 'My Awesome Platform',
      phases: { ...prev.phases, repo: 'in-progress' }
    }));

    await simulateCommand('python scripts/init_github_repo.py "My Awesome Platform"', [
      '✓ Initializing local git repository...',
      '✓ Creating directory structure...',
      '✓ Generating boilerplate code...',
      '✓ Authenticating with GitHub CLI...',
      '✓ Creating private repository on GitHub...',
      '✓ Pushing initial commit...',
      '■ Repository ready!'
    ]);

    setProject(prev => ({
      ...prev,
      phases: { ...prev.phases, repo: 'completed', web: 'in-progress' }
    }));

    await simulateCommand('npm run build:web', [
      '✓ Compiling React components...',
      '✓ Processing Tailwind CSS...',
      '✓ Bundling assets with Vite...',
      '✓ Generating interactive dashboard...',
      '■ Web platform ready!'
    ]);

    setProject(prev => ({
      ...prev,
      phases: { ...prev.phases, web: 'completed' }
    }));

    setIsBuilding(false);
  };

  const resetProject = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      const initialState: ProjectState = {
        name: '',
        theme: 'quantum-nexus',
        phases: {
          repo: 'pending',
          web: 'pending',
          android: 'pending',
          tests: 'pending',
          deploy: 'pending'
        },
        androidApiLevel: 24,
        testSuiteSize: 'medium'
      };
      setProject(initialState);
      setTerminalLogs([]);
      setActiveTab('overview');
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${project.name || 'platform'}-config.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const navigation = [
    { id: 'overview', name: 'Overview', icon: Layout },
    { id: 'workflow', name: 'Workflow', icon: Activity },
    { id: 'themes', name: 'Design Themes', icon: Palette },
    { id: 'scripts', name: 'Scripts Ref', icon: Terminal },
    { id: 'templates', name: 'Templates', icon: Code2 },
    { id: 'android', name: 'Android Setup', icon: Smartphone },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-100 font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          !isSidebarOpen ? "-translate-x-full" : "w-64 translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          <div className={cn(
            "p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between",
            isCollapsed && "lg:px-4 lg:justify-center"
          )}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-bold text-lg tracking-tight whitespace-nowrap"
                >
                  Platform Builder
                </motion.span>
              )}
            </div>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isCollapsed && "lg:px-0 lg:justify-center",
                  activeTab === item.id 
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                )}
                title={isCollapsed ? item.name : ""}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            {isCollapsed ? (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900 text-white text-xs">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-3 h-3 text-green-400" />
                  <span className="font-bold">v1.0.0 Stable</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Production-ready platform automation skill.
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
              {navigation.find(n => n.id === activeTab)?.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Live Server</span>
            </div>
            <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                  <div className="relative p-10 rounded-3xl bg-slate-900 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent" />
                    <div className="relative z-10 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold mb-6">
                        <Zap className="w-3 h-3" />
                        <span>AUTOMATION SKILL</span>
                      </div>
                      <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
                        Build Production Platforms in <span className="text-blue-400">Minutes</span>.
                      </h1>
                      <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                        The Platform Builder skill automates the creation of complete, production-ready platform projects. 
                        Orchestrate website development, Android APK creation, and test suites into a cohesive workflow.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <button 
                          onClick={handleGetStarted}
                          disabled={isBuilding}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-all flex items-center gap-2"
                        >
                          {isBuilding ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Get Started"} <ChevronRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={handleExport}
                          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" /> Export Config
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <Globe className="w-8 h-8 text-blue-500 mb-4" />
                      <h3 className="text-lg font-bold mb-2">Web Platform</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">React-based landing pages and interactive dashboards with live dev servers.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <Smartphone className="w-8 h-8 text-purple-500 mb-4" />
                      <h3 className="text-lg font-bold mb-2">Android APK</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Native Android apps with Material Design, compiled and ready for deployment.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <ShieldCheck className="w-8 h-8 text-emerald-500 mb-4" />
                      <h3 className="text-lg font-bold mb-2">618+ Tests</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Comprehensive unit, integration, and performance tests generated automatically.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <SectionHeader title="When to Use" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Build a complete platform (Web + Mobile)",
                        "Create SaaS applications with specialized backends",
                        "Develop Quantum / AI platforms",
                        "Automate platform scaffolding",
                        "Set up GitHub repositories with proper structure",
                        "Generate massive test suites for reliability"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'workflow' && (
                <motion.div
                  key="workflow"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <SectionHeader 
                    title="Five-Phase Workflow" 
                    subtitle="A structured approach from repository initialization to live deployment."
                    icon={Activity}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                        <div className={cn(
                          "p-6 rounded-2xl border transition-all",
                          project.phases.repo === 'completed' ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        )}>
                          <div className="flex items-center gap-3 mb-4">
                            {project.phases.repo === 'completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : project.phases.repo === 'in-progress' ? <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" /> : <Circle className="w-5 h-5 text-slate-300" />}
                            <h3 className="font-bold">1. Repository Setup</h3>
                          </div>
                          <p className="text-sm text-slate-500">GitHub repo initialized with base structure.</p>
                        </div>

                        <div className={cn(
                          "p-6 rounded-2xl border transition-all",
                          project.phases.web === 'completed' ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        )}>
                          <div className="flex items-center gap-3 mb-4">
                            {project.phases.web === 'completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : project.phases.web === 'in-progress' ? <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" /> : <Circle className="w-5 h-5 text-slate-300" />}
                            <h3 className="font-bold">2. Web Platform</h3>
                          </div>
                          <p className="text-sm text-slate-500">React dashboard and landing page generated.</p>
                        </div>

                        <div className={cn(
                          "p-6 rounded-2xl border transition-all",
                          project.phases.android === 'completed' ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        )}>
                          <div className="flex items-center gap-3 mb-4">
                            {project.phases.android === 'completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : project.phases.android === 'in-progress' ? <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" /> : <Circle className="w-5 h-5 text-slate-300" />}
                            <h3 className="font-bold">3. Android APK</h3>
                          </div>
                          <p className="text-sm text-slate-500">Native Android app compiled and ready.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <Terminal className="w-5 h-5 text-blue-500" />
                          Build Terminal
                        </h3>
                        <button 
                          onClick={() => setTerminalLogs([])}
                          className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        >
                          Clear Logs
                        </button>
                      </div>
                      <TerminalOutput logs={terminalLogs} />
                      
                      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-slate-400" />
                          Project Controls
                        </h4>
                        <div className="space-y-4">
                          <button 
                            onClick={handleGetStarted}
                            disabled={isBuilding}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
                          >
                            {isBuilding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            Resume Build
                          </button>
                          <button 
                            onClick={resetProject}
                            className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Reset Project
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      Output Preview: Web Dashboard
                    </h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                          <XAxis 
                            dataKey="time" 
                            stroke="#94a3b8" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <YAxis 
                            stroke="#94a3b8" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(value) => `${value}`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#0f172a', 
                              border: 'none', 
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3b82f6" 
                            strokeWidth={3} 
                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-8">
                      {[
                        { label: 'Active Users', value: '1.2M', trend: '+12%' },
                        { label: 'QPS', value: '847k', trend: '+5%' },
                        { label: 'Uptime', value: '99.99%', trend: 'Stable' },
                        { label: 'Latency', value: '0.1ms', trend: '-8%' },
                      ].map((stat, i) => (
                        <div key={i} className="text-center">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{stat.label}</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
                          <p className={cn("text-[10px] font-bold", stat.trend.includes('+') ? "text-green-500" : stat.trend === 'Stable' ? "text-blue-500" : "text-red-500")}>
                            {stat.trend}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'themes' && (
                <motion.div
                  key="themes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <SectionHeader 
                    title="Design Themes" 
                    subtitle="Choose a design theme early — it guides all visual decisions across web and mobile."
                    icon={Palette}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ThemeCard 
                      theme="Quantum Nexus" 
                      id="quantum-nexus"
                      bestFor="Tech / AI" 
                      colors="Navy, Electric Blue, Green" 
                      mood="Futuristic" 
                      active={project.theme === 'quantum-nexus'}
                      onSelect={(id) => setProject(prev => ({ ...prev, theme: id }))}
                    />
                    <ThemeCard 
                      theme="Minimalist" 
                      id="minimalist"
                      bestFor="SaaS" 
                      colors="White, Grays, Accent" 
                      mood="Clean" 
                      active={project.theme === 'minimalist'}
                      onSelect={(id) => setProject(prev => ({ ...prev, theme: id }))}
                    />
                    <ThemeCard 
                      theme="Bold" 
                      id="bold"
                      bestFor="Creative" 
                      colors="Vibrant Gradients" 
                      mood="Dynamic" 
                      active={project.theme === 'bold'}
                      onSelect={(id) => setProject(prev => ({ ...prev, theme: id }))}
                    />
                    <ThemeCard 
                      theme="Professional" 
                      id="professional"
                      bestFor="Enterprise" 
                      colors="Blues, Grays" 
                      mood="Trustworthy" 
                      active={project.theme === 'professional'}
                      onSelect={(id) => setProject(prev => ({ ...prev, theme: id }))}
                    />
                    <ThemeCard 
                      theme="Neon" 
                      id="neon"
                      bestFor="Gaming / Web3" 
                      colors="Black, Neon Accents" 
                      mood="Edgy" 
                      active={project.theme === 'neon'}
                      onSelect={(id) => setProject(prev => ({ ...prev, theme: id }))}
                    />
                  </div>

                  <div className="mt-12 p-8 rounded-2xl bg-blue-600 text-white">
                    <h3 className="text-xl font-bold mb-4">Android API Recommendation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 rounded-xl bg-white/10 border border-white/20">
                        <p className="text-xs font-bold opacity-60 mb-1">API LEVEL 24</p>
                        <p className="text-sm font-bold mb-2">Android 7.0</p>
                        <p className="text-xs opacity-80">~95% device coverage. Recommended for broad compatibility.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/10 border border-white/20">
                        <p className="text-xs font-bold opacity-60 mb-1">API LEVEL 26</p>
                        <p className="text-sm font-bold mb-2">Android 8.0</p>
                        <p className="text-xs opacity-80">~90% device coverage. Modern features support.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/10 border border-white/20">
                        <p className="text-xs font-bold opacity-60 mb-1">API LEVEL 28</p>
                        <p className="text-sm font-bold mb-2">Android 9.0</p>
                        <p className="text-xs opacity-80">~85% device coverage. Latest features and security.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'scripts' && (
                <motion.div
                  key="scripts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <SectionHeader 
                    title="Scripts Reference" 
                    subtitle="Core automation scripts to initialize and build your platform."
                    icon={Terminal}
                  />
                  
                  <div className="space-y-12">
                    <section>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <ChevronRight className="w-5 h-5 text-blue-500" />
                        init_github_repo.py
                      </h3>
                      <p className="text-slate-500 mb-4">Initializes a GitHub repository with a standard project structure.</p>
                      <CodeBlock 
                        title="Usage"
                        code={'python scripts/init_github_repo.py "My Platform"'} 
                      />
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                        <h4 className="text-sm font-bold mb-3 text-slate-400 uppercase tracking-widest">Directory Structure Created</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-sm font-mono">
                          <div className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-blue-500" /> src/core</div>
                          <div className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-blue-500" /> src/quantum</div>
                          <div className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-blue-500" /> src/api</div>
                          <div className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-blue-500" /> deployment/</div>
                          <div className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-blue-500" /> tests/</div>
                          <div className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-blue-500" /> android/</div>
                          <div className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-blue-500" /> website/</div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <ChevronRight className="w-5 h-5 text-blue-500" />
                        generate_test_suite.py
                      </h3>
                      <p className="text-slate-500 mb-4">Generates a comprehensive test suite with unit, integration, and performance tests.</p>
                      <CodeBlock 
                        title="Usage"
                        code="python scripts/generate_test_suite.py" 
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                          <p className="text-xs font-bold text-slate-400 mb-1">UNIT TESTS</p>
                          <p className="text-2xl font-bold">247</p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                          <p className="text-xs font-bold text-slate-400 mb-1">INTEGRATION</p>
                          <p className="text-2xl font-bold">124</p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                          <p className="text-xs font-bold text-slate-400 mb-1">PERFORMANCE</p>
                          <p className="text-2xl font-bold">42</p>
                        </div>
                      </div>
                    </section>
                  </div>
                </motion.div>
              )}

              {activeTab === 'templates' && (
                <motion.div
                  key="templates"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <SectionHeader 
                    title="Templates Reference" 
                    subtitle="Pre-built templates for web and mobile components."
                    icon={Code2}
                  />

                  <div className="grid grid-cols-1 gap-8">
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-bold mb-1">DashboardTemplate.tsx</h3>
                          <p className="text-sm text-slate-500">React Dashboard Component</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold">REACT</span>
                          <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold">WEB</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-slate-400 font-bold">DEPENDENCIES:</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Recharts</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Tailwind CSS</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Lucide</span>
                        </div>
                        <CodeBlock 
                          title="DashboardTemplate.tsx (abbreviated)"
                          code={`export default function DashboardTemplate() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-2">Mission Control</h1>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Users" value="1,000,000" trend="+12%" />
        {/* ... */}
      </div>
    </div>
  );
}`}
                        />
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-bold mb-1">ActivityTemplate.java</h3>
                          <p className="text-sm text-slate-500">Android Activity Base Class</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-[10px] font-bold">JAVA</span>
                          <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold">ANDROID</span>
                        </div>
                      </div>
                      <CodeBlock 
                        title="ActivityTemplate.java (abbreviated)"
                        code={`public class ActivityTemplate extends AppCompatActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_template);
    initializeViews();
    setupListeners();
    loadData();
  }
}`}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'android' && (
                <motion.div
                  key="android"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <SectionHeader 
                    title="Android Setup Guide" 
                    subtitle="Complete guide to installing the Android SDK and building APKs from the command line."
                    icon={Smartphone}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-blue-500" />
                          System Requirements
                        </h4>
                        <ul className="space-y-3 text-sm">
                          <li className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-slate-500">OS</span>
                            <span className="font-medium">Linux / macOS / Windows</span>
                          </li>
                          <li className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-slate-500">Java</span>
                            <span className="font-medium">17+ required</span>
                          </li>
                          <li className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                            <span className="text-slate-500">Disk Space</span>
                            <span className="font-medium">~5 GB for SDK</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <h4 className="font-bold mb-4">Building the APK</h4>
                        <CodeBlock 
                          title="Build Commands"
                          code={`cd android
./gradlew assembleDebug
# Output: app/build/outputs/apk/debug/app-debug.apk`}
                        />
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900 text-white">
                      <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-blue-400" />
                        Quick Install — Ubuntu/Debian
                      </h4>
                      <div className="text-[11px] font-mono space-y-4 opacity-80">
                        <div>
                          <p className="text-blue-400"># 1. Install Java 17</p>
                          <p>sudo apt-get install openjdk-17-jdk</p>
                        </div>
                        <div>
                          <p className="text-blue-400"># 2. Download SDK Command-line tools</p>
                          <p>mkdir -p ~/android-sdk/cmdline-tools</p>
                          <p>cd ~/android-sdk</p>
                          <p>wget https://dl.google.com/android/repository/...</p>
                        </div>
                        <div>
                          <p className="text-blue-400"># 3. Set Environment Variables</p>
                          <p>export ANDROID_HOME=~/android-sdk</p>
                          <p>export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH</p>
                        </div>
                        <div>
                          <p className="text-blue-400"># 4. Accept Licenses</p>
                          <p>yes | sdkmanager --licenses</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'troubleshooting' && (
                <motion.div
                  key="troubleshooting"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <SectionHeader 
                    title="Troubleshooting" 
                    subtitle="Common issues and their solutions."
                    icon={AlertCircle}
                  />

                  <div className="space-y-4">
                    {[
                      { 
                        error: "ANDROID_HOME not set", 
                        fix: "export ANDROID_HOME=~/android-sdk",
                        category: "Android SDK"
                      },
                      { 
                        error: "Java version too old", 
                        fix: "Install OpenJDK 17 or higher",
                        category: "Java"
                      },
                      { 
                        error: "Port 3000 in use", 
                        fix: "Kill process on port 3000 or change PORT env",
                        category: "Web Dev"
                      },
                      { 
                        error: "618/618 tests failed", 
                        fix: "Check python3 version (must be 3.11+)",
                        category: "Testing"
                      }
                    ].map((item, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1 block">{item.category}</span>
                          <h4 className="font-bold text-red-500">{item.error}</h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono">
                            {item.fix}
                          </div>
                          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
          <p>© 2026 Platform Builder | Full-Stack Platform Automation Skill</p>
        </footer>
      </main>
    </div>
  );
}
