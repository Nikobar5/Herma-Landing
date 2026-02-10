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
    } catch {}
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
    <div className="flex h-screen pt-16 bg-white">
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

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-2 border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span
            className="text-sm font-medium text-[var(--primary-bg)] truncate"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {activeConversation?.title || 'New chat'}
          </span>
        </div>

        {isEmpty ? (
          <EmptyState onPromptClick={handlePromptClick} />
        ) : (
          <ChatMessages
            messages={messages}
            isStreaming={isStreaming}
            onRegenerate={regenerateLastResponse}
            containerRef={containerRef}
            isAtBottom={isAtBottom}
            scrollToBottom={scrollToBottom}
            handleScroll={handleScroll}
          />
        )}

        <ChatInput
          onSend={handleSend}
          onStop={stopGeneration}
          isStreaming={isStreaming}
        />
      </div>

      <PaywallModal isOpen={showPaywall} onClose={dismissPaywall} />
    </div>
  );
};

export default ChatPage;
