import axios from "axios";

const url = "http://localhost:3000/";

const ENDPOINTS = {
  gemini: "/api/pergunte-ao-gemini",
};

export const api = axios.create({
  baseURL: url,
});

export const messageGemini = async (message) => {
  try {
    const response = await api.post(
      ENDPOINTS.gemini,
      { prompt: message },
      {
        // Enviando como objeto
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (err) {
    console.log("Erro ao enviar mensagem para Gemini: ", err);
  }
};
