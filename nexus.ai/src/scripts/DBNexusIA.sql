USE master;
GO

 -- FEITO POR: VINICIUS SCARAMELLO RODRIGUES NERES
 -- CRIA DATABASE 'NEXUSIA' E TABELA DE LOG

CREATE DATABASE NexusIA ON
(NAME = NexusIA_dat,
    FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\nexusia_dat.mdf',
    SIZE = 10,
    MAXSIZE = 50,
    FILEGROWTH = 5)
LOG ON
(NAME = NexusIA_log,
    FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\nexusia_log.ldf',
    SIZE = 5 MB,
    MAXSIZE = 25 MB,
    FILEGROWTH = 5 MB);
GO


USE NexusIA;

GO

CREATE TABLE LogNexusIA (
LogID int identity(1,1) not null,

DtLog datetime not null default GETDATE(),

Pergunta varchar(600) not null,

RespostaNexus varchar(2000) null,

Login varchar(40) null

PRIMARY KEY (LogID)
);