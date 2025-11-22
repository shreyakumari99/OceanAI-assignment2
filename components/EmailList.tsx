import React from 'react';
import { Email } from '../types';
import { Mail, Star, AlertCircle } from 'lucide-react';

interface EmailListProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const EmailList: React.FC<EmailListProps> = ({ emails, selectedId, onSelect }) => {
  return (
    <div className="w-full md:w-80 lg:w-96 border-r bg-white h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-bold text-lg text-slate-800">Inbox</h2>
        <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded-full text-slate-600">{emails.length}</span>
      </div>
      <div className="overflow-y-auto flex-1">
        {emails.map((email) => {
          const isSelected = email.id === selectedId;
          return (
            <div
              key={email.id}
              onClick={() => onSelect(email.id)}
              className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${
                isSelected ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-semibold truncate pr-2 ${!email.read ? 'text-slate-900' : 'text-slate-600'}`}>
                  {email.fromName}
                </h3>
                <span className="text-xs text-slate-400 whitespace-nowrap">{email.timestamp}</span>
              </div>
              <p className={`text-sm truncate mb-2 ${!email.read ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                {email.subject}
              </p>
              
              <div className="flex gap-2 flex-wrap">
                 {email.category && (
                   <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border">
                     {email.category}
                   </span>
                 )}
                 {email.priority === 'High' && (
                   <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-600 flex items-center gap-1">
                     <AlertCircle size={10} /> Urgent
                   </span>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmailList;