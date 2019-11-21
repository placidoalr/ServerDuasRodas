
DROP DATABASE DRDB;

CREATE SCHEMA IF NOT EXISTS `DRDB` ;
USE `DRDB` ;



CREATE TABLE IF NOT EXISTS `DRDB`.`TBEQUIP` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `NOME` VARCHAR(45) NULL  NOT NULL,
  `CODEQUIP` VARCHAR(45) NULL NOT NULL,
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
  `CDLAYOUT` INT  NOT NULL,
  `STATUS` INT NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`)
);


CREATE TABLE IF NOT EXISTS `DRDB`.`TBTIPOMAN` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `NOME` VARCHAR(45) NULL NOT NULL,
  `STATUS` INT NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`)
);


CREATE TABLE IF NOT EXISTS `DRDB`.`TBSETOR` (    /* Cadastro de setor */ 
  `ID` INT NOT NULL AUTO_INCREMENT,
  `CODSETOR` INT NOT NULL,
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
      FOREIGN KEY (`CDCT`) REFERENCES `DRDB`.`TBCT` (`ID`));


/*
CREATE TABLE IF NOT EXISTS `DR_DB`.`TB_IM` (
  `ID_IM` INT NOT NULL ,
  `DESC_IM` VARCHAR(200)  NULL,
  PRIMARY KEY (`ID_IM`)
  );*/


CREATE TABLE IF NOT EXISTS `DRDB`.`TBOM` ( /* cadastro da OM */
  `ID` INT NOT NULL AUTO_INCREMENT,
  `CDOM` INT NULL DEFAULT NULL,
  `SOLIC` VARCHAR(45) NOT NULL, /* solicitante */
  `TPOM` INT NOT NULL,
  `DSOM` VARCHAR(200) NOT NULL,
  `DTGERACAO` DATETIME NULL DEFAULT NULL,
  `DTBAIXA_MANUT` DATETIME NULL DEFAULT NULL,
  `DTBAIXA_SETOR` DATETIME NULL DEFAULT NULL,
  `DTBAIXA_ADMIN` DATETIME NULL DEFAULT NULL,
  `OBS` VARCHAR(500) NULL DEFAULT NULL,
  `PRIORIDADE` INT NOT NULL,
  `ESTADO` INT NOT NULL,
  `MANU_ATRIB` INT,
  `SETOR_ATRIB` INT NOT NULL,
  `STATUS` INT NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`),
    FOREIGN KEY (`SETOR_ATRIB`) REFERENCES `DRDB`.`TBSETOR` (`ID`),
    FOREIGN KEY (`MANU_ATRIB`) REFERENCES `DRDB`.`TBUSUARIO` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

  CREATE TABLE IF NOT EXISTS `DRDB`.`TB_OM_DESC` (       /* Descrições que o manutentor irá colocar na OM */
  `ID` INT NOT NULL AUTO_INCREMENT,
  `IDOM` INT NOT NULL,
  `DESC` VARCHAR(500) NULL,
  `TEMPO_UTIL` TIME DEFAULT NULL,
  `STATUS` INT NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`IDOM`) REFERENCES `DRDB`.`TBOM` (`ID`)
);



