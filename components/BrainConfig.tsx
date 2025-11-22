import React from 'react';
import { AgentPrompts } from '../types';
import { X, Save, RotateCcw } from 'lucide-react';
import { DEFAULT_PROMPTS } from '../constants';

interface BrainConfigProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: AgentPrompts;
  onUpdatePrompts: (prompts: AgentPrompts) => void;
}

const BrainConfig: React.FC<BrainConfigProps> = ({ isOpen, onClose, prompts, onUpdatePrompts }) => {
  const [localPrompts, setLocalPrompts] = React.useState<AgentPrompts>(prompts);

  if (!isOpen) return null;

  const handleChange = (key: keyof AgentPrompts, value: string) => {
    setLocalPrompts(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdatePrompts(localPrompts);
    onClose();
  };

  const handleReset = () => {
    setLocalPrompts(DEFAULT_PROMPTS);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Agent Brain Configuration</h2>
            <p className="text-sm text-slate-500">Define how your AI agent thinks and acts.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Core Persona</label>
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm h-24 resize-none"
              value={localPrompts.persona}
              onChange={(e) => handleChange('persona', e.target.value)}
              placeholder="Define the AI's personality..."
            />
            <p className="text-xs text-slate-400">This instruction governs the Chat interaction.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Categorization Logic</label>
              <textarea
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm h-32"
                value={localPrompts.categorizer}
                onChange={(e) => handleChange('categorizer', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Action Item Extraction</label>
              <textarea
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm h-32"
                value={localPrompts.extractor}
                onChange={(e) => handleChange('extractor', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Auto-Reply Style</label>
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm h-24"
              value={localPrompts.replier}
              onChange={(e) => handleChange('replier', e.target.value)}
            />
          </div>

        </div>

        <div className="p-4 border-t bg-slate-50 flex justify-between items-center">
           <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors text-sm"
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all"
          >
            <Save size={18} />
            Save Brain Config
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrainConfig;