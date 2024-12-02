import React, { useState, useEffect } from "react";
import "./chat.css";
import { useContextSelector } from "use-context-selector";
import { AppContext } from "../../contexts/AppContext";

const Chat = ({
  messages,
  handleSendMessage,
  inputMessage,
  setInputMessage,
}) => {
  const bot = useContextSelector(AppContext, (context) => context.bot);
  const profile = useContextSelector(AppContext, (context) => context.profile);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputMessage.trim() !== "") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container chat-box">
      <div className="chat-header">
        <h2>{bot.nome}</h2>
      </div>
      <div className="chat-box ">
        <ul className="chat">
          {Array.isArray(messages) &&
            messages.map((message, index) => (
              <li
                key={index}
                className={`${
                  message.sender === "user" ? "right" : "left"
                } clearfix`}
              >
                <span
                  className={`chat-img pull-${
                    message.sender === "user" ? "right" : "left"
                  }`}
                >
                  <img
                    src={
                      message.sender === "user"
                        ? profile.url_foto
                        : bot.url_foto
                    }
                    alt={message.sender === "user" ? profile.nome : bot.nome}
                  />
                </span>
                <div className="chat-body clearfix">
                  <div className="header">
                    <strong className="primary-font">
                      {message.sender === "user" ? profile.nome : bot.nome}
                    </strong>
                    <small className={`pull-right text-muted`}>
                      <i className="fa fa-clock-o"></i>{" "}
                      {new Date().toLocaleTimeString()}
                    </small>
                  </div>
                  <p>{message.text}</p>
                </div>
              </li>
            ))}
        </ul>
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default Chat;
