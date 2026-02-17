import React from 'react';
import ChatMessage from './ChatMessage';

const ChatMessages = ({ messages, isStreaming, onRegenerate }) => {
  return (
    <>
      {messages.map((msg, i) => (
        <ChatMessage
          key={msg.id || `msg-${i}`}
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
    </>
  );
};

export default ChatMessages;
