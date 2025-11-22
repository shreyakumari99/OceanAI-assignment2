# OCEANAI ASSIGNMENT 2
# InboxIQ - Intelligent Email Productivity Agent

InboxIQ is a modern, AI-powered email productivity tool designed to help users manage their inbox by automating categorization, extracting actionable tasks, and drafting replies using a configurable "Agent Brain".

## Features

- **📧 Smart Categorization**: Automatically analyzes email content to determine categories (Work, Personal, Finance, Spam) and priority levels (High, Medium, Low).
- **✅ Action Item Extraction**: Identifies specific tasks and due dates within email bodies, converting unstructured text into a structured todo list.
- **✍️ Auto-Draft Replies**: Generates context-aware, professional replies based on the email content and your configured persona.
- **💬 Contextual Chat Agent**: A built-in chat interface that allows you to ask questions about the currently selected email or perform ad-hoc tasks using the email as context.
- **🧠 Configurable Agent Brain**: A dedicated settings panel to customize the system prompts that drive the AI's behavior, allowing you to tweak the persona, categorization logic, and drafting style.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 2.5 Flash (via `@google/genai` SDK)
- **Icons**: Lucide React

## Getting Started

### Installation & Running

1.  **Environment Setup**:
    *   This project expects the API key to be available via `process.env.API_KEY`.
    *   Ensure your environment injects this variable securely.

2.  **Running**:
    *   The application uses standard ES modules and React. It is designed to run in a modern web environment supporting ESM.

## Project Structure

- **`App.tsx`**: Main application layout and state management.
- **`services/geminiService.ts`**: Handles all interactions with the Google Gemini API (categorization, extraction, drafting, chat).
- **`components/`**:
    - **`EmailList.tsx`**: Sidebar displaying the list of emails.
    - **`EmailDetail.tsx`**: Main view for reading emails and triggering AI actions.
    - **`ChatPanel.tsx`**: Slide-out chat interface for conversational interaction.
    - **`BrainConfig.tsx`**: Modal for editing system prompts ("The Brain").
- **`constants.ts`**: Contains mock email data and default system prompts.
- **`types.ts`**: TypeScript interfaces for application state.

## Customizing the "Brain"

Click the **Brain icon** in the left sidebar to open the configuration panel. Here you can modify:

- **Core Persona**: Change how the chatbot speaks (e.g., "Pirate", "Formal Executive", "Helpful Friend").
- **Categorization Logic**: Define your own categories or priority rules.
- **Action Extraction**: Tweak how the AI identifies tasks.
- **Auto-Reply Style**: Adjust the tone and length of generated drafts.

Changes take effect immediately for subsequent AI requests.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Pictures
<img width="776" height="426" alt="Screenshot 2025-11-22 172706" src="https://github.com/user-attachments/assets/f371f365-27e9-4b95-baea-617fe77cef40" />
<img width="779" height="574" alt="Screenshot 2025-11-22 172752" src="https://github.com/user-attachments/assets/e6c6ef06-efc9-4b43-9c91-d9cecb30ffa8" />
<img width="801" height="580" alt="Screenshot 2025-11-22 172827" src="https://github.com/user-attachments/assets/4ff5469a-e0d5-4efb-bd40-3bd76096e9e7" />
<img width="783" height="579" alt="Screenshot 2025-11-22 173238" src="https://github.com/user-attachments/assets/ab502bb2-c9ac-43c4-bd65-ee74ed696ccf" />
<img width="816" height="580" alt="Screenshot 2025-11-22 173302" src="https://github.com/user-attachments/assets/d1f63e19-ee4d-4ef3-b3b2-7cfd9c09ea37" />


