import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const isEmpty = !activeConversation || messages.length === 0;

  const handleSidebarToggle = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(true);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
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
        collapsed={sidebarCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Chat top bar */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] z-20 flex-shrink-0">
          {/* Sidebar toggle */}
          <button
            onClick={handleSidebarToggle}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* HERMA wordmark — navigates to home */}
          <button
            onClick={() => navigate('/')}
            className="herma-wordmark text-base text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            HERMA
          </button>

          <div className="flex-1" />

          {/* New Chat button */}
          <button
            onClick={createConversation}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
            aria-label="New chat"
            title="New chat"
          >
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {isEmpty ? (
            <EmptyState
              onSend={handleSend}
              isStreaming={isStreaming}
              onStop={stopGeneration}
            />
          ) : (
            <>
              <div
                className="flex-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-[var(--bg-hover)] hover:scrollbar-thumb-[var(--bg-active)] pb-32"
                ref={containerRef}
                onScroll={handleScroll}
              >
                <div className="max-w-4xl mx-auto w-full">
                  <ChatMessages
                    messages={messages}
                    isStreaming={isStreaming}
                    onRegenerate={regenerateLastResponse}
                  />
                  <div className="h-4 w-full" />
                </div>
              </div>

              {/* Gradient fade */}
              <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none h-24 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent" />

              {/* Input */}
              <div className="absolute bottom-0 w-full z-20 pointer-events-auto">
                <ChatInput
                  onSend={handleSend}
                  onStop={stopGeneration}
                  isStreaming={isStreaming}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <PaywallModal isOpen={showPaywall} onClose={dismissPaywall} />
    </div>
  );
};

export default ChatPage;
