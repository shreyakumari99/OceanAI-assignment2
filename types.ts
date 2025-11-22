export interface Email {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  // AI Enhanced fields
  category?: string;
  priority?: 'High' | 'Medium' | 'Low';
  actionItems?: ActionItem[];
  draftReply?: string;
}

export interface ActionItem {
  task: string;
  dueDate?: string;
  status: 'pending' | 'completed';
}

export interface AgentPrompts {
  categorizer: string;
  extractor: string;
  replier: string;
  persona: string;
}

export enum AIStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}