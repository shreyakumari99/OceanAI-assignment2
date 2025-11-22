import { AgentPrompts, Email } from "./types";

export const DEFAULT_PROMPTS: AgentPrompts = {
  persona: "You are a highly efficient executive assistant. You are concise, professional, and proactive. You help manage a busy inbox.",
  categorizer: "Analyze the email content and categorize it into one of the following: 'Work', 'Personal', 'Newsletter', 'Finance', 'Spam'. Also determine priority (High, Medium, Low).",
  extractor: "Extract clear, actionable tasks from the email. If there are dates, identifying them is crucial. Ignore generic pleasantries.",
  replier: "Draft a professional reply to this email. Keep it brief but polite. Address any questions asked in the email directly."
};

export const MOCK_EMAILS: Email[] = [
  {
    id: '1',
    fromName: 'Sarah Jenkins',
    fromEmail: 'sarah.j@techcorp.com',
    subject: 'Q4 Roadmap Review - Urgent',
    body: `Hi Team,

We need to finalize the Q4 roadmap by this Friday. I've attached the preliminary slides (not really, this is a mock). 

Please review the timeline for the "Project Apollo" launch. I need everyone's feedback on the resourcing slide by Wednesday EOD.

Also, can we reschedule our Thursday sync to 2 PM?

Thanks,
Sarah`,
    timestamp: '10:30 AM',
    read: false,
  },
  {
    id: '2',
    fromName: 'Acme Newsletter',
    fromEmail: 'news@acme.inc',
    subject: '5 Ways to Boost Productivity',
    body: `Welcome to the weekly Acme digest!

1. Sleep more.
2. Drink water.
3. Use AI agents.

Click here to read more...`,
    timestamp: '09:15 AM',
    read: true,
  },
  {
    id: '3',
    fromName: 'Finance Dept',
    fromEmail: 'billing@saas-service.com',
    subject: 'Invoice #9921 Overdue',
    body: `Dear Customer,

Your payment for Invoice #9921 was due yesterday. Please remit payment of $49.99 immediately to avoid service interruption.

Link to pay: [Link]

Regards,
Billing Team`,
    timestamp: 'Yesterday',
    read: false,
  },
  {
    id: '4',
    fromName: 'Mom',
    fromEmail: 'mom@gmail.com',
    subject: 'Sunday Dinner?',
    body: `Hey honey, are you coming over for dinner this Sunday? Dad is making his famous lasagna. Let me know so I can buy enough cheese! Love you.`,
    timestamp: 'Yesterday',
    read: true,
  }
];