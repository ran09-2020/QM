import React from 'react';
import MessageBubble from './MessageBubble';

function MessageList({ 
  messages, 
  isLoading, 
  isSimulationMode, 
  lastModelMessageRef, 
  messagesEndRef, 
  startPractice, 
  setMessages, 
  handleSend, 
  handlePracticeButtonClick 
}) {
  return (
    <div className="chat-messages" style={isSimulationMode ? { paddingTop: '1rem' } : {}}>
      {messages.map((msg, idx) => {
        const isLast = idx === messages.length - 1;
        return (
          <MessageBubble 
            key={idx}
            msg={msg}
            idx={idx}
            isLast={isLast}
            lastModelMessageRef={lastModelMessageRef}
            startPractice={startPractice}
            setMessages={setMessages}
            handleSend={handleSend}
            handlePracticeButtonClick={handlePracticeButtonClick}
          />
        );
      })}
      
      {isLoading && (
        <div className="message-wrapper model">
          <div className="message-bubble" style={{padding: '1rem', minHeight: '44px', display: 'flex', alignItems: 'center'}}>
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default React.memo(MessageList);
