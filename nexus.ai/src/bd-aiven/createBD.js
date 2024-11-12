const fs = require("fs");
const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config({ path: "../../.env" });

const config = {
  user: process.env.REACT_APP_POSTGRESQL_USER,
  password: process.env.REACT_APP_POSTGRESQL_PASSWORD,
  host: process.env.REACT_APP_POSTGRESQL_HOST,
  port: 26850,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(process.env.REACT_APP_POSTGRESQL_CA, "utf8"),
  },
};

// Função para criar o banco de dados NexusIA
const createDatabase = async () => {
  const client = new pg.Client({
    ...config,
    database: "postgres", // Conecte-se ao banco "postgres" para criação do banco NexusIA
  });

  try {
    await client.connect();
    console.log("Conectado ao banco de dados 'postgres'.");

    // Criar o banco de dados NexusIA
    await client.query(`CREATE DATABASE "NexusIA";`);
    console.log("Banco de dados 'NexusIA' criado.");

    await client.end();
    console.log("Conexão com o banco de dados 'postgres' encerrada.");
  } catch (err) {
    console.error("Erro ao criar o banco de dados:", err);
  }
};

// Função para executar o arquivo SQL
const executeSQLFile = async (filePath) => {
  const client = new pg.Client({
    ...config,
    database: "NexusIA", // Agora se conecta ao banco NexusIA
  });

  try {
    const sql = fs.readFileSync(filePath, { encoding: "utf8" });

    await client.connect();
    console.log("Conectado ao banco de dados 'NexusIA'.");

    // Executar o arquivo SQL
    await client.query(sql);
    console.log("Comandos SQL executados com sucesso!");
  } catch (err) {
    console.error("Erro ao executar o arquivo SQL:", err);
  } finally {
    await client.end();
    console.log("Conexão encerrada.");
  }
};

// Primeiro, cria o banco de dados
createDatabase().then(() => {
  // Após criar o banco, executa o arquivo SQL
  executeSQLFile("DBNexusIA.sql");
});
