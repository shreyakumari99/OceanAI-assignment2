import React, { useState } from 'react';
import { DEFAULT_PROMPTS, MOCK_EMAILS } from './constants';
import { AgentPrompts, Email } from './types';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import BrainConfig from './components/BrainConfig';
import ChatPanel from './components/ChatPanel';
import { Settings, Brain, Inbox } from 'lucide-react';

const App: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<AgentPrompts>(DEFAULT_PROMPTS);
  
  const [isBrainConfigOpen, setIsBrainConfigOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const selectedEmail = emails.find(e => e.id === selectedEmailId) || null;

  const handleUpdateEmail = (updatedEmail: Email) => {
    setEmails(prev => prev.map(e => e.id === updatedEmail.id ? updatedEmail : e));
  };

  const handleUpdatePrompts = (newPrompts: AgentPrompts) => {
    setPrompts(newPrompts);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900">
      {/* Navigation Bar (Leftmost slim rail) */}
      <div className="w-16 bg-slate-900 flex flex-col items-center py-6 gap-6 text-slate-400 shrink-0 z-20 shadow-xl">
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/50 mb-4">
          <Inbox size={24} />
        </div>
        
        <button 
          onClick={() => setIsBrainConfigOpen(true)}
          className="p-3 hover:bg-slate-800 rounded-xl hover:text-indigo-400 transition-all group relative"
          title="Configure Agent Brain"
        >
          <Brain size={24} />
          <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Agent Brain
          </span>
        </button>

        <div className="flex-1" />

        <button className="p-3 hover:bg-slate-800 rounded-xl hover:text-slate-200 transition-all">
          <Settings size={24} />
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Email List Column */}
        <EmailList 
          emails={emails} 
          selectedId={selectedEmailId} 
          onSelect={setSelectedEmailId} 
        />

        {/* Detail View Column */}
        <main className="flex-1 flex flex-col min-w-0 relative">
            <EmailDetail 
                email={selectedEmail}
                prompts={prompts}
                onUpdateEmail={handleUpdateEmail}
                onOpenChat={() => setIsChatOpen(true)}
            />
        </main>

        {/* Chat Overlay/Panel */}
        <ChatPanel 
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            currentEmail={selectedEmail}
            prompts={prompts}
        />

      </div>

      {/* Modals */}
      <BrainConfig 
        isOpen={isBrainConfigOpen}
        onClose={() => setIsBrainConfigOpen(false)}
        prompts={prompts}
        onUpdatePrompts={handleUpdatePrompts}
      />
    </div>
  );
};

export default App;