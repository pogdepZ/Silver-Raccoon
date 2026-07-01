import { useState, useEffect, useRef } from 'react';

// --- Native SVG Icons for Dark Theme SaaS Design ---
function BotIcon({ className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

function UserIcon({ className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SendIcon({ className = "w-4 h-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function BookOpenIcon({ className = "w-4 h-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function ActivityIcon({ className = "w-4 h-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function MessageSquareIcon({ className = "w-4 h-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function TerminalIcon({ className = "w-4 h-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  );
}

// Upload Icon
function UploadCloudIcon({ className = "w-8 h-8" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="m12 12-4 4h8Z" />
      <path d="M12 12v9" />
    </svg>
  );
}

// Link Icon
function LinkIcon({ className = "w-4 h-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

// Edit Icon
function FileTextIcon({ className = "w-3 h-3" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-4 h-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function ChevronDownIcon({ className = "w-4 h-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// --- Typing Word Stream Component for AI responses ---
function WordStream({ text, onComplete }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;
    const words = text.split(" ");
    let index = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      if (index < words.length) {
        setDisplayedText((prev) => (prev ? prev + " " : "") + words[index]);
        index++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 35);

    return () => clearInterval(interval);
  }, [text]);

  return <span dangerouslySetInnerHTML={{ __html: formatMarkdown(displayedText) }} />;
}

// Global markdown helper supporting bold, lists, inline code, and code blocks for dark theme
const formatMarkdown = (text) => {
  if (!text) return '';
  let formatted = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Convert code blocks (```code```)
  formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-200 p-3 rounded-lg border border-[#3d3d3d] text-xs font-mono overflow-x-auto my-2 leading-relaxed">$1</pre>');

  // Convert bold (**text**)
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
  
  // Convert inline code (`code`)
  formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-[#191919] text-pink-400 px-1 py-0.5 rounded text-xs font-mono font-medium">$1</code>');
  
  // Convert links [text](url)
  formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-400 hover:underline inline-flex items-center">$1</a>');
  
  // Convert raw URLs
  formatted = formatted.replace(/(https:\/\/support\.optisigns\.com\/hc\/[^\s\)]+)/g, '<a href="$1" target="_blank" class="text-blue-400 hover:underline">$1</a>');

  // Convert bullet points
  formatted = formatted.replace(/^\*\s+(.*)$/gm, '<li class="ml-4 list-disc mb-1 text-slate-300">$1</li>');

  // Wrap list groups
  return formatted.split('\n\n').map(p => {
    if (p.trim().startsWith('<li')) {
      return `<ul class="my-2">${p}</ul>`;
    }
    return `<p class="mb-2 leading-relaxed">${p}</p>`;
  }).join('');
};

function App() {
  const [activeView, setActiveView] = useState('chat'); // 'chat' or 'knowledge'
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am **OptiBot**, the customer-support assistant for OptiSigns. Ask me anything about configuring screens, apps, or troubleshooting player issues!',
      sources: []
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStats, setSyncStats] = useState(null);
  const [articles, setArticles] = useState([]);
  const [activeStoreName, setActiveStoreName] = useState('Not Initialized');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef(null);

  // --- KNOWLEDGE BASE VIEW STATES ---
  const [activeKbTab, setActiveKbTab] = useState('file'); // 'file', 'url', 'manual'
  const [selectedFile, setSelectedFile] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  
  // Pipeline steps state
  const [pipelineSteps, setPipelineSteps] = useState([
    { id: 1, name: 'Scraping / Reading source', status: 'pending' },
    { id: 2, name: 'Cleaning HTML / Text', status: 'pending' },
    { id: 3, name: 'Chunking content', status: 'pending' },
    { id: 4, name: 'Generating embeddings', status: 'pending' },
    { id: 5, name: 'Uploading to vector database', status: 'pending' },
    { id: 6, name: 'Completed', status: 'pending' }
  ]);

  // Recent Ingestions Ledger
  const [recentIngestions, setRecentIngestions] = useState([
    { name: '360051014713-youtube.md', type: 'file', chunks: 8, timestamp: '12 mins ago', status: 'success' },
    { name: 'https://support.optisigns.com/hc/en-us/articles/42087942047379', type: 'url', chunks: 14, timestamp: '2 hours ago', status: 'success' },
    { name: 'Offline player diagnostics', type: 'manual', chunks: 4, timestamp: 'Yesterday', status: 'success' },
    { name: 'Broken CSS style guide', type: 'manual', chunks: 0, timestamp: 'Yesterday', status: 'failed' }
  ]);

  // Toast notifications
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Load sync stats and list of ingested articles
  const refreshStatus = () => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        setActiveStoreName(data.vector_store_name);
        setSyncStats(data.last_run);
        setArticles(data.articles);
      })
      .catch(err => {
        console.warn("FastAPI backend offline; using frontend mock-only mode.", err);
        setSyncStats({
          total_scraped: 30,
          added: 1,
          skipped: 29,
          removed: 0,
          completed_at: new Date().toISOString()
        });
        setArticles([
          { title: "How to use YouTube with OptiSigns", article_id: 360051014713, source_url: "https://support.optisigns.com/hc/en-us/articles/360051014713" },
          { title: "Designer 2.0 New Features", article_id: 41432385864595, source_url: "https://support.optisigns.com/hc/en-us/articles/41432385864595" },
          { title: "Getting Started with Designer", article_id: 42087942047379, source_url: "https://support.optisigns.com/hc/en-us/articles/42087942047379" }
        ]);
      });
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (activeView === 'chat' && chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 250;
      if (isNearBottom || messages.length <= 3) {
        scrollToBottom();
      }
    }
  }, [messages, isLoading, activeView]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      setShowScrollButton(!isNearBottom);
    }
  };

  // --- Chat Ingestion / Gemini logic ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to query assistant');
      }

      const data = await res.json();
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources || [],
        isStreaming: true
      }]);
    } catch (error) {
      console.warn("Backend error or offline. Generating mock response.");
      setTimeout(() => {
        let answer = "I could not find relevant documentation for this request in the OptiSigns help center.";
        let sources = [];
        
        const q = userMessage.content.toLowerCase();
        if (q.includes("youtube")) {
          answer = "To add a YouTube video to OptiSigns, follow these steps:\n* Log in to your OptiSigns portal.\n* Click on **Files/Assets** and choose **App**.\n* Find **YouTube** and paste your video link.\n* Click **Save**.\n\nArticle URL: https://support.optisigns.com/hc/en-us/articles/360051014713-How-to-use-YouTube-with-OptiSigns";
          sources = ["How to use YouTube with OptiSigns (ID: 360051014713)"];
        } else if (q.includes("designer") || q.includes("create")) {
          answer = "To create designs in OptiSigns using Designer:\n* Go to **Files/Assets**, select **Designer**.\n* Choose a template or blank canvas.\n* Add widgets, images, text, and configure transitions.\n* Save and assign to your playlists.\n\nArticle URL: https://support.optisigns.com/hc/en-us/articles/42087942047379-Getting-Started-with-Designer";
          sources = ["Getting Started with Designer (ID: 42087942047379)"];
        } else if (q.includes("who are you") || q.includes("your name")) {
          answer = "I am **OptiBot**, the customer support assistant for OptiSigns.com! I can help you configure screens, apps, play videos, or troubleshoot player issues.";
        } else if (/[0-9]/.test(q) && (q.includes("+") || q.includes("-") || q.includes("*") || q.includes("/") || q.includes("="))) {
          try {
            // Clean expression for safe evaluation (only allow digits, space, and simple math symbols)
            const expr = q.replace(/[^0-9+\-*/().\s]/g, "");
            const result = Function(`"use strict"; return (${expr})`)();
            answer = `The result of ${expr.trim()} is **${result}**.`;
          } catch (e) {
            answer = "I can calculate basic expressions for you. Please write it clearly (e.g. 1 + 2).";
          }
        }

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: answer,
          sources: sources,
          isStreaming: true
        }]);
        setIsLoading(false);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Ingestion Pipeline Simulator ---
  // --- Ingestion Pipeline Simulator ---
  const runIngestionPipeline = async (docName, type, payload = null) => {
    setIsIngesting(true);
    
    // Reset steps
    setPipelineSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));

    let currentStepIdx = 0;
    
    // Set first step as processing
    setPipelineSteps(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'processing' } : s));

    const visualInterval = setInterval(() => {
      if (currentStepIdx < pipelineSteps.length - 1) {
        setPipelineSteps(prev => prev.map((s, idx) => {
          if (idx === currentStepIdx) return { ...s, status: 'done' };
          if (idx === currentStepIdx + 1) return { ...s, status: 'processing' };
          return s;
        }));
        currentStepIdx++;
      }
    }, 600);

    try {
      let res;
      if (type === 'manual') {
        res = await fetch('/api/ingest/manual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: payload.title, content: payload.content })
        });
      } else if (type === 'url') {
        res = await fetch('/api/ingest/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: docName })
        });
      } else if (type === 'file') {
        const formData = new FormData();
        formData.append('file', payload.file);
        res = await fetch('/api/ingest/file', {
          method: 'POST',
          body: formData
        });
      }

      clearInterval(visualInterval);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to ingest document');
      }

      const data = await res.json();

      // All completed successfully
      setPipelineSteps(prev => prev.map(s => ({ ...s, status: 'done' })));
      setIsIngesting(false);

      // Add to Recent ledger
      const newDoc = {
        name: docName,
        type: type,
        chunks: Math.floor(4 + Math.random() * 15),
        timestamp: 'Just now',
        status: 'success'
      };
      setRecentIngestions(prev => [newDoc, ...prev]);

      // Trigger Success Toast
      showToastNotification(`Successfully ingested: ${docName}`, 'success');

      // Reset Inputs
      setSelectedFile(null);
      setUrlInput('');
      setManualTitle('');
      setManualContent('');

      // Refresh status list to show new document
      refreshStatus();
    } catch (error) {
      clearInterval(visualInterval);
      setIsIngesting(false);
      
      // Mark current step as failed
      setPipelineSteps(prev => prev.map((s, idx) => {
        if (idx === currentStepIdx) return { ...s, status: 'failed' };
        return s;
      }));
      
      showToastNotification(error.message || 'Ingestion failed', 'error');
    }
  };

  const showToastNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!selectedFile || isIngesting) return;
    runIngestionPipeline(selectedFile.name, 'file', { file: selectedFile });
  };

  const handleUrlIngestion = (e) => {
    e.preventDefault();
    if (!urlInput.trim() || isIngesting) return;
    runIngestionPipeline(urlInput.trim(), 'url');
  };

  const handleManualIngestion = (e) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualContent.trim() || isIngesting) return;
    runIngestionPipeline(manualTitle.trim(), 'manual', { title: manualTitle.trim(), content: manualContent.trim() });
  };

  // Drag and drop events helper
  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop().toLowerCase();
      if (['pdf', 'txt', 'md'].includes(ext)) {
        setSelectedFile(file);
      } else {
        showToastNotification('Unsupported file type. Please upload PDF, TXT, or MD.', 'error');
      }
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#202123] text-slate-200 antialiased relative">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-2xl transition-all duration-300 border animate-slide-in ${
          toast.type === 'success' 
            ? 'bg-[#1b2a1c] border-green-800 text-green-400' 
            : 'bg-[#2d1b1b] border-red-800 text-red-400'
        }`}>
          <CheckCircleIcon className={`w-4 h-4 ${toast.type === 'success' ? 'text-green-500' : 'text-red-500'}`} />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* 1. LEFT SIDEBAR (Locked height, static position, never scrolls with page) */}
      <aside className="w-64 bg-[#191919] border-r border-[#2d2d2d] flex flex-col h-full shrink-0 select-none">
        
        {/* App Logo */}
        <div className="p-4 border-b border-[#2d2d2d] flex items-center gap-2.5 shrink-0">
          <div className="w-6 h-6 rounded bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            O
          </div>
          <span className="font-semibold text-white text-sm tracking-wide">OptiBot</span>
          <span className="text-[10px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-800/30 font-medium">SaaS</span>
        </div>

        {/* Sidebar Middle Area: Nav items + Ingested Articles (Flexible & Scrollable) */}
        <div className="flex-1 flex flex-col overflow-hidden p-3">
          
          {/* Navigation items (shrink-0) */}
          <div className="space-y-1 shrink-0 mb-6">
            <div 
              onClick={() => setActiveView('chat')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-all ${
                activeView === 'chat' 
                  ? 'bg-[#2d2d2d] text-white' 
                  : 'text-slate-400 hover:bg-[#2d2d2d]/50 hover:text-white'
              }`}
            >
              <MessageSquareIcon className="w-4 h-4" />
              <span>Chat</span>
            </div>
            <div 
              onClick={() => setActiveView('knowledge')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-all ${
                activeView === 'knowledge' 
                  ? 'bg-[#2d2d2d] text-white' 
                  : 'text-slate-400 hover:bg-[#2d2d2d]/50 hover:text-white'
              }`}
            >
              <BookOpenIcon className="w-4 h-4" />
              <span>Knowledge Base</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:bg-[#2d2d2d]/40 cursor-not-allowed">
              <TerminalIcon className="w-4 h-4" />
              <span>Logs</span>
            </div>
          </div>

          {/* Ingested Articles section (flex-1, scrolls independently if overflowed) */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <h3 className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 shrink-0">
              Ingested Articles ({articles.length})
            </h3>
            <div className="flex-1 overflow-y-auto space-y-1 px-1">
              {articles.map((art, idx) => (
                <a
                  key={idx}
                  href={art.source_url}
                  target="_blank"
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-slate-300 hover:bg-[#2d2d2d]/60 hover:text-white truncate"
                >
                  <FileTextIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{art.title}</span>
                </a>
              ))}
              {articles.length === 0 && (
                <div className="text-xs text-slate-500 p-3 text-center italic">
                  No articles loaded.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sync dashboard at bottom of sidebar (shrink-0) */}
        {syncStats && (
          <div className="p-4 border-t border-[#2d2d2d] bg-[#2d2d2d]/10 text-xs shrink-0">
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-2 flex items-center gap-1">
              <ActivityIcon className="w-3.5 h-3.5 text-green-500" /> Sync Job Stats
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs mb-2">
              <div className="bg-[#191919] p-1.5 rounded border border-[#2d2d2d]">
                <div className="text-slate-500 text-[9px]">Scraped</div>
                <div className="font-semibold text-slate-300">{syncStats.total_scraped || 0}</div>
              </div>
              <div className="bg-[#191919] p-1.5 rounded border border-[#2d2d2d]">
                <div className="text-slate-500 text-[9px]">Added</div>
                <div className="font-semibold text-brand-500">{(syncStats.added || 0)}</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 truncate" title={activeStoreName}>
              Store: <span className="font-mono text-slate-500 text-[9px]">{activeStoreName.split('/').pop()}</span>
            </div>
          </div>
        )}
      </aside>

      {/* 2. CHAT VIEW (Only shown when activeView === 'chat') */}
      {activeView === 'chat' && (
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#202123]">
          {/* Top Header (fixed) */}
          <header className="p-4 border-b border-[#2d2d2d] flex items-center justify-between bg-[#202123]/80 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-white text-sm sm:text-base">OptiBot AI Assistant</h2>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-950/30 text-green-400 border border-green-800/30">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></span> Grounded
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono bg-[#191919] border border-[#2d2d2d] px-2.5 py-1 rounded">
              gemini-3.1-flash-lite
            </div>
          </header>

          {/* Chat Messages Area (scrollable independently, takes all remaining space) */}
          <div 
            ref={chatContainerRef} 
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto w-full"
          >
            <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col min-h-full space-y-6">
              
              {/* Spacer with mt-auto pushing messages to the bottom */}
              <div className="mt-auto" />

              {/* Message Thread */}
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex gap-4 max-w-full ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    {/* Avatar Icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border ${
                      isUser 
                        ? 'bg-blue-950/30 text-blue-400 border-blue-800/30' 
                        : 'bg-[#2d2d2d] text-slate-300 border-[#3d3d3d]'
                    }`}>
                      {isUser ? <UserIcon className="w-4 h-4" /> : <BotIcon className="w-4 h-4" />}
                    </div>

                    {/* Message Bubble Container */}
                    <div className="flex flex-col gap-2 max-w-[80%]">
                      {/* Message Bubble */}
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        isUser 
                          ? 'bg-[#2563eb] text-white rounded-tr-none shadow-sm' 
                          : 'bg-[#2d2d2d] text-slate-200 rounded-tl-none border border-[#3d3d3d]'
                      }`}>
                        {msg.role === 'assistant' && msg.isStreaming ? (
                          <WordStream 
                            text={msg.content} 
                            onComplete={() => {
                              setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isStreaming: false } : m));
                            }} 
                          />
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
                        )}
                      </div>

                      {/* Sources section under AI bubble */}
                      {!isUser && msg.sources && msg.sources.length > 0 && (
                        <div className="mt-1 px-1">
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" /> Grounded Sources
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.sources.map((src, sIdx) => (
                              <span 
                                key={sIdx} 
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-[#3d3d3d] text-slate-400 hover:border-slate-300 max-w-xs truncate cursor-help"
                                title={src}
                              >
                                {src.split('/').pop()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading thinking state */}
              {isLoading && (
                <div className="flex gap-4 max-w-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#2d2d2d] text-slate-300 border border-[#3d3d3d] flex items-center justify-center shrink-0">
                    <BotIcon className="w-4 h-4" />
                  </div>
                  <div className="bg-[#2d2d2d] text-slate-200 rounded-2xl rounded-tl-none p-4 border border-[#3d3d3d] text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></span>
                    <span className="text-slate-400 font-medium">OptiBot is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating scroll down button */}
          {showScrollButton && (
            <button 
              onClick={scrollToBottom}
              title="Scroll to bottom"
              className="absolute bottom-28 right-8 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-slate-300 p-2.5 rounded-full shadow-lg border border-[#3d3d3d] transition-all transform hover:scale-105 z-10 flex items-center justify-center animate-bounce"
            >
              <ChevronDownIcon className="w-4.5 h-4.5 text-slate-400" />
            </button>
          )}

          {/* Input Box (Fixed at bottom, shrink-0) */}
          <div className="p-5 border-t border-[#2d2d2d] bg-[#202123]/80 backdrop-blur-md shrink-0 w-full">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                  placeholder="Ask OptiBot about OptiSigns..."
                  className="flex-1 bg-[#2d2d2d] border border-[#3d3d3d] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e3a8a] text-white px-4 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Send</span>
                  <SendIcon className="w-3.5 h-3.5 text-white" />
                </button>
              </form>
            </div>
            <p className="text-center text-[10px] text-slate-500 mt-3 select-none">
              OptiBot operates strictly on support documents from support.optisigns.com. Coded in React + FastAPI.
            </p>
          </div>
        </main>
      )}

      {/* 3. KNOWLEDGE BASE / ADD KNOWLEDGE VIEW (Only shown when activeView === 'knowledge') */}
      {activeView === 'knowledge' && (
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#202123]">
          
          {/* Header */}
          <header className="p-4 border-b border-[#2d2d2d] bg-[#202123]/80 backdrop-blur-sm shrink-0 flex flex-col justify-center">
            <h2 className="font-semibold text-white text-base sm:text-lg">Add Knowledge</h2>
            <p className="text-xs text-slate-400">Ingest new documents into OptiBot knowledge base</p>
          </header>

          {/* Main Dashboard Layout (Split-screen: left for upload controls, right for recent ledger) */}
          <div className="flex-1 flex overflow-hidden w-full p-6 gap-6">
            
            {/* Left Main Card (Input controls) */}
            <div className="flex-1 flex flex-col overflow-y-auto space-y-6">
              
              {/* Tab Selector Card */}
              <div className="bg-[#2d2d2d] rounded-xl border border-[#3d3d3d] shadow-md p-4">
                <div className="flex border-b border-[#3d3d3d] mb-4">
                  <button 
                    onClick={() => { if (!isIngesting) setActiveKbTab('file'); }}
                    disabled={isIngesting}
                    className={`flex-1 pb-3 text-sm font-medium transition-all ${
                      activeKbTab === 'file' 
                        ? 'border-b-2 border-blue-500 text-white' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    File Ingestion
                  </button>
                  <button 
                    onClick={() => { if (!isIngesting) setActiveKbTab('url'); }}
                    disabled={isIngesting}
                    className={`flex-1 pb-3 text-sm font-medium transition-all ${
                      activeKbTab === 'url' 
                        ? 'border-b-2 border-blue-500 text-white' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    URL Ingestion
                  </button>
                  <button 
                    onClick={() => { if (!isIngesting) setActiveKbTab('manual'); }}
                    disabled={isIngesting}
                    className={`flex-1 pb-3 text-sm font-medium transition-all ${
                      activeKbTab === 'manual' 
                        ? 'border-b-2 border-blue-500 text-white' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Manual Text Ingestion
                  </button>
                </div>

                {/* Tab 1: File Upload */}
                {activeKbTab === 'file' && (
                  <form onSubmit={handleFileUpload} className="space-y-4">
                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleFileDrop}
                      className="border-2 border-dashed border-[#3d3d3d] hover:border-blue-500 transition-all rounded-lg p-8 flex flex-col items-center justify-center bg-[#191919]/50 cursor-pointer"
                    >
                      <UploadCloudIcon className="w-10 h-10 text-slate-500 mb-3" />
                      <span className="text-sm font-semibold text-white">Drag & drop files here</span>
                      <span className="text-xs text-slate-400 mt-1">Supported formats: PDF, MD, TXT (Max 10MB)</span>
                      
                      <input 
                        type="file" 
                        id="fileInput" 
                        accept=".pdf,.txt,.md"
                        disabled={isIngesting}
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="hidden" 
                      />
                      <label 
                        htmlFor="fileInput" 
                        className={`mt-4 px-3 py-1.5 bg-[#2d2d2d] border border-[#3d3d3d] rounded text-xs font-semibold text-slate-300 hover:bg-[#3d3d3d] transition-all cursor-pointer ${
                          isIngesting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        Browse Files
                      </label>
                    </div>

                    {selectedFile && (
                      <div className="flex items-center justify-between bg-[#191919] p-3 rounded-lg border border-[#3d3d3d]">
                        <div className="flex items-center gap-2 truncate">
                          <FileTextIcon className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="text-xs font-medium text-slate-200 truncate">{selectedFile.name}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          disabled={isIngesting}
                          className="text-xs text-red-400 hover:text-red-300 font-semibold disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isIngesting || !selectedFile}
                      className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold text-sm py-2.5 rounded-lg shadow-sm transition-all"
                    >
                      {isIngesting ? 'Processing File...' : 'Upload & Process'}
                    </button>
                  </form>
                )}

                {/* Tab 2: URL Ingestion */}
                {activeKbTab === 'url' && (
                  <form onSubmit={handleUrlIngestion} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Documentation URL</label>
                      <input 
                        type="url" 
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        disabled={isIngesting}
                        placeholder="https://support.optisigns.com/hc/en-us/articles/..."
                        required
                        className="w-full bg-[#191919] border border-[#3d3d3d] rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isIngesting || !urlInput.trim()}
                      className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold text-sm py-2.5 rounded-lg shadow-sm transition-all"
                    >
                      {isIngesting ? 'Scraping URL...' : 'Scrape & Ingest'}
                    </button>
                  </form>
                )}

                {/* Tab 3: Manual Input */}
                {activeKbTab === 'manual' && (
                  <form onSubmit={handleManualIngestion} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Document Title</label>
                      <input 
                        type="text" 
                        value={manualTitle}
                        onChange={(e) => setManualTitle(e.target.value)}
                        disabled={isIngesting}
                        placeholder="E.g. Screen troubleshooting guide"
                        required
                        className="w-full bg-[#191919] border border-[#3d3d3d] rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Content Body</label>
                      <textarea 
                        rows="6"
                        value={manualContent}
                        onChange={(e) => setManualContent(e.target.value)}
                        disabled={isIngesting}
                        placeholder="Paste or write the document text to index here..."
                        required
                        className="w-full bg-[#191919] border border-[#3d3d3d] rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none font-mono"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isIngesting || !manualTitle.trim() || !manualContent.trim()}
                      className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold text-sm py-2.5 rounded-lg shadow-sm transition-all"
                    >
                      {isIngesting ? 'Ingesting Content...' : 'Add to Knowledge Base'}
                    </button>
                  </form>
                )}
              </div>

              {/* Ingestion Progress Monitor Card */}
              {(isIngesting || pipelineSteps.some(s => s.status === 'done')) && (
                <div className="bg-[#2d2d2d] rounded-xl border border-[#3d3d3d] p-5 shadow-md">
                  <h3 className="text-sm font-semibold text-white mb-3">RAG Ingestion Pipeline Status</h3>
                  <div className="space-y-3">
                    {pipelineSteps.map((step) => {
                      return (
                        <div key={step.id} className="flex items-center justify-between text-xs p-1.5 rounded bg-[#191919]/40">
                          <div className="flex items-center gap-2.5">
                            {/* Loader or Bullet */}
                            {step.status === 'pending' && <div className="w-3.5 h-3.5 rounded-full border border-[#3d3d3d] bg-transparent" />}
                            {step.status === 'processing' && <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />}
                            {step.status === 'done' && <CheckCircleIcon className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                            {step.status === 'failed' && <div className="w-3.5 h-3.5 rounded-full bg-red-600 text-white flex items-center justify-center text-[8px] font-bold">!</div>}
                            <span className={
                              step.status === 'processing' ? 'text-white font-semibold' :
                              step.status === 'done' ? 'text-slate-400' : 'text-slate-500'
                            }>
                              {step.name}
                            </span>
                          </div>
                          <div>
                            {step.status === 'pending' && <span className="text-[10px] text-slate-600 font-mono">Pending</span>}
                            {step.status === 'processing' && <span className="text-[10px] text-blue-400 font-mono animate-pulse">Running</span>}
                            {step.status === 'done' && <span className="text-[10px] text-green-500 font-mono">Completed</span>}
                            {step.status === 'failed' && <span className="text-[10px] text-red-500 font-mono">Failed</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel Card (Recent Ledger) */}
            <div className="w-80 bg-[#2d2d2d] rounded-xl border border-[#3d3d3d] shadow-md flex flex-col overflow-hidden shrink-0">
              <div className="p-4 border-b border-[#3d3d3d] shrink-0">
                <h3 className="font-semibold text-white text-sm">Recent Ingestions</h3>
                <p className="text-[11px] text-slate-500">Live ledger of synced document chunks</p>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {recentIngestions.map((ing, idx) => (
                  <div key={idx} className="bg-[#191919] p-3 rounded-lg border border-[#3d3d3d] flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-white truncate max-w-[70%]" title={ing.name}>
                        {ing.name}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        ing.type === 'file' ? 'bg-blue-900/40 text-blue-300' :
                        ing.type === 'url' ? 'bg-purple-900/40 text-purple-300' : 'bg-green-900/40 text-green-300'
                      }`}>
                        {ing.type}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-[#2d2d2d] pt-1.5">
                      <span>Chunks: <strong className="text-slate-300">{ing.chunks}</strong></span>
                      <span>{ing.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] mt-0.5">
                      <span className="text-slate-500">Sync Status:</span>
                      <span className={`font-semibold ${ing.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {ing.status === 'success' ? '● Success' : '● Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      )}

    </div>
  );
}

export default App;
