import axios from "axios";

const url = "http://localhost:3000/";

const ENDPOINTS = {
  gemini: "/api/consultar-gemini",
  buscarUser: "/usuario/:id",
  atualizarConversa: ""
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
