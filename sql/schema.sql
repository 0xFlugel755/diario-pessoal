-- ============================================================
-- DIÁRIO PESSOAL DIGITAL - SCHEMA MYSQL 8+
-- Compatível com MySQL Workbench
-- ============================================================

CREATE DATABASE IF NOT EXISTS diario_pessoal
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE diario_pessoal;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- Tabela: usuarios
-- ------------------------------------------------------------
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id              CHAR(36)      NOT NULL DEFAULT (UUID()),
    nome            VARCHAR(150)  NOT NULL,
    username        VARCHAR(50)   NOT NULL,
    email           VARCHAR(150)  NOT NULL,
    senha_hash      VARCHAR(255)  NOT NULL,
    ativo           TINYINT(1)    NOT NULL DEFAULT 1,
    criado_em       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                   ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_usuarios_username (username),
    UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabela: diarios
-- ------------------------------------------------------------
DROP TABLE IF EXISTS diarios;
CREATE TABLE diarios (
    id              CHAR(36)      NOT NULL DEFAULT (UUID()),
    usuario_id      CHAR(36)      NOT NULL,
    data            DATE          NOT NULL,
    conteudo_texto  MEDIUMTEXT    NOT NULL,
    emoji_humor     VARCHAR(20)   NULL,
    criado_em       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                   ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_usuario_data (usuario_id, data),
    KEY idx_diarios_usuario (usuario_id),
    KEY idx_diarios_data (data),
    CONSTRAINT fk_diarios_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabela: fotos
-- ------------------------------------------------------------
DROP TABLE IF EXISTS fotos;
CREATE TABLE fotos (
    id              CHAR(36)      NOT NULL DEFAULT (UUID()),
    diario_id       CHAR(36)      NOT NULL,
    url_foto        VARCHAR(500)  NOT NULL,
    public_id       VARCHAR(255)  NULL,
    criado_em       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_fotos_diario (diario_id),
    CONSTRAINT fk_fotos_diario
        FOREIGN KEY (diario_id) REFERENCES diarios(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabela: logs_acesso
-- ------------------------------------------------------------
DROP TABLE IF EXISTS logs_acesso;
CREATE TABLE logs_acesso (
    id              BIGINT        NOT NULL AUTO_INCREMENT,
    usuario_id      CHAR(36)      NULL,
    username        VARCHAR(50)   NOT NULL,
    nome            VARCHAR(150)  NULL,
    ip_origem       VARCHAR(45)   NOT NULL,
    user_agent      VARCHAR(500)  NULL,
    status          VARCHAR(20)   NOT NULL, -- SUCESSO | FALHA
    timestamp_log   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_logs_usuario (usuario_id),
    KEY idx_logs_timestamp (timestamp_log),
    CONSTRAINT fk_logs_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- Trigger de exemplo: garante atualizado_em em updates manuais
-- (redundante com ON UPDATE CURRENT_TIMESTAMP, mantido para
--  compatibilidade com clientes que fazem UPDATE em lote)
-- ------------------------------------------------------------
DELIMITER $$

CREATE TRIGGER trg_diarios_before_update
BEFORE UPDATE ON diarios
FOR EACH ROW
BEGIN
    SET NEW.atualizado_em = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER trg_usuarios_before_update
BEFORE UPDATE ON usuarios
FOR EACH ROW
BEGIN
    SET NEW.atualizado_em = CURRENT_TIMESTAMP;
END$$

DELIMITER ;

-- ------------------------------------------------------------
-- Índice adicional útil para o painel admin (busca por data)
-- ------------------------------------------------------------
CREATE INDEX idx_logs_status ON logs_acesso(status);
