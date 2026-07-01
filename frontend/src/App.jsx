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

function ChevronDownIcon({ className = "w-4 h-4" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

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
  // Escape HTML
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
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am **OptiBot**, the customer-support assistant for OptiSigns. Ask me anything about configuring screens, apps, or troubleshooting player issues!',
      sources: []
    },
    {
      id: 'mock-q',
      role: 'user',
      content: 'How do I add a YouTube video?'
    },
    {
      id: 'mock-a',
      role: 'assistant',
      content: 'To add a YouTube video to OptiSigns, follow these steps:\n* Log in to your OptiSigns portal at app.optisigns.com.\n* Navigate to **Files/Assets** and click on **App**.\n* Select **YouTube** or **YouTube Live** from the app options.\n* Enter a **Name** and paste the direct **YouTube URL**.\n* Click **Save**.\n\nArticle URL: https://support.optisigns.com/hc/en-us/articles/360051014713-How-to-use-YouTube-with-OptiSigns',
      sources: [
        'How to use YouTube with OptiSigns (ID: 360051014713)',
        'OptiSigns App Store overview'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStats, setSyncStats] = useState(null);
  const [articles, setArticles] = useState([]);
  const [activeStoreName, setActiveStoreName] = useState('Not Initialized');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef(null);

  // Load sync stats and list of ingested articles
  useEffect(() => {
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
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 250;
      if (isNearBottom || messages.length <= 3) {
        scrollToBottom();
      }
    }
  }, [messages, isLoading]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      setShowScrollButton(!isNearBottom);
    }
  };

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
      if (isLoading) setIsLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#202123] text-slate-200 antialiased">
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
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium bg-[#2d2d2d] text-white cursor-pointer">
              <MessageSquareIcon className="w-4 h-4 text-slate-300" />
              <span>Chat</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-[#2d2d2d]/40 cursor-not-allowed">
              <BookOpenIcon className="w-4 h-4 text-slate-500" />
              <span>Knowledge Base</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-[#2d2d2d]/40 cursor-not-allowed">
              <TerminalIcon className="w-4 h-4 text-slate-500" />
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

      {/* 2. MAIN CHAT AREA (Flex grow) */}
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
            gemini-2.5-flash
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

        {/* 4. INPUT BOX (Fixed at bottom, shrink-0) */}
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
    </div>
  );
}

export default App;
