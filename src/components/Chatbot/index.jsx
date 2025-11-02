import React, { useState, useRef, useEffect } from 'react';
import baseApi from "../../api/baseApi";
import './style.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: 'Chào bạn! Tôi là trợ lý ảo của shop. Tôi có thể giúp gì cho bạn?',
      isUser: false,
      timestamp: new Date(),
      quickReplies: ["Xem sản phẩm mới", "Tư vấn size", "Chính sách đổi trả"]
    }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage = { text: textToSend, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setMessages(prev => prev.map(msg => ({ ...msg, quickReplies: [] })));

    try {
      const response = await baseApi.post('/Chatbot/process', {
        text: textToSend,
      });

      const botResponse = response;

      const botMessage = {
        text: botResponse.response,
        isUser: false,
        timestamp: new Date(),
        quickReplies: botResponse.quickReplies || []
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Lỗi khi gọi chatbot API:', error);
      const errorMessage = {
        text: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuickReplyClick = (replyText) => {
    handleSendMessage(replyText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(input);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button 
          className="chatbot-toggle-btn" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Mở chatbot"
          aria-expanded={isOpen}
        >
          <i className="fas fa-comment-dots"></i>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Trợ lý BP Fashion</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Đóng chatbot">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}>
                <div className="message-content">
                  {!msg.isUser && <div className="bot-avatar">AI</div>}
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="quick-replies-container">
                    {msg.quickReplies.map((reply, i) => (
                      <button key={i} className="quick-reply-btn" onClick={() => handleQuickReplyClick(reply)}>
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="bot-avatar">AI</div>
                  <div className="message-bubble">
                    <div className="typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSendMessage(input)} 
              disabled={isLoading || !input.trim()}
              aria-label="Gửi tin nhắn"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;