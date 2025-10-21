/**
 * Chat Store
 * Manages chat conversations and messages with hierarchy support
 */

import { create } from 'zustand';
import { api } from '@/lib/api';
import { Message } from '@/types/message.types';
import toast from 'react-hot-toast';

interface Conversation {
  id: string;
  projectId: string;
  clientId: string;
  agentName: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
}

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  
  // Actions
  fetchConversations: (projectId?: string) => Promise<void>;
  createConversation: (projectId: string, clientId: string, agentName: string, initialMessage?: string) => Promise<Conversation>;
  selectConversation: (conversationId: string) => Promise<void>;
  sendMessage: (message: string, agentName?: string) => Promise<void>;
  regenerateMessage: (messageId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isStreaming: false,
  error: null,

  fetchConversations: async (projectId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const conversations = await api.getConversations();
      const filtered = projectId 
        ? conversations.filter((c: any) => c.projectId === projectId)
        : conversations;
      set({ conversations: filtered, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to load conversations');
    }
  },

  createConversation: async (projectId: string, clientId: string, agentName: string, initialMessage?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Send initial message if provided
      const response = await api.chat({
        message: initialMessage || 'Hello',
        agentName,
        projectId,
        clientId,
      });

      const conversation: Conversation = {
        id: response.conversationId,
        projectId,
        clientId,
        agentName,
        title: initialMessage?.substring(0, 50) || 'New conversation',
        messages: [
          { 
            id: '1',
            role: 'user', 
            content: initialMessage || 'Hello',
            timestamp: new Date()
          },
          { 
            id: '2',
            role: 'assistant', 
            content: response.response.content,
            timestamp: new Date()
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
      };

      set({ 
        currentConversation: conversation,
        messages: conversation.messages,
        conversations: [conversation, ...get().conversations],
        isLoading: false 
      });

      return conversation;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to create conversation');
      throw error;
    }
  },

  selectConversation: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const conversations = get().conversations;
      const conversation = conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        set({ 
          currentConversation: conversation,
          messages: conversation.messages,
          isLoading: false 
        });
      } else {
        // Fetch conversation details if not in store
        const convData = await api.getConversations();
        const found = convData.find((c: any) => c.id === conversationId);
        if (found) {
          set({ 
            currentConversation: found,
            messages: found.messages || [],
            isLoading: false 
          });
        } else {
          throw new Error('Conversation not found');
        }
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to load conversation');
    }
  },

  sendMessage: async (message: string, agentName?: string) => {
    const { currentConversation } = get();
    
    if (!currentConversation) {
      toast.error('No active conversation');
      return;
    }

    set({ isStreaming: true, error: null });

    // Add user message optimistically
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    set({ messages: [...get().messages, userMessage] });

    try {
      const response = await api.chat({
        message,
        agentName: agentName || currentConversation.agentName,
        conversationId: currentConversation.id,
        projectId: currentConversation.projectId,
        clientId: currentConversation.clientId,
      });

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response.content,
        timestamp: new Date(),
      };

      const updatedMessages = [...get().messages, assistantMessage];
      
      set({ 
        messages: updatedMessages,
        currentConversation: {
          ...currentConversation,
          messages: updatedMessages,
          lastMessageAt: new Date().toISOString(),
        },
        isStreaming: false 
      });

    } catch (error: any) {
      // Remove optimistic user message on error
      set({ 
        messages: get().messages.filter(m => m !== userMessage),
        error: error.message,
        isStreaming: false 
      });
      toast.error('Failed to send message');
    }
  },

  regenerateMessage: async (messageId: string) => {
    // Implementation for regenerating last message
    const { currentConversation, messages } = get();
    
    if (!currentConversation || messages.length < 2) {
      return;
    }

    set({ isStreaming: true });

    try {
      // Get the last user message
      const lastUserMessageIndex = messages.map((m, i) => m.role === 'user' ? i : -1).filter(i => i >= 0).pop();
      
      if (lastUserMessageIndex === undefined) {
        throw new Error('No user message found');
      }

      const lastUserMessage = messages[lastUserMessageIndex];

      // Remove last assistant response
      const messagesWithoutLast = messages.slice(0, -1);
      set({ messages: messagesWithoutLast });

      // Regenerate
      const response = await api.chat({
        message: lastUserMessage.content,
        conversationId: currentConversation.id,
        projectId: currentConversation.projectId,
        clientId: currentConversation.clientId,
      });

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.response.content,
        timestamp: new Date(),
      };

      set({ 
        messages: [...messagesWithoutLast, assistantMessage],
        isStreaming: false 
      });

      toast.success('Response regenerated');
    } catch (error: any) {
      set({ error: error.message, isStreaming: false });
      toast.error('Failed to regenerate response');
    }
  },

  deleteConversation: async (conversationId: string) => {
    try {
      await api.deleteConversation(conversationId);
      const conversations = get().conversations.filter(c => c.id !== conversationId);
      set({ 
        conversations,
        currentConversation: get().currentConversation?.id === conversationId ? null : get().currentConversation,
        messages: get().currentConversation?.id === conversationId ? [] : get().messages,
      });
      toast.success('Conversation deleted');
    } catch (error: any) {
      toast.error('Failed to delete conversation');
    }
  },

  clearError: () => set({ error: null }),
}));

