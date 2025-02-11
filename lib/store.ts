import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

type ChatStore = {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [
        {
          id: 1,
          text: "Hello! I'm an AI assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ],
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: state.messages.length + 1,
              timestamp: new Date(),
            },
          ],
        })),
      clearMessages: () =>
        set({
          messages: [
            {
              id: 1,
              text: "Hello! I'm an AI assistant. How can I help you today?",
              sender: 'bot',
              timestamp: new Date(),
            },
          ],
        }),
    }),
    {
      name: 'chat-storage',
    }
  )
);