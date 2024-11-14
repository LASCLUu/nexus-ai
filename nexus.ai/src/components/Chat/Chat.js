import React, { useState, useEffect } from "react";
import "./chat.css";
import { useContextSelector } from "use-context-selector";
import { AppContext } from "../../contexts/AppContext";

const Chat = ({ messageGemini }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Olá! Como Nexus pode te ajudar hoje?", sender: "bot" },
  ]);
  const [loadingBot, setLoadingBot] = useState(false);

  const profile = useContextSelector(AppContext, (context) => context.profile);
  const bot = useContextSelector(AppContext, (context) => context.bot);

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      try {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: inputMessage, sender: "user" },
        ]);
        setInputMessage("");

        const response = await messageGemini(inputMessage);
        if (response.error) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: response.error, sender: "bot" },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: response.completion, sender: "bot" },
          ]);
        }
      } catch (error) {
        console.error("Erro ao enviar consulta:", error);
      }
    }
  };

  useEffect(() => {
    // await gravarMensagens()
  }, [messages]);

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
                        ? profile.url_foto // Foto do usuário
                        : bot.url_foto // Foto do bot
                    }
                    alt={message.sender === "user" ? profile.nome : bot.nome}
                  />
                </span>
                <div className="chat-body clearfix">
                  <div className="header">
                    <strong className="primary-font">
                      {message.sender === "user" ? profile.nome : bot.nome}
                    </strong>
                    <small
                      className={`pull-${
                        message.sender === "user" ? "right" : "left"
                      } text-muted`}
                    >
                      <i className="fa fa-clock-o"></i>{" "}
                      {new Date().toLocaleTimeString()}
                    </small>
                  </div>
                  <p>{message.text}</p>
                </div>
              </li>
            ))}

          {loadingBot && <div className="message bot">Carregando...</div>}
        </ul>
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
