import React, { useContext, useState, useEffect } from "react";
import { buscarUser } from "../services/api";
import { createContext } from "use-context-selector";
import { useNavigate } from "react-router-dom";

// Contexto para o App
export const AppContext = createContext({
  signed: false,
  profile: {
    id: "",
    nome: "",
    email: "",
    url_foto: "",
    data_criacao: "",
  },
  bot: {
    id: 1,
    nome: "NexusIA",
    url_foto:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdZ9dExjxM5bzlQbdh_gLIt2cWMOzQmil8TA&s",
  },
  conversas: [],
  logs: [],
  conversa: {
    id: "",
    usuario_id: "",
    mensagem_id: "",
    titulo_conversa: "",
    tipo_conversa: "",
    data_log: "",
  },
});

// Hook para uso do AppContext
export const useAppContext = () => useContext(AppContext);

// Provedor do contexto
export const AppProvider = (props) => {
  const { children, userId } = props;
  const [profile, setProfile] = useState({
    id: "",
    nome: "",
    email: "",
    url_foto: "",
    data_criacao: "",
  }); // Inicializando como objeto vazio
  const [conversas, setConversas] = useState([]);
  const [logs, setLogs] = useState([]);
  const [bot, setBot] = useState({
    id: 1,
    nome: "NexusIA",
    url_foto:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdZ9dExjxM5bzlQbdh_gLIt2cWMOzQmil8TA&s",
  });
  const [signed, setSigned] = useState(false); // Inicializando o estado signed
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        if (userId) {
          const userData = await buscarUser(userId);
          setProfile(userData); // Atualizando o profile com as informações do usuário
          setSigned(true); // Marcando como 'signed' após sucesso na recuperação do usuário
        } else {
          // Caso o userId não seja passado, talvez redirecionar ou exibir erro
          navigate("/login"); // Exemplo de redirecionamento para login
        }
      } catch (error) {
        console.error("Erro ao inicializar o usuário:", error);
      } finally {
        setLoading(false); // Finalizando o carregamento
      }
    };
    initializeUser();
  }, [userId, navigate]);

  const logConversation = async (pergunta, respostaNexus, tipoConversa) => {
    try {
      setConversas([...conversas, { pergunta, respostaNexus, tipoConversa }]);
    } catch (error) {
      console.error("Erro ao registrar conversa:", error);
    }
  };

  const logSystem = async (tipoLog, descricao) => {
    try {
      setLogs([...logs, { tipoLog, descricao }]);
    } catch (error) {
      console.error("Erro ao registrar log do sistema:", error);
    }
  };

  // Verificando se o carregamento foi concluído e se o usuário está autenticado
  if (loading) {
    return <div>Carregando...</div>; // Exibe um carregamento enquanto os dados estão sendo recuperados
  }

  return (
    <AppContext.Provider
      value={{
        signed,
        profile,
        conversas,
        logs,
        logConversation,
        logSystem,
        bot,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
