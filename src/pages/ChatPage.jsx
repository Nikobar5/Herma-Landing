import React, { useState, useEffect, useCallback } from 'react';
import { useConversations } from '../hooks/useConversations';
import { useChat } from '../hooks/useChat';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { getChatBalance } from '../services/hermaApi';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import EmptyState from '../components/chat/EmptyState';
import PaywallModal from '../components/chat/PaywallModal';

const ChatPage = () => {
  const {
    conversations,
    activeConversation,
    activeId,
    setActiveId,
    createConversation,
    deleteConversation,
    renameConversation,
    addMessage,
    updateLastMessage,
    removeLastMessage,
  } = useConversations();

  const { isStreaming, sendMessage, stopGeneration, regenerateLastResponse, showPaywall, dismissPaywall } = useChat({
    activeId,
    addMessage,
    updateLastMessage,
    removeLastMessage,
    activeConversation,
    createConversation,
  });

  const messages = activeConversation?.messages || [];
  const { containerRef, isAtBottom, scrollToBottom, handleScroll } = useAutoScroll([
    messages.length,
    messages[messages.length - 1]?.content,
  ]);

  const [balance, setBalance] = useState(null);
  const [chatFreeCredit, setChatFreeCredit] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchBalance = useCallback(async () => {
    try {
      const data = await getChatBalance();
      setBalance(data.balance_usd ?? null);
      setChatFreeCredit(data.chat_free_credit_usd ?? null);
      setSubscription(data.has_subscription ? { plan: data.plan } : null);
    } catch { }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Refresh balance after each completed response
  useEffect(() => {
    if (!isStreaming) {
      fetchBalance();
    }
  }, [isStreaming, fetchBalance]);

  const handleSend = useCallback(
    (content) => {
      sendMessage(content);
    },
    [sendMessage]
  );

  const handlePromptClick = useCallback(
    (text) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const isEmpty = !activeConversation || messages.length === 0;

  return (
    <div className="flex h-screen pt-28 bg-[var(--bg-primary)] overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={createConversation}
        onRename={renameConversation}
        onDelete={deleteConversation}
        balance={balance}
        chatFreeCredit={chatFreeCredit}
        subscription={subscription}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-sm z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span
            className="text-base font-bold text-[var(--text-primary)] truncate"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {activeConversation?.title || 'New chat'}
          </span>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {isEmpty ? (
            <div className="flex-1 overflow-y-auto w-full pb-32">
              <EmptyState onPromptClick={handlePromptClick} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-[var(--bg-hover)] hover:scrollbar-thumb-[var(--bg-active)] pb-32" ref={containerRef} onScroll={handleScroll}>
              <div className="max-w-4xl mx-auto w-full">
                <ChatMessages
                  messages={messages}
                  isStreaming={isStreaming}
                  onRegenerate={regenerateLastResponse}
                />
                <div className="h-4 w-full" /> {/* Spacer */}
              </div>
            </div>
          )}

          {/* Faded bottom area for input - adapted for dark mode */}
          <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none h-24 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent"></div>

          <div className="absolute bottom-0 w-full z-20 pointer-events-auto">
            <ChatInput
              onSend={handleSend}
              onStop={stopGeneration}
              isStreaming={isStreaming}
              hasMessages={!isEmpty}
            />
          </div>
        </div>
      </div>

      <PaywallModal isOpen={showPaywall} onClose={dismissPaywall} />
    </div>
  );
};

export default ChatPage;
