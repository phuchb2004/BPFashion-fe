import React, { useState, useRef, useEffect } from 'react';
import baseApi from "../../api/baseApi";
// Sử dụng icon Ant Design để đồng bộ với dự án
import { MessageOutlined, CloseOutlined, SendOutlined, RobotOutlined } from '@ant-design/icons';
import './style.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: 'Chào bạn! Tôi là trợ lý ảo của BPFashion. Tôi có thể giúp gì cho bạn?',
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
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend || !textToSend.trim() || isLoading) return;

    // 1. Thêm tin nhắn của User
    const userMessage = { text: textToSend, isUser: true, timestamp: new Date() };
    setMessages(prev => {
      // Xóa quick replies của tin nhắn cũ để giao diện sạch hơn
      const cleanedMessages = prev.map(msg => ({ ...msg, quickReplies: [] }));
      return [...cleanedMessages, userMessage];
    });
    
    setInput('');
    setIsLoading(true);

    try {
      // 2. Gọi API
      const response = await baseApi.post('/Chatbot/process', {
        text: textToSend,
      });

      // Kiểm tra dữ liệu trả về (response có thể là data trực tiếp hoặc response.data tùy axios config)
      const botResponse = response.data || response;

      // 3. Thêm tin nhắn của Bot
      const botMessage = {
        text: botResponse.response || "Xin lỗi, tôi không nhận được phản hồi.",
        isUser: false,
        timestamp: new Date(),
        quickReplies: botResponse.quickReplies || []
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Lỗi chatbot:', error);
      const errorMessage = {
        text: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.',
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
    return new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      {/* Nút mở Chatbot */}
      {!isOpen && (
        <button 
          className="chatbot-toggle-btn" 
          onClick={() => setIsOpen(true)}
          aria-label="Mở chatbot"
        >
          <MessageOutlined style={{ fontSize: '24px' }} />
        </button>
      )}

      {/* Cửa sổ Chatbot */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3><RobotOutlined style={{ marginRight: 8 }} /> Trợ lý BP Fashion</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <CloseOutlined />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}>
                <div className="message-content">
                  {!msg.isUser && <div className="bot-avatar"><RobotOutlined /></div>}
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
                
                {/* Quick Replies */}
                {!msg.isUser && msg.quickReplies && msg.quickReplies.length > 0 && (
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
                  <div className="bot-avatar"><RobotOutlined /></div>
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
            >
              <SendOutlined />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;