-- Tabela de usuários
CREATE TABLE "usuario" (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de conversas
CREATE TABLE "conversa" (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES "usuario"(id) ON DELETE CASCADE,
    pergunta TEXT NOT NULL,
    resposta_nexus TEXT,
    data_log TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_conversa VARCHAR(50)    
);

-- Tabela de log do sistema
CREATE TABLE "log_sistema" (
    id SERIAL PRIMARY KEY,                        
    usuario_id INT REFERENCES "usuario"(id),        
    tipo_log VARCHAR(50) NOT NULL,                
    descricao TEXT NOT NULL,                        
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
