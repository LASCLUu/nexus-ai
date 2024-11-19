
CREATE TABLE "usuario" (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    url_foto VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "conversa" (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES "usuario"(id) ON DELETE CASCADE,
    titulo_conversa VARCHAR(100),
    tipo_conversa VARCHAR(50),
    data_log TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
);

CREATE TABLE "mensagens" (
    id SERIAL PRIMARY KEY,
    mensagem TEXT NOT NULL,
	enviado_por INT REFERENCES "usuario"(id) ON DELETE CASCADE,
    conversa_id INT REFERENCES "conversa"(id) ON DELETE CASCADE,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "log_sistema" (
    id SERIAL PRIMARY KEY,                        
    usuario_id INT REFERENCES "usuario"(id),        
    tipo_log VARCHAR(50) NOT NULL,                
    descricao TEXT NOT NULL,                        
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "usuario" (id, nome, email, url_foto) VALUES
(1, 'Nexus', 'nexus@nexusai.com.br', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdZ9dExjxM5bzlQbdh_gLIt2cWMOzQmil8TA&s'),
(2, 'João Varella', 'joaovvarella@gmail.com', 'https://avatars.githubusercontent.com/u/83472629?v=4');
