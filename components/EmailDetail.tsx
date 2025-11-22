import React, { useEffect, useState } from 'react';
import { Email, ActionItem, AIStatus, AgentPrompts } from '../types';
import { categorizeEmail, extractActionItems, draftReply } from '../services/geminiService';
import { Brain, CheckSquare, Send, Sparkles, Tag, Loader2, PenTool } from 'lucide-react';

interface EmailDetailProps {
  email: Email | null;
  prompts: AgentPrompts;
  onUpdateEmail: (updatedEmail: Email) => void;
  onOpenChat: () => void;
}

const EmailDetail: React.FC<EmailDetailProps> = ({ email, prompts, onUpdateEmail, onOpenChat }) => {
  const [status, setStatus] = useState<AIStatus>(AIStatus.IDLE);
  const [activeTab, setActiveTab] = useState<'read' | 'draft'>('read');
  const [draftText, setDraftText] = useState('');

  // Reset state when email changes
  useEffect(() => {
    setStatus(AIStatus.IDLE);
    setActiveTab('read');
    setDraftText(email?.draftReply || '');
  }, [email?.id]);

  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400 h-full">
        <Brain size={48} className="mb-4 opacity-50" />
        <p>Select an email to begin processing</p>
      </div>
    );
  }

  const handleCategorize = async () => {
    setStatus(AIStatus.LOADING);
    const result = await categorizeEmail(email, prompts.categorizer);
    onUpdateEmail({ ...email, ...result });
    setStatus(AIStatus.SUCCESS);
  };

  const handleExtractActions = async () => {
    setStatus(AIStatus.LOADING);
    const items = await extractActionItems(email, prompts.extractor);
    onUpdateEmail({ ...email, actionItems: items });
    setStatus(AIStatus.SUCCESS);
  };

  const handleDraftReply = async () => {
    setStatus(AIStatus.LOADING);
    setActiveTab('draft');
    const draft = await draftReply(email, prompts.replier);
    setDraftText(draft);
    onUpdateEmail({ ...email, draftReply: draft });
    setStatus(AIStatus.SUCCESS);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
      {/* Header */}
      <div className="p-6 border-b bg-white sticky top-0 z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{email.subject}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{email.fromName}</span>
              <span>&lt;{email.fromEmail}&gt;</span>
              <span>•</span>
              <span>{email.timestamp}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onOpenChat}
              className="p-2 text-primary hover:bg-indigo-50 rounded-full transition-colors"
              title="Chat about this email"
            >
              <Brain size={20} />
            </button>
          </div>
        </div>

        {/* AI Toolbar */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCategorize}
            disabled={status === AIStatus.LOADING}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {status === AIStatus.LOADING ? <Loader2 size={14} className="animate-spin" /> : <Tag size={14} />}
            Categorize
          </button>
          
          <button
            onClick={handleExtractActions}
            disabled={status === AIStatus.LOADING}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors disabled:opacity-50 border border-emerald-200"
          >
            <CheckSquare size={14} />
            Extract Actions
          </button>

          <button
            onClick={handleDraftReply}
            disabled={status === AIStatus.LOADING}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors disabled:opacity-50 border border-indigo-200"
          >
            <Sparkles size={14} />
            Auto-Draft Reply
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* Read vs Draft Tabs */}
        {email.draftReply && (
            <div className="flex gap-4 mb-6 border-b">
                <button 
                    className={`pb-2 text-sm font-medium ${activeTab === 'read' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
                    onClick={() => setActiveTab('read')}
                >
                    Original Message
                </button>
                <button 
                    className={`pb-2 text-sm font-medium ${activeTab === 'draft' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
                    onClick={() => setActiveTab('draft')}
                >
                    Draft Reply
                </button>
            </div>
        )}

        {activeTab === 'read' ? (
            <div className="prose max-w-none text-slate-800">
              <div className="whitespace-pre-wrap font-sans">{email.body}</div>
            </div>
        ) : (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Generated Draft</h3>
                    <button className="text-xs text-indigo-600 hover:underline">Copy to clipboard</button>
                </div>
                <textarea 
                    className="w-full bg-transparent resize-none outline-none text-slate-700 h-64 text-sm leading-relaxed"
                    value={draftText}
                    onChange={(e) => {
                        setDraftText(e.target.value);
                        onUpdateEmail({...email, draftReply: e.target.value});
                    }}
                />
            </div>
        )}

        {/* Action Items Section */}
        {email.actionItems && email.actionItems.length > 0 && (
          <div className="mt-8 bg-yellow-50/50 border border-yellow-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-yellow-800 flex items-center gap-2 mb-3">
              <CheckSquare size={16} /> Action Items
            </h3>
            <div className="space-y-2">
              {email.actionItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-yellow-100 shadow-sm">
                  <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center ${item.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                    {item.status === 'completed' && <CheckSquare size={10} className="text-white" />}
                  </div>
                  <div>
                    <p className="text-sm text-slate-800 font-medium">{item.task}</p>
                    {item.dueDate && (
                      <span className="text-xs text-slate-500">Due: {item.dueDate}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailDetail;