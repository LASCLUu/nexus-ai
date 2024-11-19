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
  buscarMensagens: "/mensagens/conversa",
  atualizarConversa: "/conversa/:id",
  criarLog: "/log",
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

// export const tituloGemini = async (message) => {
//   try {
//     console.log("Enviando para Gemini:", message); // Log do prompt enviado
//     const response = await api.get(ENDPOINTS.tituloConversa, {
//       params: {
//         prompt: message,
//       },
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     console.log("Resposta de Gemini:", response.data);
//     return response.data;
//   } catch (err) {
//     console.error("Erro ao interagir com Gemini:", err);
//     throw err;
//   }
// };

export const atualizarConversa = async (id, dados) => {
  try {
    const url = ENDPOINTS.atualizarConversa.replace(":id", id);
    const response = await api.put(url, {
      ...dados, // Passando os dados diretamente, sem o uso de 'params'
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
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

export const criarConversa = async (usuario_id) => {
  try {
    const response = await api.post(
      ENDPOINTS.criarConversa,
      { usuario_id }, // Enviando como objeto
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Erro ao criar a conversa: ", err);
    throw err;
  }
};

export const deletarConversa = async (id) => {
  try {
    const url = ENDPOINTS.deletarConversa.replace(":id", id);
    const response = await api.delete(url, {
      id,
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

export const criarMensagens = async (mensagem, enviado_por, conversa_id) => {
  try {
    const response = await api.post(
      ENDPOINTS.criarMensagem,
      {
        mensagem,
        enviado_por,
        conversa_id,
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

export const buscarMensagens = async (conversa_id) => {
  try {
    const response = await api.get(ENDPOINTS.buscarMensagens, {
      params: { conversa_id }, // Envia o `conversa_id` como query string
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna os dados das mensagens
  } catch (err) {
    console.error("Erro ao buscar mensagens: ", err);
    throw err;
  }
};

export const criarLog = async (usuario_id, tipo_log, descricao) => {
  try {
    const response = await api.post(
      ENDPOINTS.criarLog,
      {
        usuario_id,
        tipo_log,
        descricao,
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
