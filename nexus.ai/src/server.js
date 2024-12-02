const express = require("express"); //chamada http
const cors = require("cors"); //segurança
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const fs = require("fs");

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
  })
);

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "Você é um assistente educacional especializado em responder perguntas sobre matérias escolares. Seu objetivo é fornecer explicações claras e úteis sobre temas como matemática, ciências, história, geografia, física, química, biologia e outras disciplinas acadêmicas. \n\n" +
    "Se o usuário fizer uma saudação, como 'Oi', 'Tudo bem?', 'Como vai?', responda educadamente com mensagens amigáveis, por exemplo: 'Olá! Tudo bem? Como posso ajudar com suas dúvidas escolares hoje?'.\n" +
    "Se o usuário fizer uma pergunta sobre matérias escolares, forneça uma resposta detalhada e precisa, sempre mantendo um tom educado e informativo.\n" +
    "Se o usuário perguntar algo que não seja sobre matérias escolares ou fizer solicitações fora do escopo, recuse educadamente com mensagens como: 'Desculpe, só consigo ajudar com perguntas relacionadas a matérias escolares. Posso ajudar com algo nesse sentido?'.\n" +
    "Seu comportamento deve ser sempre educado, objetivo e alinhado ao contexto acadêmico.\n\n" +
    "Caso o usuário tente discutir ou solicitar algo fora do contexto acadêmico (como receitas de culinária, dicas de entretenimento, etc.), você deve recusar educadamente, explicando que a ajuda está restrita a matérias escolares. Exemplo: 'Desculpe, não posso ajudar com isso. Posso ajudar com dúvidas sobre matemática, ciências, história, ou outra matéria escolar?'",
  tools: [{ codeExecution: {} }],
});

const generationConfig = {
  temperature: 2,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const dbConfig = {
  user: process.env.REACT_APP_POSTGRESQL_USER,
  password: process.env.REACT_APP_POSTGRESQL_PASSWORD,
  host: process.env.REACT_APP_POSTGRESQL_HOST,
  port: process.env.REACT_APP_POSTGRESQL_PORT,
  database: process.env.REACT_APP_POSTGRESQL_DATABASE,
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.REACT_APP_POSTGRESQL_CA,
  },
};

// Usando Pool de Conexões para gerenciar as conexões com o banco de dados
const pool = new Pool(dbConfig);

let conversations = {};

app.get("/api/consultar-gemini", async (req, res) => {
  try {
    const { prompt, conversaId } = req.query;

    // Verificar se o prompt foi fornecido
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({
        error:
          "O parâmetro 'prompt' é necessário e deve ser uma string não vazia.",
      });
    }

    const conversation = conversations[conversaId] || { history: [] };

    // Cria a sessão de chat com o histórico existente
    const chatSession = model.startChat({
      generationConfig,
      history: conversation.history,
    });
    // Enviar a mensagem e obter o resultado
    const result = await chatSession.sendMessage(prompt);

    // Verificar se há uma resposta válida no resultado
    if (!result || !result.response || !result.response.text) {
      throw new Error("Resposta inválida do modelo.");
    }

    conversations[conversaId] = conversation;

    // Retornar o texto da resposta
    res.json({ completion: result.response.text() });
  } catch (error) {
    // Log detalhado do erro para depuração
    console.error("Erro ao interagir com o modelo:", error.message || error);

    // Responder com erro apropriado
    res.status(500).json({
      error: "Erro ao gerar conteúdo. Tente novamente mais tarde.",
      details: error.message || "Erro desconhecido",
    });
  }
});

app.post("/api/conversa/carregar", (req, res) => {
  try {
    const { conversaId, messages } = req.body; // Receber o ID da conversa e as mensagens do corpo da requisição

    // Se não for fornecido um ID, gera um automaticamente
    const id = conversaId || `conversa-${Date.now()}`;

    // Verificar se a conversa já existe
    if (conversations[id]) {
      // Se a conversa já existir, adicione as novas mensagens ao histórico existente
      conversations[id].history.push(...messages); // Adiciona todas as mensagens recebidas no histórico

      return res.json({
        conversationId: id,
        message: "Conversa atualizada!",
        history: conversations[id].history, // Retorna o histórico atualizado
      });
    }

    // Se a conversa não existir, cria uma nova conversa com o histórico das mensagens recebidas
    conversations[id] = { history: [...messages] }; // Inicia o histórico com as mensagens recebidas

    // Retorna o ID da nova conversa
    res.json({
      conversationId: id,
      message: "Nova conversa criada!",
      history: conversations[id].history,
    });
  } catch (error) {
    console.error("Erro ao carregar ou criar conversa:", error);
    res.status(500).send({ error: "Erro ao carregar ou criar conversa." });
  }
});

