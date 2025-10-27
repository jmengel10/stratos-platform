'use client';
import { useState, useEffect, useRef } from 'react';
import { getAllConversations, type Conversation } from '@/lib/storage';
import { Plus, MessageSquare, Search } from 'lucide-react';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const newChatButtonRef = useRef<HTMLButtonElement>(null);

  const addDebugInfo = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const debugMessage = `[${timestamp}] ${message}`;
    setDebugInfo(prev => [...prev, debugMessage]);
    console.log(debugMessage);
  };

  useEffect(() => {
    addDebugInfo('ConversationsPage: Component mounting');
    setIsMounted(true);
    
    // Load conversations from storage
    const loadedConversations = getAllConversations();
    setConversations(loadedConversations);
    addDebugInfo(`ConversationsPage: Loaded ${loadedConversations.length} conversations`);
    
    // Test if React is working
    addDebugInfo('ConversationsPage: React useEffect executed');
    
    return () => {
      addDebugInfo('ConversationsPage: Component unmounting');
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      addDebugInfo('ConversationsPage: Component mounted, setting up event listeners');
      
      // Add direct DOM event listener as fallback
      const button = newChatButtonRef.current;
      if (button) {
        addDebugInfo('ConversationsPage: Adding direct DOM event listener to button');
        const directHandler = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          addDebugInfo('ConversationsPage: Direct DOM event listener triggered');
          handleNewChat();
        };
        
        button.addEventListener('click', directHandler);
        
        return () => {
          button.removeEventListener('click', directHandler);
          addDebugInfo('ConversationsPage: Removed direct DOM event listener');
        };
      }
    }
  }, [isMounted]);

  const handleNewChat = () => {
    addDebugInfo('handleNewChat: Button clicked - attempting navigation');
    console.log('New Chat button clicked - attempting navigation');
    try {
      if (typeof window !== 'undefined') {
        addDebugInfo('handleNewChat: Navigating to /conversations/new');
        console.log('Navigating to /conversations/new');
        window.location.href = '/conversations/new';
      }
    } catch (error) {
      addDebugInfo(`handleNewChat: Error - ${error}`);
      console.error('Navigation error:', error);
      alert('Navigation failed. Please try refreshing the page.');
    }
  };

  const handleConversationClick = (conversationId: string) => {
    console.log('Conversation clicked:', conversationId);
    try {
      if (typeof window !== 'undefined') {
        window.location.href = `/conversations/${conversationId}`;
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Pure JavaScript Fallback Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          console.log('Pure JavaScript fallback script executing...');
          
          function setupDirectEventHandlers() {
            console.log('Setting up direct event handlers...');
            
            // Find all buttons with "New Chat" text
            const buttons = document.querySelectorAll('button');
            console.log('Found', buttons.length, 'buttons');
            
            buttons.forEach((button, index) => {
              console.log('Button', index, ':', button.textContent?.trim());
              
              if (button.textContent?.includes('New Chat') || button.textContent?.includes('Start Your First Chat')) {
                console.log('Found New Chat button, adding direct event listener');
                
                // Remove any existing event listeners
                const newButton = button.cloneNode(true);
                button.parentNode?.replaceChild(newButton, button);
                
                // Add direct event listener
                newButton.addEventListener('click', function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Direct event listener triggered for New Chat button');
                  console.log('Navigating to /conversations/new');
                  
                  try {
                    window.location.href = '/conversations/new';
                  } catch (error) {
                    console.error('Navigation error:', error);
                    alert('Navigation failed. Please try refreshing the page.');
                  }
                });
                
                console.log('Direct event listener added to New Chat button');
              }
            });
          }
          
          // Run immediately
          setupDirectEventHandlers();
          
          // Also run after a delay to catch dynamically loaded content
          setTimeout(setupDirectEventHandlers, 1000);
          setTimeout(setupDirectEventHandlers, 3000);
          
          console.log('Pure JavaScript fallback script completed');
        `
      }} />

      {/* Debug Panel */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-sm font-semibold text-yellow-800 mb-2">Debug Information:</h3>
        <div className="text-xs text-yellow-700 space-y-1 max-h-32 overflow-y-auto">
          {debugInfo.map((info, index) => (
            <div key={index}>{info}</div>
          ))}
        </div>
        <button 
          onClick={() => setDebugInfo([])}
          className="mt-2 px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300"
        >
          Clear Debug
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-navy">Conversations</h1>
          <p className="text-gray-text mt-2">View all your AI-powered conversations</p>
        </div>
        <button 
          ref={newChatButtonRef}
          onClick={handleNewChat}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      {/* Pure HTML Test Button */}
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-sm font-semibold text-red-800 mb-2">Pure HTML Test:</h3>
        <button 
          onClick={() => {
            console.log('Pure HTML test button clicked');
            window.location.href = '/conversations/new';
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Test Navigation (Pure HTML)
        </button>
        <p className="text-xs text-red-700 mt-2">This button uses pure HTML onclick - no React involved</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-text" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Conversations List */}
      {filteredConversations.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-text mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-navy mb-2">No conversations yet</h3>
          <p className="text-gray-text mb-6">Start your first AI-powered conversation</p>
          <button 
            onClick={handleNewChat}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start Your First Chat
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleConversationClick(conversation.id)}
              className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                  style={{ backgroundColor: conversation.agentColor }}
                >
                  {conversation.agentAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-navy truncate">{conversation.title}</h3>
                    <span className="text-sm text-gray-text">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-text mb-2">{conversation.preview}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-text">
                    <span>{conversation.clientName}</span>
                    <span>→</span>
                    <span>{conversation.projectName}</span>
                    <span>→</span>
                    <span>{conversation.agent}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
