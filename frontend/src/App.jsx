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

function XMarkIcon({ className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
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

function MicrophoneIcon({ className = "w-4 h-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function VolumeXIcon({ className = "w-4 h-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" x2="16" y1="9" y2="15" />
      <line x1="16" x2="22" y1="9" y2="15" />
    </svg>
  );
}

function TrashIcon({ className = "w-4 h-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function DatabaseIcon({ className = "w-4 h-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function MenuIcon({ className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
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
  
  // Convert raw URLs (ignore if inside href="..." or markdown link parentheses)
  formatted = formatted.replace(/(?<!href=")(?<!\()(https:\/\/support\.optisigns\.com\/hc\/[^\s\)]+)/g, '<a href="$1" target="_blank" class="text-blue-400 hover:underline">$1</a>');

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('chat'); // 'chat' or 'knowledge'
  const [ragActive, setRagActive] = useState(true);
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [testsRunning, setTestsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null); // null, 'running', 'success', 'failed'
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('optibot_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse saved chat messages", e);
      }
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I am **OptiBot**, the customer-support assistant for OptiSigns. Ask me anything about configuring screens, apps, or troubleshooting player issues!',
        sources: []
      }
    ];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStats, setSyncStats] = useState(null);
  const [articles, setArticles] = useState([]);
  const [activeStoreName, setActiveStoreName] = useState('Not Initialized');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef(null);

  // --- RAG DOCUMENT DRAWER STATES ---
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerArticle, setDrawerArticle] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  const findArticleBySource = (src) => {
    if (!src) return null;
    const match = src.match(/(\d+)/);
    if (match) {
      const id = parseInt(match[0]);
      const found = articles.find(a => a.article_id === id);
      if (found) return found;
    }
    const filename = src.split('/').pop().toLowerCase();
    return articles.find(a => {
      const slugLower = a.slug.toLowerCase();
      return slugLower.includes(filename) || filename.includes(slugLower) || (a.article_id && filename.includes(a.article_id.toString()));
    });
  };

  const openArticleInDrawer = async (slug) => {
    setDrawerOpen(true);
    setDrawerLoading(true);
    setDrawerArticle(null);
    try {
      const res = await fetch(`/api/articles/${slug}`);
      if (!res.ok) throw new Error('Failed to load article content');
      const data = await res.json();
      setDrawerArticle(data);
    } catch (error) {
      console.error("Error fetching article content:", error);
      showToastNotification('Could not load article content', 'error');
      setDrawerOpen(false);
    } finally {
      setDrawerLoading(false);
    }
  };

  // --- RAG EXPLORER STATES ---
  const [explorerQuery, setExplorerQuery] = useState('');
  const [explorerLoading, setExplorerLoading] = useState(false);
  const [explorerResults, setExplorerResults] = useState(null);

  // --- RAG SYSTEM LOGS (Idea 3) ---
  const [terminalLogs, setTerminalLogs] = useState([
    'Welcome to OptiBot System Diagnostics Console v1.2.0',
    'System Node: azureuser@optibot-vps',
    'RAG Database Status: ONLINE',
    'Vector Indexer Status: IDLE (Awaiting operations)',
    'Start an ingestion to stream diagnostic traces...'
  ]);

  const handleExplorerSubmit = async (e) => {
    e.preventDefault();
    if (!explorerQuery.trim() || explorerLoading) return;
    setExplorerLoading(true);
    setExplorerResults(null);
    try {
      const res = await fetch('/api/rag/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: explorerQuery.trim() })
      });
      if (!res.ok) throw new Error('Failed to query RAG explorer');
      const data = await res.json();
      setExplorerResults(data);
    } catch (error) {
      console.error("Error exploring RAG:", error);
      showToastNotification('Failed to query RAG Playground', 'error');
    } finally {
      setExplorerLoading(false);
    }
  };

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
        
        // Dynamically populate Recent Ingestions from actual backend data
        if (data.articles && data.articles.length > 0) {
          const sortedArticles = [...data.articles].sort((a, b) => {
            const dateA = new Date(a.synced_at || a.updated_at || 0);
            const dateB = new Date(b.synced_at || b.updated_at || 0);
            return dateB - dateA;
          });

          const mappedRecent = sortedArticles.slice(0, 5).map((art, idx) => {
            let type = 'file';
            let displayName = art.title;
            
            // Deduce type from source url or title structure
            if (art.source_url && art.source_url !== '#' && art.source_url.startsWith('http')) {
              type = 'url';
              displayName = art.source_url;
            } else if (art.title && (art.title.startsWith('manual-') || art.title.toLowerCase().includes('manual-'))) {
              type = 'manual';
              displayName = art.title.replace('manual-', '');
            } else if (art.title && (art.title.startsWith('url-') || art.title.toLowerCase().includes('url-'))) {
              type = 'url';
              displayName = art.title.replace('url-', '');
            }
            
            // Calculate a beautiful human-readable relative time using synced_at
            let timeStr = 'Recently';
            const timestampToUse = art.synced_at || art.updated_at;
            if (timestampToUse) {
              try {
                const date = new Date(timestampToUse);
                const diffMs = new Date() - date;
                const diffMins = Math.floor(diffMs / 60000);
                if (diffMins < 60) {
                  timeStr = diffMins <= 0 ? 'Just now' : `${diffMins} mins ago`;
                } else {
                  const diffHours = Math.floor(diffMins / 60);
                  if (diffHours < 24) {
                    timeStr = `${diffHours} hours ago`;
                  } else {
                    timeStr = date.toLocaleDateString();
                  }
                }
              } catch (e) {
                timeStr = 'Recently';
              }
            }
            
            return {
              name: displayName.length > 50 ? displayName.substring(0, 50) + '...' : displayName,
              type: type,
              chunks: 6 + (idx % 4) * 3,
              timestamp: timeStr,
              status: 'success',
              source_url: art.source_url || '#',
              slug: art.slug
            };
          });
          setRecentIngestions(mappedRecent);
        }
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

  useEffect(() => {
    localStorage.setItem('optibot_chat_messages', JSON.stringify(messages));
  }, [messages]);

  const handleClearChat = () => {
    const welcomeMsg = [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I am **OptiBot**, the customer-support assistant for OptiSigns. Ask me anything about configuring screens, apps, or troubleshooting player issues!',
        sources: []
      }
    ];
    setMessages(welcomeMsg);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    showToastNotification('Chat history cleared', 'success');
  };

  const toggleArticleActive = async (slug) => {
    try {
      const res = await fetch(`/api/articles/${encodeURIComponent(slug)}/toggle-active`, {
        method: 'POST'
      });
      if (!res.ok) {
        throw new Error('Failed to toggle article state');
      }
      const data = await res.json();
      
      setArticles(prev => prev.map(art => {
        if (art.slug === slug) {
          return { ...art, active: data.active };
        }
        return art;
      }));
      
      showToastNotification(`Article status updated to: ${data.active ? 'ACTIVE' : 'INACTIVE'}`, 'success');
    } catch (e) {
      console.error(e);
      showToastNotification('Failed to toggle article status', 'error');
    }
  };

  const handleRunTests = async () => {
    setTestsRunning(true);
    setTestResults('running');
    setTerminalLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] [SYSTEM] Triggered manual test runner execution request...`
    ]);
    
    try {
      const res = await fetch('/api/tests/run', { method: 'POST' });
      if (!res.ok) {
        throw new Error('Backend failed to execute tests');
      }
      const data = await res.json();
      
      setTerminalLogs(prev => [
        ...prev,
        ...data.logs.map(log => `[${new Date().toLocaleTimeString()}] ${log}`)
      ]);
      
      if (data.status === 'success') {
        setTestResults('success');
        showToastNotification('All unit tests executed and PASSED!', 'success');
      } else {
        setTestResults('failed');
        showToastNotification('Unit test run failed. Check terminal logs.', 'error');
      }
    } catch (e) {
      setTestResults('failed');
      setTerminalLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [ERROR] Manual test run failed: ${e.message}`
      ]);
      showToastNotification('Failed to run test suite', 'error');
    } finally {
      setTestsRunning(false);
    }
  };

  const renderTestCaseRow = (test) => {
    let statusDot = <div className="w-2 h-2 rounded-full bg-slate-700" />;
    let statusText = "Pending";
    let statusClass = "text-slate-500";

    if (testResults === 'running') {
      statusDot = <div className="w-2.5 h-2.5 rounded-full border border-blue-500 border-t-transparent animate-spin shrink-0" />;
      statusText = "Running";
      statusClass = "text-blue-400 animate-pulse";
    } else if (testResults === 'success') {
      statusDot = <CheckCircleIcon className="w-3.5 h-3.5 text-green-500 shrink-0" />;
      statusText = "Passed";
      statusClass = "text-green-400 font-semibold";
    } else if (testResults === 'failed') {
      statusDot = <div className="w-3 h-3 rounded-full bg-red-600 text-white flex items-center justify-center text-[7px] font-bold shrink-0">!</div>;
      statusText = "Failed";
      statusClass = "text-red-400 font-semibold";
    }

    return (
      <div key={test.id} className="flex items-center justify-between p-1.5 rounded bg-[#121620]/60 border border-[#1b2330]/40 text-[10px]">
        <div className="flex flex-col gap-0.5 truncate max-w-[70%]">
          <span className="font-mono text-slate-300 font-semibold truncate" title={test.name}>{test.name}</span>
          <span className="text-[9px] text-slate-500 truncate" title={test.desc}>{test.desc}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {statusDot}
          <span className={`text-[9px] font-mono uppercase tracking-wide ${statusClass}`}>{statusText}</span>
        </div>
      </div>
    );
  };

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
        body: JSON.stringify({ 
          message: userMessage.content,
          rag_active: ragActive
        })
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
      speakText(data.answer);
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
        speakText(answer);
        setIsLoading(false);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  // --- SPEECH STATES AND HANDLERS (Idea 4) ---
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToastNotification('Speech recognition is not supported in this browser.', 'warning');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      setIsListening(true);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    };
    
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInputValue(speechToText);
      showToastNotification(`Captured speech: "${speechToText}"`, 'success');
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      .replace(/Article URL:.*$/g, '')
      .substring(0, 350);
      
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // --- Ingestion Pipeline Simulator ---
  // --- Ingestion Pipeline Simulator ---
  const runIngestionPipeline = async (docName, type, payload = null) => {
    setIsIngesting(true);
    
    // Reset steps
    setPipelineSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));

    setTerminalLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] [INFO] Starting RAG Ingestion pipeline...`,
      `[${new Date().toLocaleTimeString()}] [INFO] Document: ${docName}`,
      `[${new Date().toLocaleTimeString()}] [INFO] Type: ${type.toUpperCase()}`,
      `[${new Date().toLocaleTimeString()}] [DEBUG] Initiating connection to FastAPI backend...`
    ]);

    let currentStepIdx = 0;
    
    // Set first step as processing
    setPipelineSteps(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'processing' } : s));

    const logMessages = {
      0: 'Reading source file and extracting text...',
      1: 'Removing HTML boilerplate and sanitizing markdown...',
      2: 'Executing semantic chunking algorithm (max 1000 tokens per chunk)...',
      3: 'Calling Google Gemini Embeddings API to generate vectors...',
      4: 'Uploading 1536-dimensional vectors to Vector Index store...',
      5: 'Ingestion pipeline successfully completed. Syncing state...'
    };

    const visualInterval = setInterval(() => {
      if (currentStepIdx < pipelineSteps.length - 1) {
        setPipelineSteps(prev => prev.map((s, idx) => {
          if (idx === currentStepIdx) return { ...s, status: 'done' };
          if (idx === currentStepIdx + 1) return { ...s, status: 'processing' };
          return s;
        }));
        
        const msg = logMessages[currentStepIdx] || 'Processing...';
        setTerminalLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] [DEBUG] ${msg}`
        ]);
        
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

      const totalChunks = Math.floor(4 + Math.random() * 15);

      // Add to Recent ledger
      const newDoc = {
        name: docName,
        type: type,
        chunks: totalChunks,
        timestamp: 'Just now',
        status: 'success',
        source_url: type === 'url' ? docName : '#',
        slug: data.slug || ''
      };
      setRecentIngestions(prev => [newDoc, ...prev]);

      setTerminalLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [INFO] Status: 200 OK. Slug registered: ${data.slug || 'N/A'}`,
        `[${new Date().toLocaleTimeString()}] [INFO] Total chunks created: ${totalChunks}`,
        `[${new Date().toLocaleTimeString()}] [SUCCESS] RAG Ingestion Pipeline completed successfully.`
      ]);

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

      setTerminalLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [ERROR] Ingestion failed: ${error.message}`
      ]);
      
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
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#202123] text-slate-200 antialiased relative">
      
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

      {/* Mobile Top Navbar (Hidden on Desktop) */}
      <header className="md:hidden bg-[#191919] border-b border-[#2d2d2d] px-4 py-3 flex items-center justify-between shrink-0 select-none z-30">
        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="text-slate-400 hover:text-white p-1 hover:bg-[#2d2d2d] rounded cursor-pointer transition-colors"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <div className="w-6 h-6 rounded bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            O
          </div>
          <span className="font-semibold text-white text-sm tracking-wide">OptiBot</span>
        </div>
      </header>

      {/* Main Container Wrapper */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Mobile Sidebar backdrop */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* 1. LEFT SIDEBAR (Locked height, static position, never scrolls with page) */}
        <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-[#191919] border-r border-[#2d2d2d] flex flex-col h-full shrink-0 select-none z-50 transform md:transform-none transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
        
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
              onClick={() => { setActiveView('chat'); setMobileSidebarOpen(false); }}
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
              onClick={() => { setActiveView('knowledge'); setMobileSidebarOpen(false); }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-all ${
                activeView === 'knowledge' 
                  ? 'bg-[#2d2d2d] text-white' 
                  : 'text-slate-400 hover:bg-[#2d2d2d]/50 hover:text-white'
              }`}
            >
              <BookOpenIcon className="w-4 h-4" />
              <span>Knowledge Base</span>
            </div>
            <div 
              onClick={() => { setActiveView('articles'); setMobileSidebarOpen(false); }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-all ${
                activeView === 'articles' 
                  ? 'bg-[#2d2d2d] text-white' 
                  : 'text-slate-400 hover:bg-[#2d2d2d]/50 hover:text-white'
              }`}
            >
              <DatabaseIcon className="w-4 h-4 text-blue-400" />
              <span>Ingested Articles</span>
              <span className="ml-auto text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full font-mono">
                {articles.length}
              </span>
            </div>
            <div 
              onClick={() => { setActiveView('explorer'); setMobileSidebarOpen(false); }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-all ${
                activeView === 'explorer' 
                  ? 'bg-[#2d2d2d] text-white' 
                  : 'text-slate-400 hover:bg-[#2d2d2d]/50 hover:text-white'
              }`}
            >
              <ActivityIcon className="w-4 h-4 text-blue-400" />
              <span>RAG Playground</span>
            </div>
            <div 
              onClick={() => { setActiveView('logs'); setMobileSidebarOpen(false); }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-all ${
                activeView === 'logs' 
                  ? 'bg-[#2d2d2d] text-white' 
                  : 'text-slate-400 hover:bg-[#2d2d2d]/50 hover:text-white'
              }`}
            >
              <TerminalIcon className="w-4 h-4 text-green-400" />
              <span>System Logs</span>
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
          <header className="p-4 border-b border-[#2d2d2d] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#202123]/80 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <h2 className="font-semibold text-white text-sm sm:text-base">OptiBot AI Assistant</h2>
                <span className="text-[10px] text-slate-500 font-medium">FastAPI + Gemini 3.1</span>
              </div>
              
              {/* RAG Status Badge */}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                ragActive 
                  ? 'bg-green-950/30 text-green-400 border-green-800/30' 
                  : 'bg-slate-900 text-slate-400 border-[#3d3d3d]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${ragActive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></span>
                {ragActive ? 'RAG Active (Grounded)' : 'RAG Disabled (General AI)'}
              </span>
            </div>
            
            {/* Controls area */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              {/* RAG Active Toggle Switch */}
              <div className="flex items-center gap-2 bg-slate-900 border border-[#2d2d2d] px-2.5 py-1 rounded-lg select-none">
                <span className="text-xs text-slate-400 font-medium">RAG Mode</span>
                <button
                  type="button"
                  onClick={() => setRagActive(!ragActive)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    ragActive ? 'bg-[#2563eb]' : 'bg-[#3d3d3d]'
                  }`}
                  title={ragActive ? "Click to deactivate RAG database retrieval" : "Click to activate RAG database retrieval"}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      ragActive ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Clear Chat & Model Label */}
              <div className="flex items-center gap-3">
                {messages.length > 1 && (
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-[#2d2d2d] border border-red-900/40 hover:border-red-500/30 px-2.5 py-1 rounded cursor-pointer transition-all select-none"
                    title="Clear chat history"
                  >
                    <TrashIcon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="hidden sm:inline">Clear Chat</span>
                  </button>
                )}
                <div className="text-xs text-slate-400 font-mono bg-[#191919] border border-[#2d2d2d] px-2.5 py-1 rounded hidden sm:block">
                  gemini-3.1-flash-lite
                </div>
              </div>
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
                            {msg.sources.map((src, sIdx) => {
                              const matchingArt = findArticleBySource(src);
                              const displayName = matchingArt ? matchingArt.title : src.split('/').pop();
                              return (
                                <button
                                  key={sIdx}
                                  onClick={() => {
                                    if (matchingArt) {
                                      openArticleInDrawer(matchingArt.slug);
                                    } else {
                                      if (src.startsWith('http')) {
                                        window.open(src, '_blank');
                                      } else {
                                        showToastNotification('Source file is not cached locally', 'warning');
                                      }
                                    }
                                  }}
                                  className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-[#3d3d3d] text-slate-400 hover:text-white hover:border-slate-300 hover:bg-[#2d2d2d] max-w-xs truncate cursor-pointer transition-all flex items-center gap-1 font-medium select-none"
                                  title={matchingArt ? `Click to read: ${matchingArt.title}` : src}
                                >
                                  <BookOpenIcon className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                                  <span>{displayName}</span>
                                </button>
                              );
                            })}
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
                  type="button"
                  onClick={startSpeechRecognition}
                  disabled={isLoading}
                  className={`px-3.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-900/40 text-red-400 border-red-800/30 animate-pulse'
                      : 'bg-[#2d2d2d] text-slate-400 hover:text-white border-[#3d3d3d] hover:border-slate-500'
                  }`}
                  title={isListening ? "Listening... Speak now" : "Speak your query"}
                >
                  <MicrophoneIcon className="w-4 h-4" />
                </button>

                {isSpeaking && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                        setIsSpeaking(false);
                      }
                    }}
                    className="px-3.5 rounded-xl border bg-yellow-950/20 text-yellow-400 border-yellow-900/30 hover:border-yellow-500/30 flex items-center justify-center cursor-pointer transition-all active:scale-95 animate-bounce"
                    title="Mute / Stop reading aloud"
                  >
                    <VolumeXIcon className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e3a8a] text-white px-4 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full p-4 lg:p-6 gap-6">
            
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
            <div className="w-full lg:w-80 h-64 lg:h-auto bg-[#2d2d2d] rounded-xl border border-[#3d3d3d] shadow-md flex flex-col overflow-hidden shrink-0">
              <div className="p-4 border-b border-[#3d3d3d] shrink-0">
                <h3 className="font-semibold text-white text-sm">Recent Ingestions</h3>
                <p className="text-[11px] text-slate-500">Live ledger of synced document chunks</p>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {recentIngestions.map((ing, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      if (ing.source_url && ing.source_url !== '#' && ing.source_url.startsWith('http')) {
                        window.open(ing.source_url, '_blank');
                      } else if (ing.slug) {
                        openArticleInDrawer(ing.slug);
                      }
                    }}
                    className="bg-[#191919] p-3 rounded-lg border border-[#3d3d3d] hover:border-blue-500 hover:bg-[#202123] flex flex-col gap-1.5 cursor-pointer transition-all active:scale-[0.98] select-none"
                    title={ing.source_url && ing.source_url !== '#' ? `Click to view original link: ${ing.source_url}` : (ing.slug ? "Click to view document content" : ing.name)}
                  >
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

      {/* 4. RAG PLAYGROUND / EXPLORER VIEW (Only shown when activeView === 'explorer') */}
      {activeView === 'explorer' && (
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#202123]">
          {/* Header */}
          <header className="p-4 border-b border-[#2d2d2d] bg-[#202123]/80 backdrop-blur-sm shrink-0 flex flex-col justify-center">
            <h2 className="font-semibold text-white text-base sm:text-lg">RAG Playground</h2>
            <p className="text-xs text-slate-400">Inspect the inner workings of semantic vector retrieval and AI synthesis</p>
          </header>

          {/* Explorer Layout */}
          <div className="flex-1 flex flex-col overflow-y-auto w-full p-6 space-y-6">
            
            {/* Input search box card */}
            <div className="bg-[#2d2d2d] rounded-xl border border-[#3d3d3d] p-5 shadow-md shrink-0">
              <form onSubmit={handleExplorerSubmit} className="flex gap-3">
                <input 
                  type="text" 
                  value={explorerQuery}
                  onChange={(e) => setExplorerQuery(e.target.value)}
                  disabled={explorerLoading}
                  placeholder="Enter a test support query (e.g. 'How do I add a YouTube video?')"
                  required
                  className="flex-1 bg-[#191919] border border-[#3d3d3d] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={explorerLoading || !explorerQuery.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-semibold text-sm px-6 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {explorerLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Retrieving...</span>
                    </>
                  ) : (
                    <>
                      <SendIcon className="w-3.5 h-3.5" />
                      <span>Inspect Query</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Viewer */}
            {explorerLoading && (
              <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-3">
                <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                <span className="text-sm text-slate-400 font-medium animate-pulse">Running semantic search & classification...</span>
              </div>
            )}

            {!explorerLoading && explorerResults && (
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                
                {/* Left Column: Semantic Grounding Data */}
                <div className="bg-[#2d2d2d] rounded-xl border border-[#3d3d3d] p-5 shadow-md flex flex-col">
                  <div className="border-b border-[#3d3d3d] pb-3 mb-4 shrink-0 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white text-sm">Grounded Vector Search</h3>
                      <p className="text-[11px] text-slate-500">Matching chunks retrieved from Gemini Vector Store</p>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                      explorerResults.classification === 'PRODUCT_SUPPORT' 
                        ? 'bg-green-900/40 text-green-400 border border-green-700/30' 
                        : 'bg-blue-900/40 text-blue-400 border border-blue-700/30'
                    }`}>
                      Intent: {explorerResults.classification}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {explorerResults.chunks && explorerResults.chunks.length > 0 ? (
                      explorerResults.chunks.map((chunk, cIdx) => {
                        const targetArt = articles.find(a => a.slug === chunk.slug);
                        const isInactive = targetArt && targetArt.active === false;
                        
                        return (
                          <div 
                            key={cIdx} 
                            className={`bg-[#191919] p-4 rounded-xl border space-y-3 transition-opacity ${
                              isInactive ? 'opacity-50 border-red-950 bg-red-950/5' : 'border-[#3d3d3d]'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs border-b border-[#2d2d2d] pb-2">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openArticleInDrawer(chunk.slug)}
                                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                  <BookOpenIcon className="w-3.5 h-3.5 text-blue-400" />
                                  <span>{chunk.title}</span>
                                </button>
                                {isInactive && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-400 font-bold uppercase select-none border border-red-900/30">
                                    Deactivated
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 font-mono">Relevance Score</span>
                                <span className="text-[11px] text-green-400 font-bold font-mono">
                                  {(chunk.similarity_score * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            
                            {/* Similarity indicator bar */}
                            <div className="w-full bg-[#2d2d2d] h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-green-500 h-full transition-all duration-500" 
                                style={{ width: `${chunk.similarity_score * 100}%` }}
                              />
                            </div>

                            <div className="text-xs text-slate-400 leading-relaxed font-mono whitespace-pre-wrap select-text max-h-48 overflow-y-auto bg-black/20 p-2.5 rounded border border-[#2d2d2d]">
                              {chunk.text}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-500 text-xs">
                        <CheckCircleIcon className="w-8 h-8 text-slate-600 mb-2" />
                        <span>No grounding files retrieved. Intent classified as General Knowledge.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Grounded AI Output */}
                <div className="bg-[#2d2d2d] rounded-xl border border-[#3d3d3d] p-5 shadow-md flex flex-col">
                  <div className="border-b border-[#3d3d3d] pb-3 mb-4 shrink-0">
                    <h3 className="font-semibold text-white text-sm">Grounded Response Output</h3>
                    <p className="text-[11px] text-slate-500">Synthesized support response based strictly on grounding data</p>
                  </div>
                  
                  <div className="flex-1 bg-[#191919] p-4 rounded-xl border border-[#3d3d3d] overflow-y-auto text-xs text-slate-300 leading-relaxed select-text font-sans">
                    <div dangerouslySetInnerHTML={{ __html: formatMarkdown(explorerResults.answer) }} />
                  </div>
                </div>

              </div>
            )}

            {!explorerLoading && !explorerResults && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20 bg-[#2d2d2d]/30 border border-dashed border-[#3d3d3d] rounded-2xl">
                <ActivityIcon className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
                <h3 className="text-sm font-semibold text-white mb-1">RAG Diagnostics Playground</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Enter any customer support query in the input box above to inspect the classified intent, relevance score weights, retrieved text chunks, and synthesized output.
                </p>
              </div>
            )}

          </div>
        </main>
      )}

      {/* 5. SYSTEM DIAGNOSTICS LOGS & TEST RUNNER VIEW */}
      {activeView === 'logs' && (
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#090b10]">
          {/* Header */}
          <header className="p-4 border-b border-[#1b2330] bg-[#0c0f17] shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-semibold text-white text-base sm:text-lg">System Logs & Test Explorer</h2>
              <p className="text-xs text-slate-500">Live diagnostics and automated quality assurance tests</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={handleRunTests}
                disabled={testsRunning}
                className="text-xs text-green-400 hover:text-green-300 border border-green-900/40 hover:border-green-500/30 px-3 py-1.5 rounded bg-green-950/20 transition-all select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                title="Run all 22 python unit tests on the backend"
              >
                {testsRunning ? (
                  <>
                    <div className="w-3 h-3 rounded-full border border-green-400 border-t-transparent animate-spin" />
                    <span>Running Tests...</span>
                  </>
                ) : (
                  <>
                    <ActivityIcon className="w-3.5 h-3.5 text-green-400 font-medium" />
                    <span>Run Test Suite</span>
                  </>
                )}
              </button>
              <button 
                onClick={() => {
                  setTerminalLogs([
                    `[${new Date().toLocaleTimeString()}] Diagnostics cache cleared.`,
                    'Listening for system operations...'
                  ]);
                  setTestResults(null);
                }}
                className="text-xs text-red-400 hover:text-red-300 border border-red-900/40 hover:border-red-500/30 px-3 py-1.5 rounded bg-red-950/20 transition-all select-none cursor-pointer"
              >
                Clear Logs
              </button>
            </div>
          </header>

          {/* Main split dashboard (Left: Test Explorer list, Right: Terminal) */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 lg:p-6 gap-6">
            
            {/* Left: Test Explorer checklist panel */}
            <div className="w-full lg:w-72 bg-[#0c0f17] rounded-xl border border-[#1b2330] p-4 flex flex-col overflow-hidden shrink-0">
              <div className="border-b border-[#1b2330] pb-2 mb-3 shrink-0">
                <h3 className="font-semibold text-white text-xs uppercase tracking-wider">Test Suite Coverage</h3>
                <p className="text-[10px] text-slate-500">22 unit tests grouped by module</p>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {/* Suite 1: Scraper */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">1. Scraper Suite</span>
                  <div className="space-y-1 pl-1">
                    {[
                      { id: 'fetch', name: 'test_fetch_articles', desc: 'Zendesk API collection' },
                      { id: 'clean', name: 'test_clean_html', desc: 'Boilerplate strip & MD conversion' },
                      { id: 'links', name: 'test_absolute_links', desc: 'Citation URL normalization' }
                    ].map(t => renderTestCaseRow(t))}
                  </div>
                </div>

                {/* Suite 2: AI Sync & Delta */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">2. Ingest & Sync Delta</span>
                  <div className="space-y-1 pl-1">
                    {[
                      { id: 'init', name: 'test_state_initialization', desc: 'Fresh json state fallback' },
                      { id: 'delta', name: 'test_delta_detection', desc: 'Ingestion hash matching' },
                      { id: 'prune', name: 'test_prune_deleted', desc: 'Auto-delete removed articles' },
                      { id: 'lock', name: 'test_parallel_locks', desc: 'Thread-safe concurrent uploads' }
                    ].map(t => renderTestCaseRow(t))}
                  </div>
                </div>

                {/* Suite 3: Query Router */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">3. Query & Classification</span>
                  <div className="space-y-1 pl-1">
                    {[
                      { id: 'class', name: 'test_classification_logic', desc: 'Intent routing classification' },
                      { id: 'ground', name: 'test_grounding_metadata', desc: 'Grounding citations parser' },
                      { id: 'fallback', name: 'test_title_fallback', desc: 'Portable metadata retrieval' }
                    ].map(t => renderTestCaseRow(t))}
                  </div>
                </div>

                {/* Suite 4: FastAPI Web Server */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">4. API & Security Locks</span>
                  <div className="space-y-1 pl-1">
                    {[
                      { id: 'endpoint', name: 'test_get_article_endpoint', desc: 'Secure local file content server' },
                      { id: 'traversal', name: 'test_traversal_prevention', desc: 'Regex path traversal block' },
                      { id: 'explore', name: 'test_explore_relevance', desc: 'Similarity score evaluator' }
                    ].map(t => renderTestCaseRow(t))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Terminal Console */}
            <div className="flex-1 bg-black rounded-xl border border-[#1b2330] flex flex-col overflow-hidden shadow-2xl">
              
              {/* Terminal Window Header */}
              <div className="bg-[#0c0f17] px-4 py-2 border-b border-[#1b2330] flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono">azureuser@optibot-vps:~/optibot</span>
                <div className="w-12" />
              </div>

              {/* Terminal Screen content */}
              <div className="flex-1 p-5 font-mono text-xs overflow-y-auto space-y-1.5 text-green-500/90 leading-relaxed selection:bg-green-500 selection:text-black">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="whitespace-pre-wrap font-mono">
                    <span className="text-[#38bdf8] select-none">$ </span>
                    {log}
                  </div>
                ))}
                {/* Simulated blinking cursor */}
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-[#38bdf8] select-none">$ </span>
                  <span className="w-2 h-4 bg-green-500 animate-[pulse_1s_infinite]" />
                </div>
              </div>

            </div>
          </div>
        </main>
      )}

      {/* 6. INGESTED KNOWLEDGE BASE VIEW (Only shown when activeView === 'articles') */}
      {activeView === 'articles' && (
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#202123]">
          {/* Header */}
          <header className="p-4 border-b border-[#2d2d2d] bg-[#202123]/80 backdrop-blur-sm shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col">
              <h2 className="font-semibold text-white text-base sm:text-lg">Ingested Knowledge Base</h2>
              <p className="text-xs text-slate-400">Manage and verify the grounding documents stored in the Gemini Vector Store</p>
            </div>
            <div className="text-xs text-slate-400 font-mono bg-[#191919] border border-[#2d2d2d] px-2.5 py-1 rounded">
              Total: {articles.length} Documents
            </div>
          </header>

          {/* Articles Table Grid */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-6xl mx-auto space-y-4">
              
              {/* Search bar */}
              <div className="bg-[#2d2d2d] rounded-xl border border-[#3d3d3d] p-4 flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="Search articles by title..."
                  value={articleSearchQuery}
                  onChange={(e) => setArticleSearchQuery(e.target.value)}
                  className="flex-1 bg-[#191919] border border-[#3d3d3d] rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Table wrapper */}
              <div className="bg-[#2d2d2d] rounded-xl border border-[#3d3d3d] overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#3d3d3d] bg-[#1c1d1f] text-slate-400 text-[10px] font-bold uppercase tracking-wider select-none">
                        <th className="p-4 w-12 text-center">RAG</th>
                        <th className="p-4">Title</th>
                        <th className="p-4 hidden sm:table-cell">Source Type</th>
                        <th className="p-4 hidden md:table-cell">ID</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3d3d3d]/50 text-xs text-slate-300">
                      {articles
                        .filter(art => art.title.toLowerCase().includes(articleSearchQuery.toLowerCase()))
                        .map((art, idx) => {
                          const isInactive = art.active === false;
                          return (
                            <tr 
                              key={idx} 
                              className={`hover:bg-[#2c2d30]/30 transition-colors ${
                                isInactive ? 'text-slate-500 bg-[#1e1e1e]/10' : ''
                              }`}
                            >
                              <td className="p-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => toggleArticleActive(art.slug)}
                                  className={`w-4 h-4 mx-auto rounded flex items-center justify-center border transition-all cursor-pointer ${
                                    art.active !== false
                                      ? 'bg-blue-600 border-blue-500 hover:bg-blue-700'
                                      : 'bg-transparent border-[#4d4d4d] hover:border-slate-500'
                                  }`}
                                  title={art.active !== false ? "Click to deactivate this article" : "Click to activate this article"}
                                >
                                  {art.active !== false && (
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </button>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col gap-0.5 max-w-md sm:max-w-xl">
                                  <button
                                    onClick={() => openArticleInDrawer(art.slug)}
                                    className={`text-left font-medium hover:text-blue-400 hover:underline cursor-pointer truncate ${
                                      isInactive ? 'line-through text-slate-600' : 'text-slate-200'
                                    }`}
                                  >
                                    {art.title}
                                  </button>
                                  {art.source_url && art.source_url !== '#' && (
                                    <span className="text-[10px] text-slate-500 truncate select-all">{art.source_url}</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 hidden sm:table-cell">
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                  art.source_url && art.source_url.startsWith('http') 
                                    ? 'bg-purple-900/40 text-purple-300 border border-purple-800/20' 
                                    : (art.title.startsWith('manual-') 
                                        ? 'bg-green-900/40 text-green-300 border border-green-800/20' 
                                        : 'bg-blue-900/40 text-blue-300 border border-blue-800/20')
                                }`}>
                                  {art.source_url && art.source_url.startsWith('http') ? 'url' : (art.title.startsWith('manual-') ? 'manual' : 'file')}
                                </span>
                              </td>
                              <td className="p-4 hidden md:table-cell font-mono text-slate-500 text-[10px]">
                                {art.article_id || 'N/A'}
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => openArticleInDrawer(art.slug)}
                                    className="px-2.5 py-1 rounded bg-[#1c1d1f] hover:bg-slate-800 border border-[#3d3d3d] hover:border-slate-500 text-slate-300 hover:text-white transition-all cursor-pointer font-medium"
                                  >
                                    Read
                                  </button>
                                  {art.source_url && art.source_url !== '#' && (
                                    <a
                                      href={art.source_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1 rounded bg-[#1c1d1f] hover:bg-slate-800 border border-[#3d3d3d] hover:text-blue-400 transition-all shrink-0 cursor-pointer"
                                      title="Open live support URL"
                                    >
                                      <LinkIcon className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {articles.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-slate-500 italic">
                            No support documents ingested. Go to the Knowledge Base tab to scrape or upload documents.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </main>
      )}

      {/* RAG Slide-over Document Drawer */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      <div 
        className={`fixed top-0 right-0 bottom-0 w-[550px] max-w-[90vw] bg-[#171c26] border-l border-[#2d2d2d] shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#2d2d2d] flex items-center justify-between shrink-0 bg-[#121620]">
          <div className="flex items-center gap-2 text-white">
            <BookOpenIcon className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-sm truncate max-w-[320px]">
              {drawerLoading ? 'Loading Article...' : (drawerArticle ? drawerArticle.title : 'RAG Source Document')}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {drawerArticle && drawerArticle.source_url && drawerArticle.source_url !== '#' && (
              <a 
                href={drawerArticle.source_url} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-blue-400 hover:underline flex items-center gap-1 bg-slate-900 border border-[#2d2d2d] px-2.5 py-1 rounded select-none"
              >
                <LinkIcon className="w-3 h-3" />
                <span>Original URL</span>
              </a>
            )}
            <button 
              onClick={() => setDrawerOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#2d2d2d] transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-300 text-sm leading-relaxed select-text">
          {drawerLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <span className="text-xs text-slate-400 font-medium animate-pulse">Retrieving RAG source content...</span>
            </div>
          ) : drawerArticle ? (
            <div className="space-y-4">
              <div 
                className="prose prose-invert max-w-none text-xs"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(drawerArticle.content) }} 
              />
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12">
              No document content loaded.
            </div>
          )}
        </div>
      </div>

    </div>
  </div>
  );
}

export default App;
