import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ message, index }) {
  
  const formatTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-IN", { 
        hour: "numeric", 
        minute: "2-digit",
        hour12: true 
      });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="space-y-6 px-2">
      
      {/* User Question - Aligned Right */}
      <div className="flex justify-end animate-fadeIn group">
        <div className="flex items-end gap-3 max-w-[80%] md:max-w-[75%]">
          <div className="order-1 flex flex-col items-end">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl rounded-br-none px-5 py-4 shadow-xl shadow-blue-500/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-2xl group-hover:shadow-blue-500/30">
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {message.question}
              </p>
            </div>
            {message.createdAt && (
              <p className="text-xs text-slate-400 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {formatTime(message.createdAt)}
              </p>
            )}
          </div>
          <div className="order-2 h-9 w-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center flex-shrink-0 shadow-md border border-slate-600/50 mt-1 group-hover:scale-110 transition-transform duration-300">
            <svg className="h-4.5 w-4.5 text-slate-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* AI Answer - Aligned Left */}
      <div className="flex justify-start animate-fadeIn group" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-start gap-4 max-w-[90%] md:max-w-[85%]">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20 mt-1 border border-emerald-400/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <svg className="h-4.5 w-4.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl rounded-tl-none px-5 py-4 shadow-lg shadow-slate-900/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-slate-600/50 group-hover:shadow-xl group-hover:shadow-slate-900/50">
              <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-slate-700 prose-pre:text-slate-300 prose-code:text-cyan-400 prose-code:bg-cyan-500/10 prose-code:px-1.5 prose-code:py-1 prose-code:rounded prose-code:border prose-code:border-cyan-500/20 prose-strong:text-slate-100 prose-headings:text-slate-200 prose-headings:font-bold prose-a:text-blue-400 prose-a:no-underline prose-a:border-b prose-a:border-blue-500/30 hover:prose-a:border-blue-400 prose-blockquote:border-l-4 prose-blockquote:border-slate-600 prose-blockquote:pl-4 prose-blockquote:italic">
                <ReactMarkdown>{message.answer}</ReactMarkdown>
              </div>
            </div>
            {message.createdAt && (
              <p className="text-xs text-slate-500 mt-2 ml-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {formatTime(message.createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      <style >{`
        /* Dark Theme Prose Styling */
        .prose {
          color: #e2e8f0;
        }
        
        .prose p { 
          margin-top: 0.75em; 
          margin-bottom: 0.75em; 
          color: #cbd5e1; 
          line-height: 1.7; 
        }
        
        .prose strong { 
          color: #f1f5f9; 
          font-weight: 600; 
        }
        
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: #f8fafc;
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        
        .prose h1 { font-size: 1.5em; }
        .prose h2 { font-size: 1.3em; }
        .prose h3 { font-size: 1.1em; }
        
        .prose a { 
          color: #60a5fa; 
          text-decoration: none; 
          font-weight: 500;
          border-bottom: 1px solid rgba(96, 165, 250, 0.3);
          transition: all 0.2s;
        }
        
        .prose a:hover { 
          color: #3b82f6;
          border-bottom-color: rgba(59, 130, 246, 0.6);
        }
        
        .prose ul, .prose ol { 
          margin-top: 0.75em; 
          margin-bottom: 0.75em; 
          padding-left: 1.5em;
        }
        
        .prose ul > li { 
          margin-top: 0.25em; 
          margin-bottom: 0.25em; 
          position: relative;
          color: #cbd5e1;
        }
        
        .prose ol > li { 
          margin-top: 0.25em; 
          margin-bottom: 0.25em; 
          color: #cbd5e1;
        }
        
        .prose ul > li::marker { 
          color: #94a3b8; 
        }
        
        .prose ol > li::marker { 
          color: #94a3b8; 
          font-weight: 600; 
        }
        
        .prose li::marker { 
          color: #94a3b8; 
        }
        
        /* Inline Code */
        .prose code:not(pre code) { 
          color: #22d3ee;
          background-color: rgba(34, 211, 238, 0.1);
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-weight: 500;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.875em;
          border: 1px solid rgba(34, 211, 238, 0.2);
        }
        
        .prose code:not(pre code)::before,
        .prose code:not(pre code)::after {
          content: '';
        }

        /* Code Blocks */
        .prose pre { 
          background-color: rgba(15, 23, 42, 0.5);
          border: 1px solid #334155;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-top: 1em;
          margin-bottom: 1em;
          overflow-x: auto;
          position: relative;
        }
        
        .prose pre::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #0ea5e9, transparent);
        }
        
        .prose pre code {
          background-color: transparent;
          color: #cbd5e1;
          padding: 0;
          font-weight: 400;
          border: none;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        
        /* Blockquotes */
        .prose blockquote {
          border-left-color: #475569;
          background: rgba(30, 41, 59, 0.3);
          padding: 1em;
          border-radius: 0 0.5rem 0.5rem 0;
          margin: 1.5em 0;
        }
        
        .prose blockquote p {
          color: #94a3b8;
          margin: 0;
        }
        
        .prose hr {
          border-color: #475569;
          margin: 2em 0;
        }
        
        /* Tables */
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
        }
        
        .prose table th {
          background-color: rgba(30, 41, 59, 0.5);
          color: #f1f5f9;
          font-weight: 600;
          text-align: left;
          padding: 0.75em 1em;
          border: 1px solid #334155;
        }
        
        .prose table td {
          padding: 0.75em 1em;
          border: 1px solid #334155;
          color: #cbd5e1;
        }
        
        .prose table tr:nth-child(even) {
          background-color: rgba(30, 41, 59, 0.2);
        }
        
        .prose > :first-child { margin-top: 0; }
        .prose > :last-child { margin-bottom: 0; }
        
        /* Lists */
        .prose ul > li::before {
          content: '•';
          color: #60a5fa;
          font-weight: bold;
          display: inline-block;
          width: 1em;
          margin-left: -1em;
        }
        
        .prose ol {
          counter-reset: list-counter;
        }
        
        .prose ol > li {
          counter-increment: list-counter;
        }
        
        .prose ol > li::before {
          content: counter(list-counter) '.';
          color: #60a5fa;
          font-weight: bold;
          position: absolute;
          left: -1.5em;
        }
      `}</style>
    </div>
  );
}