

  DROP DATABASE DRDB;

  CREATE SCHEMA IF NOT EXISTS `DRDB` ;
  USE `DRDB` ;



  CREATE TABLE IF NOT EXISTS `DRDB`.`TBEQUIP` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `NOME` VARCHAR(45) NULL  NOT NULL,
    `IDSAP` VARCHAR(45) NULL NOT NULL,
    `SETOR_ATRIB` INT NOT NULL,
    `STATUS` INT NOT NULL DEFAULT '1',
    PRIMARY KEY (`ID`),
    FOREIGN KEY (`SETOR_ATRIB`) REFERENCES `DRDB`.`TBSETOR` (`ID`)
  );

  CREATE TABLE IF NOT EXISTS `DRDB`.`TBCT` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `NOME` VARCHAR(45) NULL NOT NULL,
    `STATUS` INT NOT NULL DEFAULT '1',
    PRIMARY KEY (`ID`)
  );

  CREATE TABLE IF NOT EXISTS `DRDB`.`TBCAUSADEF` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `DSCAUSA` VARCHAR(45) NULL NOT NULL,
    `STATUS` INT NOT NULL DEFAULT '1',
    PRIMARY KEY (`ID`)
  );

  CREATE TABLE IF NOT EXISTS `DRDB`.`TBSINTOMA` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `NOME` VARCHAR(45) NULL NOT NULL,
    `STATUS` INT NOT NULL DEFAULT '1',
    PRIMARY KEY (`ID`)
  );

  CREATE TABLE IF NOT EXISTS `DRDB`.`TBLAYOUTOM` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `NOME` VARCHAR(45) NULL NOT NULL,
    `IDESTILO` INT  NOT NULL,
    `STATUS` INT NOT NULL DEFAULT '1',
    PRIMARY KEY (`ID`),
    FOREIGN KEY (`IDESTILO`) REFERENCES `DRDB`.`TBESTILOLAYOUT` (`ID`)
  );


  CREATE TABLE IF NOT EXISTS `DRDB`.`TBTIPOMAN` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `NOME` VARCHAR(45) NULL NOT NULL,
    `STATUS` INT NOT NULL DEFAULT '1',
    PRIMARY KEY (`ID`)
  );


  CREATE TABLE IF NOT EXISTS `DRDB`.`TBSETOR` (    /* Cadastro de setor */ 
    `ID` INT NOT NULL AUTO_INCREMENT,
    `IDSAP` VARCHAR(45) NOT NULL,
    `NOME` VARCHAR(45) NULL NOT NULL,
    `STATUS` INT NOT NULL DEFAULT '1',
    PRIMARY KEY (`ID`));



  CREATE TABLE IF NOT EXISTS `DRDB`.`TBUSUARIO` (  /* cadastro de usuario */ 
    `ID` INT NOT NULL  AUTO_INCREMENT,
    `IDSAP` VARCHAR(45) NOT NULL,
    `LOGIN` VARCHAR(45) NULL NOT NULL,
    `SENHA` VARCHAR(45) NULL NOT NULL,
    `NOME` VARCHAR(45) NULL NOT NULL,
    `CARGO` INT NOT NULL,
    `CDCT` INT NOT NULL,
    `STATUS` INT NOT NULL DEFAULT '1',
    PRIMARY KEY (`ID`),
      FOREIGN KEY (`CDCT`) REFERENCES `DRDB`.`TBCT` (`ID`),
      FOREIGN KEY (`CARGO`) REFERENCES `DRDB`.`TBCARGO` (`ID`)
    );


  /*
  CREATE TABLE IF NOT EXISTS `DR_DB`.`TB_IM` (
    `ID_IM` INT NOT NULL ,
    `DESC_IM` VARCHAR(200)  NULL,
    PRIMARY KEY (`ID_IM`)
    );*/


  CREATE TABLE IF NOT EXISTS `DRDB`.`TBOM` ( /* cadastro da OM */
    `ID` INT NOT NULL AUTO_INCREMENT,
    `IDSAP` VARCHAR(45)  NOT NULL, /* ALTERAR PARA IDSAP(antigo CDOM) */
    `SOLIC` VARCHAR(45) NOT NULL, /* solicitante */
    `IDLAYOUT` INT NOT NULL, /*LAYOUT DA OM*/
    `IDCT` INT NOT NULL,/*CENTRO DE TRABALHO*/
    `TPOM` INT NOT NULL,/*TIPO DA OM*/
    `SINTOMA` INT NOT NULL,/*SINTOMA DO PROBLEMA*/
    `CAUSADEF` INT NOT NULL,/*CAUSA DO DEFEITO*/
    `PRIORIDADE` INT NOT NULL, /* PRIORIDADE DEFINIDA */
    `DEF` VARCHAR(200) NOT NULL, /* DEFEITO DA MÁQUINA (DEFINIDO NA CRIAÇÃO DA OM)*/
    `DTGERACAO` DATETIME NULL DEFAULT NULL,  /*CURRENT_TIMESTAMP*/
    `DTBAIXA_MANUT` DATETIME NULL DEFAULT NULL, /*CURRENT_TIMESTAMP DA HORA QUE O MANUTENTOR FINALIZA A OM*/
    `DTBAIXA_SETOR` DATETIME NULL DEFAULT NULL,
    `DTBAIXA_ADMIN` DATETIME NULL DEFAULT NULL,
    `OBS` VARCHAR(500) NULL DEFAULT NULL,
    `ESTADO` INT NOT NULL, /*  1 - NOVA(SEM ATRIBUIÇÃO) / 2- ATRIBUIDA AO MANUTENTOR / 3- ATRIBUIDA AO LIDER DO SETOR PARA APROVAÇÃO / 4- ATRIBUIDA AO ADM / 5- OM FINALIZADA*/
    `SETOR_ATRIB` INT NOT NULL, /*LOCAL DE INSTALAÇÃO*/
    `STATUS` INT NOT NULL DEFAULT '1',
    `REQUERPARADA` VARCHAR(500),
    PRIMARY KEY (`ID`),
      FOREIGN KEY (`SETOR_ATRIB`) REFERENCES `DRDB`.`TBSETOR` (`ID`),
      FOREIGN KEY (`IDCT`) REFERENCES `DRDB`.`TBCT` (`ID`),
      FOREIGN KEY (`IDLAYOUT`) REFERENCES `DRDB`.`TBLAYOUTOM` (`ID`),
      FOREIGN KEY (`TPOM`) REFERENCES `DRDB`.`TBTIPOMAN` (`ID`),
      FOREIGN KEY (`SINTOMA`) REFERENCES `DRDB`.`TBSINTOMA` (`ID`),
      FOREIGN KEY (`CAUSADEF`) REFERENCES `DRDB`.`TBCAUSADEF` (`ID`),
      FOREIGN KEY (`PRIORIDADE`) REFERENCES `DRDB`.`TBPRIORIDADE` (`ID`)
      );

    CREATE TABLE IF NOT EXISTS `DRDB`.`TB_OM_DESC` (       /* Descrições que o manutentor irá colocar na OM */
    `ID` INT NOT NULL AUTO_INCREMENT,
    `IDOM` INT NOT NULL,
    `IDMANUT` INT NOT NULL,
    `DESC` VARCHAR(500) NULL,
    `TEMPO_UTIL` TIME DEFAULT NULL,
    `STATUS` INT NOT NULL DEFAULT '1',
    PRIMARY KEY (`ID`),
    FOREIGN KEY (`IDOM`) REFERENCES `DRDB`.`TBOM` (`ID`),
    FOREIGN KEY (`IDMANUT`) REFERENCES `DRDB`.`TBUSUARIO` (`ID`)
  );

  CREATE TABLE if not EXISTS `DRDB`.`TBEQUIP_WITH_TBOM`(
    `ID` INT NOT NULL AUTO_INCREMENT,
    `IDOM` INT NOT NULL,
    `IDEQUIP` INT NOT NULL,
    PRIMARY KEY(`ID`),
    FOREIGN KEY (`IDEQUIP`) REFERENCES `DRDB`.`TBEQUIP` (`ID`),
    FOREIGN KEY (`IDOM`) REFERENCES `DRDB`.`TBOM` (`ID`)

  );
    CREATE TABLE IF NOT EXISTS `DRDB`.`TBUSUARIO_WITH_TBOM`(
      `ID` INT NOT NULL AUTO_INCREMENT,
      `IDMANUT` INT NOT NULL,
      `IDOM` INT NOT NULL,
      PRIMARY KEY(`ID`),
      FOREIGN KEY (`IDMANUT`) REFERENCES `DRDB`.`TBUSUARIO`(`ID`),
      FOREIGN KEY (`IDOM`) REFERENCES `DRDB`.`TBOM`(`ID`)
    );

    CREATE TABLE IF NOT EXISTS `DRDB`.`TBESTILOLAYOUT`(
      `ID` INT NOT NULL AUTO_INCREMENT,
      `NOME` VARCHAR(45) NOT NULL,
      PRIMARY KEY(`ID`)
    );
    CREATE TABLE IF NOT EXISTS `DRDB`.`TBPRIORIDADE`(
      `ID` INT NOT NULL AUTO_INCREMENT,
      `NOME` VARCHAR(45) NOT NULL,
      PRIMARY KEY(`ID`)
    );

    CREATE TABLE IF NOT EXISTS `DRDB`.`TBCARGO`(
      `ID` INT NOT NULL AUTO_INCREMENT,
      `NOME` VARCHAR(45) NOT NULL,
      PRIMARY KEY(`ID`)
    );

    

  INSERT INTO TBCT (NOME) VALUES ('ADM');

  INSERT INTO TBUSUARIO (IDSAP,LOGIN,SENHA,NOME,CARGO, CDCT) VALUES (1, 'german', '123', 'german', 3, 1); 
  
  INSERT INTO TBESTILOLAYOUT (NOME) VALUES ('Corretiva/Preventiva');
  INSERT INTO TBESTILOLAYOUT (NOME) VALUES ('Rota');
  INSERT INTO TBESTILOLAYOUT (NOME) VALUES ('Lista');

  INSERT INTO TBPRIORIDADE (NOME) VALUES ('ALTA');
  INSERT INTO TBPRIORIDADE (NOME) VALUES ('MÉDIA');
  INSERT INTO TBPRIORIDADE (NOME) VALUES ('BAIXA');

  INSERT INTO TBCARGO (NOME) VALUES ('Manutentor');
  INSERT INTO TBCARGO (NOME) VALUES ('Lider de Setor');
  INSERT INTO TBCARGO (NOME) VALUES ('Administrador');
