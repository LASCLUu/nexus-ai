import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import Chat from "../../components/Chat/Chat";
import "./main.css";
import { useEffect, useState } from "react";
import * as api from "../../services/api";
import { useContextSelector } from "use-context-selector";
import { AppContext } from "../../contexts/AppContext";
import { useContext } from "react";

const PaginaPrincipal = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Olá! Como Nexus pode te ajudar hoje?",
      sender: "bot",
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
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

  const deleteRow = async (id) => {
    try {
      setSelectedConversa(null);

      await api.deletarConversa(id);

      api.criarLog(
        profile.id,
        "Deletado conversa",
        `Deletado a conversa com o ID: ${id}`
      );
      await carregarConversas();
      setMessages([
        {
          text: "Olá! Como Nexus pode te ajudar hoje?",
          sender: "bot",
          time: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (err) {
      console.error("Erro ao deletar conversa:", err);
    }
  };

  const handleSendMessage = async () => {
    const newInputMessage = inputMessage;
    setInputMessage("");

    if (!selectedConversa) {
      try {
        const novaConversa = await createConversa(); // Cria a conversa

        setConversa(novaConversa); // Atualiza o estado da conversa
        setSelectedConversa(novaConversa.id); // Marca a conversa como selecionada

        if (newInputMessage.trim()) {
          // Agora que a conversa foi criada, cria a mensagem do usuário
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: newInputMessage,
              sender: "user",
              time: new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);

          // Criação da mensagem no banco de dados
          const mensagem = await api.criarMensagens(
            newInputMessage,
            profile.id,
            novaConversa.id
          ); // Enviado pelo usuário
          api.criarLog(
            profile.id,
            "Enviou messagem ao BD",
            `Nova mensagem foi enviada para o BD ID: ${mensagem.id}`
          );

          // Envia a mensagem para o bot e atualiza a interface
          const response = await api.messageGemini(newInputMessage);
          api.criarLog(
            profile.id,
            "Enviou messagem ao Gemini",
            `Nova mensagem foi enviada para o Gemini ID: ${response.id}`
          );

          const respostaBruta = response.completion;
          const respostaLimpa = respostaBruta
            .replace(/\*\*/g, "")
            .replace(/\*/g, "");

          if (response.error) {
            // Se houver erro na resposta do bot, cria uma mensagem de erro
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: response.error,
                sender: "bot",
                time: new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);
            // Cria a mensagem de erro no banco de dados
            const erro = await api.criarMensagens(
              response.error,
              1,
              novaConversa.id
            ); // Enviado pelo Nexus (bot)

            api.criarLog(
              profile.id,
              "Erro Gemini",
              `Erro ao se comunicar com Gemini ID: ${erro.id}`
            );
          } else {
            // Se a resposta do bot for bem-sucedida, exibe a resposta na interface
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: respostaLimpa,
                sender: "bot",
                time: new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);
            // Cria a mensagem do bot no banco de dados
            const mensagem = await api.criarMensagens(
              respostaLimpa,
              1,
              novaConversa.id
            ); // Enviado pelo Nexus (bot)
            api.criarLog(
              profile.id,
              "Mensagem Gemini",
              `Mensagem Recebida do Gemini ID: ${mensagem.id}`
            );
          }
        }
      } catch (error) {
        console.error("Erro ao criar a conversa:", error);
      }
    } else {
      if (newInputMessage.trim()) {
        try {
          // Criação da mensagem do usuário
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: newInputMessage,
              sender: "user",
              time: new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }, // Correção: "usuario" ao invés de "user"
          ]);

          // Criação da mensagem no banco de dados
          await api.criarMensagens(newInputMessage, profile.id, conversa.id); // Enviado pelo usuário

          // Envia a mensagem para o bot e atualiza a interface
          const response = await api.messageGemini(newInputMessage);
          const respostaBruta = response.completion;
          const respostaLimpa = respostaBruta
            .replace(/\*\*/g, "")
            .replace(/\*/g, "");

          if (response.error) {
            // Se houver erro na resposta do bot, cria uma mensagem de erro
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: response.error,
                sender: "bot",
                time: new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);
            // Cria a mensagem de erro no banco de dados
            const erro = await api.criarMensagens(
              response.error,
              1,
              conversa.id
            ); // Enviado pelo Nexus (bot)
            api.criarLog(
              profile.id,
              "Erro Gemini",
              `Erro ao se comunicar com Gemini ID: ${erro.id}`
            );
          } else {
            // Se a resposta do bot for bem-sucedida, exibe a resposta na interface
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: respostaLimpa,
                sender: "bot",
                time: new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);
            // Cria a mensagem do bot no banco de dados
            const mensagem = await api.criarMensagens(
              respostaLimpa,
              1,
              conversa.id
            ); // Enviado pelo Nexus (bot)

            api.criarLog(
              profile.id,
              "Mensagem Gemini",
              `Mensagem Recebida do Gemini ID: ${mensagem.id}`
            );
          }
        } catch (error) {
          console.error("Erro ao enviar consulta:", error);
        }
      }
    }
  };

  const createConversa = async () => {
    try {
      const text = "Olá! Como Nexus pode te ajudar hoje?";
      const enviado_por = 1;
      const usuario_id = profile.id;

      // Criação da conversa
      const conversaCriada = await api.criarConversa(usuario_id);

      api.criarLog(
        profile.id,
        "Cria conversa BD",
        `Nova conversa criada com o ID: ${conversaCriada.id} dentro do banco de dados `
      );

      // Criação da mensagem associada à conversa
      const mensagemCriada = await api.criarMensagens(
        text,
        enviado_por,
        conversaCriada.id // conversa_id
      );

      const mensagem_id = mensagemCriada.id;

      setSelectedConversa(conversaCriada.id);

      setMessages([
        {
          text,
          sender: "bot",
          time: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setConversa({
        id: conversaCriada.id,
        usuario_id: conversaCriada.usuario_id,
        mensagem_id, // ID da mensagem inicial
        titulo_conversa: conversaCriada.titulo_conversa || "",
        tipo_conversa: conversaCriada.tipo_conversa || "",
        data_log: conversaCriada.data_log,
      });
      await carregarConversas();
      return conversaCriada;
    } catch (err) {
      console.error("Erro ao criar a conversa: ", err);
    }
  };

  const selectedRow = async (conversa) => {
    try {
      setSelectedConversa(conversa.id);

      api.criarLog(
        profile.id,
        "Selecionando conversa",
        `Conversa selecionada: ${conversa.id}`
      );
      setConversa({
        id: conversa.id,
        usuario_id: conversa.usuario_id,
        mensagem_id: conversa.mensagem_id,
        titulo_conversa: conversa.titulo_conversa || "",
        tipo_conversa: conversa.tipo_conversa || "",
        data_log: conversa.data_log,
      });

      // Busca as mensagens da conversa selecionada
      const mensagens = await api.buscarMensagens(conversa.id);

      api.criarLog(
        profile.id,
        "Buscando mensagens",
        `Mensagens carregadas do Id: ${mensagens.id}`
      );

      setMensagens(mensagens);

      const formattedMessages = mensagens.map((msg) => ({
        text: msg.mensagem,
        sender: msg.enviado_por === 1 ? "bot" : "user",
        time: new Date(msg.data_envio).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Erro ao selecionar a conversa:", error);
    }
  };

  useEffect(() => {
    if (selectedConversa) {
      api.carregarConversaAPI(selectedConversa, messages);
      console.log(selectedConversa, messages);
    }
  }, [messages]);

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
          deleteRow={deleteRow}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
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
