import React, { useContext, useState, useEffect } from "react";
import { buscarUser, listarConversas } from "../services/api";
import { createContext } from "use-context-selector";
import { useNavigate } from "react-router-dom";

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

export const useAppContext = () => useContext(AppContext);

export const AppProvider = (props) => {
  const { children, userId } = props;
  const [profile, setProfile] = useState({
    id: "",
    nome: "",
    email: "",
    url_foto: "",
    data_criacao: "",
  });
  const [conversas, setConversas] = useState([]);
  const [conversa, setConversa] = useState({
    id: "",
    usuario_id: "",
    mensagem_id: "",
    titulo_conversa: "",
    tipo_conversa: "",
    data_log: "",
  });
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
          setProfile(userData);
          setSigned(true);
          const conversaData = await listarConversas(userId);
          setConversas(conversaData);
        } else {
          console.log("não tem usuario");
        }
      } catch (error) {
        console.error("Erro ao inicializar o usuário:", error);
      } finally {
        setLoading(false); // Finalizando o carregamento
      }
    };
    initializeUser();
  }, [userId, navigate]);

  const updateConversa = (newConversa) => {
    setConversa(newConversa);
  };

  if (loading) {
    return <div>Carregando...</div>; // Exibe um carregamento enquanto os dados estão sendo recuperados
  }

  return (
    <AppContext.Provider
      value={{
        signed,
        profile,
        conversas,
        conversa,
        updateConversa,
        logs,
        bot,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
