
DROP DATABASE DR_DB;

CREATE SCHEMA IF NOT EXISTS `DR_DB` ;
USE `DR_DB` ;


CREATE TABLE IF NOT EXISTS `DR_DB`.`TBSETOR` (
  `CDSETOR` INT NOT NULL AUTO_INCREMENT,
  `NOME` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`CDSETOR`));



CREATE TABLE IF NOT EXISTS `DR_DB`.`TBUSUARIO` (
  `CDUSUARIO` INT NOT NULL,
  `LOGIN` VARCHAR(45) NULL DEFAULT NULL,
  `SENHA` VARCHAR(45) NULL DEFAULT NULL,
  `NOME` VARCHAR(45) NULL DEFAULT NULL,
  `CDPERMISSAO` INT NOT NULL,
  `TBSETOR_CDSETOR` INT NOT NULL,
  PRIMARY KEY (`CDUSUARIO`),
  FOREIGN KEY (`TBSETOR_CDSETOR`) REFERENCES `DR_DB`.`TBSETOR` (`CDSETOR`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



CREATE TABLE IF NOT EXISTS `DR_DB`.`TB_IM` (
  `ID_IM` INT NOT NULL ,
  `DESC_IM` VARCHAR(200)  NULL,
  PRIMARY KEY (`ID_IM`)
  );


CREATE TABLE IF NOT EXISTS `DR_DB`.`TBOM` (
  `IDOM` INT NOT NULL AUTO_INCREMENT,
  `CDOM` INT NULL DEFAULT NULL,
  `SOLIC` VARCHAR(45) NOT NULL,
  `TPOM` INT NOT NULL,
  `DSOM` VARCHAR(200) NOT NULL,
  `DTGERACAO` DATETIME NULL DEFAULT NULL,
  `DTBAIXA_MANUT` DATETIME NULL DEFAULT NULL,
  `DTBAIXA_SETOR` DATETIME NULL DEFAULT NULL,
  `DTBAIXA_ADMIN` DATETIME NULL DEFAULT NULL,
  `OBS` VARCHAR(500) NULL DEFAULT NULL,
  `PRIORIDADE` INT NOT NULL,
  `ESTADO` INT NOT NULL,
  `ADMIN_SETOR` INT,
  `MANU_ATRIB` INT,
  `SETOR_ATRIB` INT NOT NULL,
  PRIMARY KEY (`IDOM`),
    FOREIGN KEY (`SETOR_ATRIB`) REFERENCES `DR_DB`.`TBSETOR` (`CDSETOR`),
    FOREIGN KEY (`MANU_ATRIB`) REFERENCES `DR_DB`.`TBUSUARIO` (`CDUSUARIO`),
    FOREIGN KEY (`ADMIN_SETOR`) REFERENCES `DR_DB`.`TBUSUARIO` (`CDUSUARIO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

    CREATE TABLE IF NOT EXISTS `DR_DB`.`TB_OM_DESC` (
  `ID_DESC` INT NOT NULL,
  `IDOM` INT NOT NULL,
  `DESC` VARCHAR(500) NULL,
  `TEMPO_UTIL` TIME DEFAULT NULL,
  PRIMARY KEY (`ID_DESC`),
  FOREIGN KEY (`IDOM`) REFERENCES `DR_DB`.`TBOM` (`IDOM`)
);

  CREATE TABLE IF NOT EXISTS `DR_DB`.`OM_HAS_IM`(
    `IDOM` INT NOT NULL,
    `ID_IM` INT NOT NULL,
    FOREIGN KEY (`IDOM`) REFERENCES `DR_DB`.`TBOM` (`IDOM`),
    FOREIGN KEY (`ID_IM`) REFERENCES `DR_DB`.`TB_IM` (`ID_IM`)
  );




INSERT INTO TBSETOR (NOME) VALUES ('GERMAN');


INSERT INTO TBUSUARIO (CDUSUARIO, LOGIN, SENHA, NOME, CDPERMISSAO, TBSETOR_CDSETOR) VALUES (1,'german','123','ADMIN',3, 1);
INSERT INTO TBUSUARIO (CDUSUARIO, LOGIN, SENHA, NOME, CDPERMISSAO, TBSETOR_CDSETOR) VALUES (2,'placido','123','Placido',3, 1);
INSERT INTO TBUSUARIO (CDUSUARIO, LOGIN, SENHA, NOME, CDPERMISSAO, TBSETOR_CDSETOR) VALUES (3,'gabriela','123','Gabriela',3, 1);

INSERT INTO TBOM (CDOM, SOLIC, TPOM, DSOM, DTGERACAO, OBS, PRIORIDADE, ESTADO, MANU_ATRIB, SETOR_ATRIB) VALUES (1, 'DIEGO', 1, 'MAQUINA PARADA', '2019.05.14, 20:00:00', 'TESTE', 1, 1, 1, 1);
INSERT INTO TBOM (CDOM, SOLIC, TPOM, DSOM, DTGERACAO, OBS, PRIORIDADE, ESTADO, MANU_ATRIB, SETOR_ATRIB) VALUES (2, 'GIAN', 2, 'COMPUTADOR', '2019.05.14, 21:00:00', 'TESTE2', 2, 2, 2, 1);
INSERT INTO TBOM (CDOM, SOLIC, TPOM, DSOM, DTGERACAO, OBS, PRIORIDADE, ESTADO, MANU_ATRIB, SETOR_ATRIB) VALUES (3, 'PLACIDO', 2, 'MÁQUINA DA PRODUÇÃO', '2019.05.14, 19:00:00', 'TESTE3', 3, 3,1, 1);
INSERT INTO TBOM (CDOM, SOLIC, TPOM, DSOM, DTGERACAO, OBS, PRIORIDADE, ESTADO, MANU_ATRIB, SETOR_ATRIB) VALUES (4, 'GABRIELA', 1, 'MAQUINA PARADA', '2019.05.14, 18:30:00', 'TESTE4', 2, 4, 2, 1);
INSERT INTO TBOM (CDOM, SOLIC, TPOM, DSOM, DTGERACAO, OBS, PRIORIDADE, ESTADO, MANU_ATRIB, SETOR_ATRIB) VALUES (5, 'RAFAEL', 1, 'PROBLEMA NA MAQUINA DA PRODUÇÃO', '2019.05.14, 20:00:00', 'TESTE5', 1, 2, 3, 1);
INSERT INTO TBOM (CDOM, SOLIC, TPOM, DSOM, DTGERACAO, OBS, PRIORIDADE, ESTADO, SETOR_ATRIB) VALUES (5, 'RAFAEL', 1, 'PROBLEMA NA MAQUINA DA PRODUÇÃO', '2019.05.14, 20:00:00', 'TESTE5', 1, 2, 1);

INSERT INTO TB_IM (ID_IM, DESC_IM) VALUES (1, 'APERTAR PARAFUSO');
INSERT INTO TB_IM (ID_IM, DESC_IM) VALUES (2, 'TROCAR PARAFUSO');
INSERT INTO TB_IM (ID_IM, DESC_IM) VALUES (3, 'TROCAR ÓLEO');