app.get("/hello-world", (req, res) => {
  try {
    res.send("Hello World!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/consultar", async (req, res) => {
  const { usuario_id, acao } = req.query; // Captura os parâmetros da URL
  console.log("Parâmetros recebidos:", req.query); // Verifique se os parâmetros estão sendo passados corretamente

  if (!usuario_id || !acao) {
    return res.status(400).json({
      error: "Parâmetros 'usuario_id' e 'acao' são obrigatórios.",
    });
  }

  try {
    const logQuery = `
    INSERT INTO "log_sistema" ("usuario_id", "tipo_log", "descricao")
    VALUES ($1, $2, $3)
    RETURNING * `;

    const logValues = [usuario_id, "consulta", `Consulta realizada: ${acao}`];
    const logResult = await pool.query(logQuery, logValues);

    // Retorna o log registrado
    console.log("Log registrado:", logResult.rows[0]);

    res.status(200).json({
      message: `Consulta realizada com sucesso para o usuário ${usuario_id}`,
      log: logResult.rows[0], // Retorna o log criado
    });
  } catch (error) {
    console.error("Erro ao registrar log:", error);
    res.status(500).json({ error: "Erro ao registrar log" });
  } finally {
    await client.end(); // Fecha a conexão com o banco de dados
  }
});

// CRUD LOGS

// Criar log
app.post("/log", async (req, res) => {
  const { usuario_id, tipo_log, descricao } = req.body;

  if (!usuario_id || !tipo_log || !descricao) {
    return res.status(400).json({
      error:
        "Parâmetros 'usuario_id', 'tipo_log' e 'descricao' são obrigatórios.",
    });
  }

  try {
    const createQuery = `
      INSERT INTO "log_sistema" ("usuario_id", "tipo_log", "descricao")
      VALUES ($1, $2, $3)
      RETURNING *`;

    const createValues = [usuario_id, tipo_log, descricao];
    const createResult = await pool.query(createQuery, createValues);

    res.status(201).json({
      message: "Log criado com sucesso!",
      log: createResult.rows[0], // Retorna o log criado
    });
  } catch (error) {
    console.error("Erro ao criar log:", error);
    res.status(500).json({ error: "Erro ao criar log" });
  }
});

// Listar todos os logs
app.get("/logs", async (req, res) => {
  const { usuario_id } = req.query;

  try {
    let query = 'SELECT * FROM "log_sistema"';
    let values = [];

    if (usuario_id) {
      query += ' WHERE "usuario_id" = $1';
      values = [usuario_id];
    }

    const result = await pool.query(query, values);

    res.status(200).json({
      logs: result.rows, // Retorna os logs encontrados
    });
  } catch (error) {
    console.error("Erro ao consultar logs:", error);
    res.status(500).json({ error: "Erro ao consultar logs" });
  }
});

// Consultar log específico pelo ID
app.get("/log/:id", async (req, res) => {
  const logId = req.params.id;

  try {
    const query = `SELECT * FROM "log_sistema" WHERE "id" = $1`;
    const result = await pool.query(query, [logId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Log não encontrado." });
    }

    res.status(200).json({
      log: result.rows[0], // Retorna o log encontrado
    });
  } catch (error) {
    console.error("Erro ao consultar log:", error);
    res.status(500).json({ error: "Erro ao consultar log" });
  }
});

// Atualizar log específico
app.put("/log/:id", async (req, res) => {
  const logId = req.params.id;
  const { tipo_log, descricao } = req.body;

  if (!tipo_log || !descricao) {
    return res.status(400).json({
      error: "Parâmetros 'tipo_log' e 'descricao' são obrigatórios.",
    });
  }

  try {
    const query = `
      UPDATE "log_sistema"
      SET "tipo_log" = $1, "descricao" = $2
      WHERE "id" = $3
      RETURNING *`;

    const result = await pool.query(query, [tipo_log, descricao, logId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Log não encontrado." });
    }

    res.status(200).json({
      message: `Log com id ${logId} atualizado com sucesso!`,
      log: result.rows[0], // Retorna o log atualizado
    });
  } catch (error) {
    console.error("Erro ao atualizar log:", error);
    res.status(500).json({ error: "Erro ao atualizar log" });
  }
});

// Deletar log específico
app.delete("/log/:id", async (req, res) => {
  const logId = req.params.id;

  try {
    const deleteQuery = `
      DELETE FROM "log_sistema"
      WHERE "id" = $1
      RETURNING *`;

    const deleteResult = await pool.query(deleteQuery, [logId]);

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: "Log não encontrado." });
    }

    res.status(200).json({
      message: `Log com id ${logId} deletado com sucesso!`,
      log: deleteResult.rows[0], // Retorna o log deletado
    });
  } catch (error) {
    console.error("Erro ao deletar log:", error);
    res.status(500).json({ error: "Erro ao deletar log" });
  }
});

// CRUD USUÁRIO

// Criar um novo usuário
app.post("/usuario", async (req, res) => {
  const { nome, email, url_foto } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: "Nome e email são obrigatórios" });
  }

  try {
    const query =
      'INSERT INTO "usuario" (nome, email, url_foto) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [nome, email, url_foto]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// Listar todos os usuários
app.get("/usuarios", async (req, res) => {
  try {
    const query = 'SELECT * FROM "usuario"';
    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao consultar usuários:", error);
    res.status(500).json({ error: "Erro ao consultar usuários" });
  }
});

// Atualizar um usuário
app.put("/usuario/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, url_foto } = req.body;

  if (!nome && !email) {
    return res
      .status(400)
      .json({ error: "Informe pelo menos um campo para atualizar" });
  }

  try {
    const query = `
      UPDATE "usuario" 
      SET nome = COALESCE($1, nome), email = COALESCE($2, email) 
      WHERE id = $3 
      RETURNING *`;
    const result = await pool.query(query, [nome, email, id, url_foto]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

//consultar um usuario
app.get("/usuario/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM "usuario" WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao consultar usuário:", error);
    res.status(500).json({ error: "Erro ao consultar usuário" });
  }
});

// Deletar um usuário
app.delete("/usuario/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM "usuario" WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
});

//CRUD CONVERSA

//criar uma conversa com o usuario
app.post("/conversa", async (req, res) => {
  const { usuario_id } = req.body;

  if (!usuario_id) {
    return res.status(400).json({
      error: "Usuário é obrigatório",
    });
  }

  try {
    // Criação com valores padrão explícitos (opcional)
    const titulo_conversa = ""; // Valor padrão
    const tipo_conversa = ""; // Valor padrão

    const query = `
      INSERT INTO "conversa" (usuario_id, titulo_conversa, tipo_conversa) 
      VALUES ($1, $2, $3) 
      RETURNING *`;
    const result = await pool.query(query, [
      usuario_id,
      titulo_conversa,
      tipo_conversa,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar conversa:", error);
    res.status(500).json({ error: "Erro ao criar a conversa" });
  }
});

//deletar uma conversa com o usuário
app.delete("/conversa/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM "conversa" WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Conversa não encontrada" });
    }

    res.status(200).json({ message: "Conversa excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir conversa:", error);
    res.status(500).json({ error: "Erro ao excluir conversa" });
  }
});

