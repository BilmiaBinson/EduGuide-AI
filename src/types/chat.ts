export type MessageRole = 'user' | 'assistant';

export type SourceItem = string | {
  title?: string;
  url: string;
  snippet?: string;
};

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  sources?: SourceItem[];
  timestamp: string;
  isError?: boolean;
  errorMessage?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface ChatApiRequest {
  question: string;
}

export interface ChatApiResponse {
  answer: string;
  sources?: SourceItem[];
}
