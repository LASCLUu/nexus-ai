import React, { useState } from "react";
import "./chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Olá! Como posso ajudar?", sender: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([
        ...messages,
        { text: inputMessage, sender: "user" },
        { text: "Estou processando sua mensagem...", sender: "bot" },
      ]);
      setInputMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Nexus IA</h2>
      </div>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === "user" ? "user" : "bot"}`}
          >
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default Chat;
