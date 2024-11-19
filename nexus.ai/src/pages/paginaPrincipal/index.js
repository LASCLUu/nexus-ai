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
  buscarMensagens,
} from "../../services/api";
import { useContextSelector } from "use-context-selector";
import { AppContext } from "../../contexts/AppContext";
import { useContext } from "react";

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

  const { setConversa, setMensagens, carregarConversas } = useContextSelector(
    AppContext,
    (context) => context
  );

  const handleSendMessage = async () => {
    if (!selectedConversa) {
      try {
        const novaConversa = await createConversa(); // Cria a conversa
        setConversa(novaConversa); // Atualiza o estado da conversa
        setSelectedConversa(novaConversa.id); // Marca a conversa como selecionada

        if (inputMessage.trim()) {
          // Agora que a conversa foi criada, cria a mensagem do usuário
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: inputMessage, sender: "user" },
          ]);
          setInputMessage(""); // Limpa o campo de entrada

          // Criação da mensagem no banco de dados
          await criarMensagens(inputMessage, profile.id, novaConversa.id); // Enviado pelo usuário

          // Envia a mensagem para o bot e atualiza a interface
          const response = await messageGemini(inputMessage);
          const respostaLimpa = response.completion.replace(
            /\*\*(.*?)\*\*/g,
            "$1"
          ); // Remove o negrito (**) das palavras

          if (response.error) {
            // Se houver erro na resposta do bot, cria uma mensagem de erro
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: response.error, sender: "bot" },
            ]);
            // Cria a mensagem de erro no banco de dados
            await criarMensagens(response.error, 1, novaConversa.id); // Enviado pelo Nexus (bot)
          } else {
            // Se a resposta do bot for bem-sucedida, exibe a resposta na interface
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: respostaLimpa, sender: "bot" },
            ]);
            // Cria a mensagem do bot no banco de dados
            await criarMensagens(response.completion, 1, novaConversa.id); // Enviado pelo Nexus (bot)
          }
        }
      } catch (error) {
        console.error("Erro ao criar a conversa:", error);
      }
    } else {
      if (inputMessage.trim()) {
        try {
          // Criação da mensagem do usuário
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: inputMessage, sender: "user" }, // Correção: "usuario" ao invés de "user"
          ]);
          setInputMessage(""); // Limpa o campo de entrada

          // Criação da mensagem no banco de dados
          await criarMensagens(inputMessage, profile.id, conversa.id); // Enviado pelo usuário

          // Envia a mensagem para o bot e atualiza a interface
          const response = await messageGemini(inputMessage);
          const respostaLimpa = response.completion.replace(
            /\*\*(.*?)\*\*/g,
            "$1"
          ); // Remove o negrito (**) das palavras

          if (response.error) {
            // Se houver erro na resposta do bot, cria uma mensagem de erro
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: response.error, sender: "bot" },
            ]);
            // Cria a mensagem de erro no banco de dados
            await criarMensagens(response.error, 1, conversa.id); // Enviado pelo Nexus (bot)
          } else {
            // Se a resposta do bot for bem-sucedida, exibe a resposta na interface
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: respostaLimpa, sender: "bot" },
            ]);
            // Cria a mensagem do bot no banco de dados
            await criarMensagens(response.completion, 1, conversa.id); // Enviado pelo Nexus (bot)
          }
        } catch (error) {
          console.error("Erro ao enviar consulta:", error);
        }
      }
    }
  };

  const createConversa = async () => {
    try {
      // Limpa as mensagens anteriores antes de criar a nova conversa
      setMessages([
        { text: "Olá! Como Nexus pode te ajudar hoje?", sender: "bot" },
      ]);

      const text = "Olá! Como Nexus pode te ajudar hoje?";
      const enviado_por = 1; // ID do Nexus
      const usuario_id = profile.id; // ID do usuário atual

      // Criação da conversa
      const conversaCriada = await criarConversa(usuario_id);

      await carregarConversas();

      // Criação da mensagem associada à conversa
      const mensagemCriada = await criarMensagens(
        text,
        enviado_por,
        conversaCriada.id // conversa_id
      );

      const mensagem_id = mensagemCriada.id; // ID da mensagem criada

      setSelectedConversa(conversaCriada.id);
      // Atualização do estado da conversa
      setConversa({
        id: conversaCriada.id,
        usuario_id: conversaCriada.usuario_id,
        mensagem_id, // ID da mensagem inicial
        titulo_conversa: conversaCriada.titulo_conversa || "",
        tipo_conversa: conversaCriada.tipo_conversa || "",
        data_log: conversaCriada.data_log,
      });

      return conversaCriada;
    } catch (err) {
      console.error("Erro ao criar a conversa: ", err);
    }
  };

  const selectedRow = async (conversa) => {
    try {
      setSelectedConversa(conversa.id);
      setConversa({
        id: conversa.id,
        usuario_id: conversa.usuario_id,
        mensagem_id: conversa.mensagem_id,
        titulo_conversa: conversa.titulo_conversa || "",
        tipo_conversa: conversa.tipo_conversa || "",
        data_log: conversa.data_log,
      });

      // Busca as mensagens da conversa selecionada
      const mensagens = await buscarMensagens(conversa.id);

      setMensagens(mensagens);

      const formattedMessages = mensagens.map((msg) => ({
        text: msg.mensagem,
        sender: msg.enviado_por === 1 ? "bot" : "user",
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Erro ao selecionar a conversa:", error);
    }
  };

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
