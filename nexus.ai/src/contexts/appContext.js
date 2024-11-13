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
  conversas: [],
  logs: [],
  conversa: {
    id: "",
  },
});

// Hook para uso do AppContext
export const useAppContext = () => useContext(AppContext);

// Provedor do contexto
export const AppProvider = (props) => {
  const { children, userId } = props;
  const [profile, setProfile] = useState(null); // Inicializando como null
  const [conversas, setConversas] = useState([]);
  const [logs, setLogs] = useState([]);
  const [signed, setSigned] = useState(false); // Inicializando o estado signed
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userData = await buscarUser(userId);
        console.log("Está logado");
        setProfile(userData); // Atualizando o profile com as informações do usuário
        setSigned(true); // Marcando como 'signed' após sucesso na recuperação do usuário
      } catch (error) {
        console.error("Erro ao inicializar o usuário:", error);
      } finally {
        setLoading(false); // Finalizando o carregamento
      }
    };
    initializeUser();
  }, [userId]);

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
      value={{ signed, profile, conversas, logs, logConversation, logSystem }}
    >
      {children}
    </AppContext.Provider>
  );
};
