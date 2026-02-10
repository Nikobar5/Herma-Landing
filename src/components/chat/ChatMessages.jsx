import React from 'react';
import ChatMessage from './ChatMessage';
import ScrollToBottom from './ScrollToBottom';

const ChatMessages = ({ messages, isStreaming, onRegenerate, containerRef, isAtBottom, scrollToBottom, handleScroll }) => {
  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto"
      >
        <div className="max-w-3xl mx-auto">
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              message={msg}
              isLast={i === messages.length - 1}
              isStreaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
              onRegenerate={
                i === messages.length - 1 && msg.role === 'assistant' && !isStreaming
                  ? onRegenerate
                  : undefined
              }
            />
          ))}
        </div>
      </div>
      {!isAtBottom && (
        <ScrollToBottom onClick={scrollToBottom} />
      )}
    </div>
  );
};

export default ChatMessages;
