import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ChatMessage, ChatSession } from './types/chat';
import { sendChatQuestion } from './services/api';

const STORAGE_KEY = 'eduguide_ai_sessions_v1';

const createNewSession = (title: string = 'New Conversation'): ChatSession => ({
  id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  title,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [],
});

export const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return [createNewSession()];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return sessions[0]?.id || '';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Synchronize sessions to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (err) {
      console.error('Failed to save sessions to localStorage:', err);
    }
  }, [sessions]);

  // Ensure there is always an active session
  useEffect(() => {
    if (!sessions.some((s) => s.id === currentSessionId)) {
      if (sessions.length > 0) {
        setCurrentSessionId(sessions[0].id);
      } else {
        const fresh = createNewSession();
        setSessions([fresh]);
        setCurrentSessionId(fresh.id);
      }
    }
  }, [sessions, currentSessionId]);

  const currentSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];

  const handleNewChat = useCallback(() => {
    // If the current session is already empty, just stay on it
    if (currentSession && currentSession.messages.length === 0) {
      return;
    }
    const fresh = createNewSession();
    setSessions((prev) => [fresh, ...prev]);
    setCurrentSessionId(fresh.id);
  }, [currentSession]);

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fresh = createNewSession();
        return [fresh];
      }
      return filtered;
    });
  };

  const handleClearChat = () => {
    if (!currentSession) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === currentSessionId ? { ...s, messages: [], updatedAt: new Date().toISOString() } : s))
    );
  };

  const handleSendMessage = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: question,
      timestamp,
    };

    // Update active session with the user's message & update session title if first message
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== currentSessionId) return session;

        const isFirstMessage = session.messages.length === 0;
        const newTitle = isFirstMessage
          ? question.length > 32
            ? `${question.slice(0, 32)}...`
            : question
          : session.title;

        return {
          ...session,
          title: newTitle,
          updatedAt: new Date().toISOString(),
          messages: [...session.messages, userMessage],
        };
      })
    );

    setIsLoading(true);

    try {
      // Call backend POST /chat
      const response = await sendChatQuestion(question);

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: response.answer,
        sources: response.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                updatedAt: new Date().toISOString(),
                messages: [...session.messages, assistantMessage],
              }
            : session
        )
      );
    } catch (error: unknown) {
      const err = error as Error;
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: '',
        isError: true,
        errorMessage: err.message || 'An unexpected error occurred while communicating with EduGuide AI.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                updatedAt: new Date().toISOString(),
                messages: [...session.messages, errorMessage],
              }
            : session
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLastQuestion = () => {
    if (!currentSession) return;
    const userMessages = currentSession.messages.filter((m) => m.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1];
    if (lastUserMessage) {
      // Remove trailing error message
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id !== currentSessionId) return session;
          const filtered = [...session.messages];
          if (filtered.length > 0 && filtered[filtered.length - 1].isError) {
            filtered.pop();
          }
          return {
            ...session,
            messages: filtered,
          };
        })
      );
      handleSendMessage(lastUserMessage.content);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <ChatArea
        messages={currentSession?.messages || []}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onRetryLastQuestion={handleRetryLastQuestion}
        currentTitle={currentSession?.title}
      />
    </div>
  );
};

export default App;
