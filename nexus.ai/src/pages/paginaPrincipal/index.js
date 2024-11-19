import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import Chat from "../../components/Chat/Chat";
import "./main.css";
import { useEffect, useState } from "react";
import {
  messageGemini,
  tituloGemini,
  atualizarConversa,
  criarMensagens,
  criarConversa,
} from "../../services/api";
import { useContextSelector } from "use-context-selector";
import { AppContext, useAppContext } from "../../contexts/AppContext";

const PaginaPrincipal = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Olá! Como Nexus pode te ajudar hoje?", sender: "bot" },
  ]);
  const [selectedConversa, setSelectedConversa] = useState(null);

  const profile = useContextSelector(AppContext, (context) => context.profile);

  const conversa = useContextSelector(
    AppContext,
    (context) => context.conversa
  );

  const { updateConversa } = useAppContext();

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      try {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: inputMessage, sender: "user" },
        ]);
        setInputMessage("");

        if (conversa.titulo_conversa === "") {
          const titulo = await tituloGemini(inputMessage);

          if (titulo === "Não") {
            console.log("A IA determinou que não é possível gerar um título.");
          } else {
            const dados = { titulo_conversa: titulo };
            await atualizarConversa(conversa.id, dados);
            console.log("Conversa atualizada com sucesso.");
          }
        } else {
          console.log("Conversa já possui um título. Nenhuma ação necessária.");
        }

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

  const createConversa = async () => {
    try {
      const text = "Olá! Como Nexus pode te ajudar hoje?";
      const enviado_por = 1;
      setMessages({
        text,
        sender: enviado_por,
      });

      const usuario_id = profile.id;

      const mensagemCriada = await criarMensagens(text, enviado_por);
      const mensagem_id = mensagemCriada.id;

      const dados = { usuario_id, mensagem_id };
      const conversaCriada = await criarConversa(dados);

      updateConversa({
        id: conversaCriada.id,
        usuario_id: conversaCriada.usuario_id,
        mensagem_id: conversaCriada.mensagem_id,
        titulo_conversa: conversaCriada.titulo_conversa || "",
        tipo_conversa: conversaCriada.tipo_conversa || "",
        data_log: conversaCriada.data_log,
      });

      return conversaCriada;
    } catch (err) {
      console.error("Erro ao criar a conversa: ", err);
    }
  };

  const selectedRow = (conversa) => {
    setSelectedConversa(conversa.id);
    updateConversa({
      id: conversa.id,
      usuario_id: conversa.usuario_id,
      mensagem_id: conversa.mensagem_id,
      titulo_conversa: conversa.titulo_conversa || "Nova Conversa",
      tipo_conversa: conversa.tipo_conversa || "Suporte",
      data_log: conversa.data_log,
    });

    console.log(`Conversa ${conversa.titulo_conversa} selecionada.`);
  };

  useEffect(() => {}, [messages]);

  return (
    <div className="page-container">
      <Header
        toggleSidebar={() => setShowSidebar(!showSidebar)}
        showSidebar={showSidebar}
      />
      <div className="main-content">
        <Sidebar
          handleCreateConversa={createConversa}
          selectedRow={selectedRow}
          selectedConversa={selectedConversa}
        />
        <div className="chat-container">
          <Chat
            inputMessage={inputMessage} // Passa o estado atual
            setInputMessage={setInputMessage}
            messages={messages}
            handleSendMessage={handleSendMessage}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaginaPrincipal;
