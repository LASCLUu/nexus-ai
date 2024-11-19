import axios from "axios";

const url = "http://localhost:3000/";

const ENDPOINTS = {
  gemini: "/api/consultar-gemini",
  buscarUser: "/usuario/:id",
  tituloConversa: "/api/titulo-gemini",
  atualizar: "/conversa/:id",
  criarConversa: "/conversa",
  criarMensagem: "/mensagens",
  deletarConversa: "/conversa/:id",
  listarConversas: "/conversas/:usuario_id",
};

export const api = axios.create({
  baseURL: url,
});

export const messageGemini = async (message) => {
  try {
    const response = await api.get(ENDPOINTS.gemini, {
      params: {
        prompt: message,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.log("Erro ao enviar mensagem para Gemini: ", err);
    throw err;
  }
};

export const tituloGemini = async (message) => {
  try {
    const response = await api.get(ENDPOINTS.tituloConversa, {
      params: {
        prompt: message,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.log("Erro o titulo para Gemini: ", err);
  }
};

export const atualizarConversa = async (id, dados) => {
  try {
    const url = ENDPOINTS.atualizarConversa.replace(":id", id);
    const response = await api.put(url, {
      params: { dados },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna os dados da resposta, se necessário
  } catch (err) {
    console.error("Erro ao atualizar a conversa: ", err);
    throw err; // Lança o erro para ser tratado em outro lugar, se necessário
  }
};

export const buscarUser = async (id) => {
  try {
    const url = ENDPOINTS.buscarUser.replace(":id", id);
    const response = await api.get(url, {
      params: { id },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.log("Erro ao buscar usuário: ", err);
    throw err;
  }
};

export const criarConversa = async (dados) => {
  try {
    const response = await api.post(ENDPOINTS.criarConversa, dados, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Erro ao criar a conversa: ", err);
    throw err;
  }
};

export const deletarConversa = async (id) => {
  try {
    const url = ENDPOINTS.deletarConversa.replace(":id", id);
    const response = await api.get(url, {
      params: { id },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.log("Erro ao deletar conversa: ", err);
    throw err;
  }
};

export const listarConversas = async (usuario_id) => {
  try {
    const url = ENDPOINTS.listarConversas.replace(":usuario_id", usuario_id);
    const response = await api.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // Retorna os dados das conversas
  } catch (err) {
    console.log("Erro ao listar conversas: ", err);
    throw err;
  }
};

export const criarMensagens = async (mensagem, enviado_por) => {
  try {
    const response = await api.post(
      ENDPOINTS.criarMensagem,
      {
        mensagem,
        enviado_por,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Retorna os dados da nova mensagem
  } catch (err) {
    console.error("Erro ao criar a mensagem: ", err);
    throw err;
  }
};