// Listar todas as conversas por usuario_id
app.get("/conversas/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const query = 'SELECT * FROM "conversa" WHERE usuario_id = $1';
    const result = await pool.query(query, [usuario_id]);

    // Retorna um array vazio se não houver conversas
    if (result.rowCount === 0) {
      return res.status(200).json([]);
    }

    // Retorna as conversas encontradas
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao consultar conversas:", error);
    res.status(500).json({ error: "Erro ao consultar conversas." });
  }
});

//atualizar conversas
app.put("/conversa/:id", async (req, res) => {
  const { usuario_id, titulo_conversa, tipo_conversa } = req.body;
  const { id } = req.params;

  if (!usuario_id && !titulo_conversa && !tipo_conversa) {
    return res
      .status(400)
      .json({ error: "Informe pelo menos um campo para atualizar" });
  }

  try {
    const query = `
      UPDATE "conversa" 
      SET 
        usuario_id = COALESCE($1, usuario_id), 
        titulo_conversa = COALESCE($2, titulo_conversa), 
        tipo_conversa = COALESCE($3, tipo_conversa)
      WHERE id = $4
      RETURNING *`;
    const result = await pool.query(query, [
      usuario_id,
      titulo_conversa,
      tipo_conversa,
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Conversa não encontrada" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar a conversa:", error);
    res.status(500).json({ error: "Erro ao atualizar a conversa" });
  }
});

//CRUD MENSAGENS

//armazenar uma mensagem com o usuario
app.post("/mensagens", async (req, res) => {
  const { mensagem, enviado_por, conversa_id } = req.body;

  if (!mensagem || !enviado_por || !conversa_id) {
    return res.status(400).json({
      error:
        "A mensagem, quem enviou a mensagem e o ID da conversa são obrigatórios",
    });
  }

  try {
    const query = `
      INSERT INTO "mensagens" (mensagem, enviado_por, conversa_id) 
      VALUES ($1, $2, $3) 
      RETURNING *`;
    const result = await pool.query(query, [
      mensagem,
      enviado_por,
      conversa_id,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao armazenar a mensagem:", error);
    res.status(500).json({ error: "Erro ao armazenar a mensagem" });
  }
});

//deletar uma mensagem
app.delete("/mensagens/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM "mensagens" WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }

    res.status(200).json({ message: "Mensagem excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir mensagem:", error);
    res.status(500).json({ error: "Erro ao excluir mensagem" });
  }
});

app.get("/mensagens/conversa", async (req, res) => {
  const { conversa_id } = req.query;

  if (!conversa_id) {
    return res.status(400).json({ error: "O ID da conversa é obrigatório." });
  }

  try {
    const query = `
      SELECT * 
      FROM mensagens 
      WHERE conversa_id = $1 
      ORDER BY data_envio ASC
    `;
    const result = await pool.query(query, [conversa_id]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Nenhuma mensagem encontrada para esta conversa." });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    res.status(500).json({ error: "Erro ao buscar mensagens." });
  }
});

//consultar uma conversa
app.get("/mensagens/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM "mensagens" WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao consultar mensagem:", error);
    res.status(500).json({ error: "Erro ao consultar mensagem" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
