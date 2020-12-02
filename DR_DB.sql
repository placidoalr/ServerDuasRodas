

  DROP DATABASE DRDB;

  CREATE SCHEMA IF NOT EXISTS `DRDB` ;
  USE `DRDB` ;

    CREATE TABLE IF NOT EXISTS `DRDB`.`TBEPI`(
    `ID` INT NOT NULL AUTO_INCREMENT,
    `NOME` VARCHAR(250) NOT NULL,
    `IDPADRAO` VARCHAR(1),/* S ou N*/
    `STATUS` INT NOT NULL DEFAULT '1',
    PRIMARY KEY (`ID`)
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

  CREATE TABLE IF NOT EXISTS `DRDB`.`TBOPERACAO` ( /* CADASTRO DE OPERAÇÕES */
    `ID` INT NOT NULL  AUTO_INCREMENT,
    `IDSAP` VARCHAR(45) NOT NULL,
    `DESC` VARCHAR(45) NULL NOT NULL,
    `STATUS` INT NOT NULL DEFAULT '1',
    PRIMARY KEY (`ID`)
  );

  CREATE TABLE IF NOT EXISTS `DRDB`.`TBMATERIAL` ( /* CADASTRO DE MATERIAIS */
    `ID` INT NOT NULL  AUTO_INCREMENT,
    `IDSAP` VARCHAR(45) NOT NULL,
    `DESC` VARCHAR(45) NULL NOT NULL,
    `UN_MEDIDA` VARCHAR(10) NULL NOT NULL,
    `STATUS` INT NOT NULL DEFAULT '1',
    PRIMARY KEY (`ID`)
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


  CREATE TABLE IF NOT EXISTS `DRDB`.`TBLOC_INST` (    /* Cadastro de LOCAL DE INSTAÇÃO */ 
    `ID` INT NOT NULL AUTO_INCREMENT,
    `IDSAP` VARCHAR(45) NOT NULL,
    `NOME` VARCHAR(45) NULL NOT NULL,
    `STATUS` INT NOT NULL DEFAULT '1',
    `IDLIDER` INT NOT NULL,
    PRIMARY KEY (`ID`),
    FOREIGN KEY (`IDLIDER`) REFERENCES `DRDB`.`TBUSUARIO` (`ID`)
    );

      CREATE TABLE IF NOT EXISTS `DRDB`.`TBEQUIP` ( /* CADASTRO DE EQUIPAMENTOS */ 
    `ID` INT NOT NULL AUTO_INCREMENT,
    `NOME` VARCHAR(45) NULL  NOT NULL,
    `EQUIP_SUP` VARCHAR(45),
    `IDSAP` VARCHAR(45) NULL NOT NULL,
    `LOCAL` VARCHAR(45),
    `LOC_INST_ATRIB` INT NOT NULL,
    `STATUS` INT NOT NULL DEFAULT '1',
    PRIMARY KEY (`ID`),
    FOREIGN KEY (`LOC_INST_ATRIB`) REFERENCES `DRDB`.`TBLOC_INST` (`ID`)
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
    `TITULO` VARCHAR(200)  NOT NULL, /* TITULO */
    `SOLIC` VARCHAR(45), /* solicitante */
    `IDLAYOUT` INT NOT NULL, /*LAYOUT DA OM*/
    `IDCT` INT NOT NULL,/*CENTRO DE TRABALHO*/
    `TPOM` INT NOT NULL,/*TIPO DA OM*/
    `SINTOMA` INT,/*SINTOMA DO PROBLEMA*/
    `CAUSADEF` INT NOT NULL,/*CAUSA DO DEFEITO*/
    `PRIORIDADE` INT NOT NULL, /* PRIORIDADE DEFINIDA */
    `DEF` VARCHAR(200), /* DEFEITO DA MÁQUINA (DEFINIDO NA CRIAÇÃO DA OM)*/
    `DTGERACAO` DATETIME NULL DEFAULT NULL,  /*CURRENT_TIMESTAMP*/
    `DTBAIXA_MANUT` DATETIME NULL DEFAULT NULL, /*CURRENT_TIMESTAMP DA HORA QUE O MANUTENTOR FINALIZA A OM*/
    `DTBAIXA_SETOR` DATETIME NULL DEFAULT NULL,
    `DTBAIXA_ADMIN` DATETIME NULL DEFAULT NULL,
    `DT_INI_PLAN` DATETIME NULL DEFAULT NULL,
    `DT_INI_PROG` DATETIME NULL DEFAULT NULL,
    `DT_FIM_PLAN` DATETIME NULL DEFAULT NULL,
    `DT_FIM_PROG` DATETIME NULL DEFAULT NULL,
    `OBS` VARCHAR(500) NULL DEFAULT NULL,
    `ESTADO` INT NOT NULL, /*  1 - NOVA(SEM ATRIBUIÇÃO) / 2- ATRIBUIDA AO MANUTENTOR / 3- ATRIBUIDA AO LIDER DO SETOR PARA APROVAÇÃO / 4- ATRIBUIDA AO ADM / 5- OM FINALIZADA*/
    `LOC_INST_ATRIB` INT, /*LOCAL DE INSTALAÇÃO*/
    `STATUS` INT NOT NULL DEFAULT '1',
    `ISREJECTED` BOOLEAN NOT NULL DEFAULT false,
    `REQUERPARADA` VARCHAR(1),
    PRIMARY KEY (`ID`),
      FOREIGN KEY (`LOC_INST_ATRIB`) REFERENCES `DRDB`.`TBLOC_INST` (`ID`),
      FOREIGN KEY (`IDCT`) REFERENCES `DRDB`.`TBCT` (`ID`),
      FOREIGN KEY (`IDLAYOUT`) REFERENCES `DRDB`.`TBLAYOUTOM` (`ID`),
      FOREIGN KEY (`TPOM`) REFERENCES `DRDB`.`TBTIPOMAN` (`ID`),
      FOREIGN KEY (`SINTOMA`) REFERENCES `DRDB`.`TBSINTOMA` (`ID`),
      FOREIGN KEY (`CAUSADEF`) REFERENCES `DRDB`.`TBCAUSADEF` (`ID`),
      FOREIGN KEY (`PRIORIDADE`) REFERENCES `DRDB`.`TBPRIORIDADE` (`ID`)
      );



    CREATE TABLE IF NOT EXISTS `DRDB`.`TBHISTORICO`(
    `ID` INT NOT NULL AUTO_INCREMENT,
    `IDOM` INT NOT NULL,
    `IDUSER` INT NOT NULL,
    `DESC` VARCHAR(240) DEFAULT NULL,
    `DTALTER` DATETIME NOT NULL,
    PRIMARY KEY (`ID`),
    FOREIGN KEY (`IDOM`) REFERENCES `DRDB`.`TBOM` (`ID`),
    FOREIGN KEY (`IDUSER`) REFERENCES `DRDB`.`TBUSUARIO` (`ID`)
    );

    CREATE TABLE IF NOT EXISTS `DRDB`.`TBASSINATURAS`(
    `ID` INT NOT NULL AUTO_INCREMENT,
    `IDOM` INT NOT NULL,
    `IDUSER` INT NOT NULL,
    `DTBAIXA` DATETIME NOT NULL,
    PRIMARY KEY (`ID`),
    FOREIGN KEY (`IDOM`) REFERENCES `DRDB`.`TBOM` (`ID`),
    FOREIGN KEY (`IDUSER`) REFERENCES `DRDB`.`TBUSUARIO` (`ID`)
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
  
  CREATE TABLE IF NOT EXISTS `DRDB`.`TB_OM_DESC_ROTA`(
    `ID` INT NOT NULL AUTO_INCREMENT,
    `IDOM` INT NOT NULL,
    `IDMANUT` INT NOT NULL,
    `DESC` VARCHAR(500) NULL,
    `IDEQUIP` INT NOT NULL,
    PRIMARY KEY(`ID`),
    FOREIGN KEY (`IDOM`) REFERENCES `DRDB`.`TBOM` (`ID`),
    FOREIGN KEY (`IDEQUIP`) REFERENCES `DRDB`.`TBEQUIP` (`ID`),
    FOREIGN KEY (`IDMANUT`) REFERENCES `DRDB`.`TBUSUARIO` (`ID`)
  );


  CREATE TABLE if not EXISTS `DRDB`.`TBEQUIP_WITH_TBOM`( /* TABELA SOMENTE PARA OM ROTA */
    `ID` INT NOT NULL AUTO_INCREMENT,
    `IDOM` INT NOT NULL,
    `IDEQUIP` INT NOT NULL,
    `OPER` INT DEFAULT NULL, /* Operação que deverá ser realizada sobre o equipamento */
    `OPER_REALIZADA` INT DEFAULT 0, /* Deverá gravar 1 se o manutentor preencher o checkbox  */
    `MAT_UTIL` INT DEFAULT NULL, /* Deverá gravar o material que sera necessário para realizar a operação no equipamento !! Apenas nas om rota !! */
    `QTDE_MAT` FLOAT DEFAULT NULL, /* Qt que sera utilizada do material. */
    PRIMARY KEY(`ID`),
    FOREIGN KEY (`IDEQUIP`) REFERENCES `DRDB`.`TBEQUIP` (`ID`),
    FOREIGN KEY (`OPER`) REFERENCES `DRDB`.`TBOPERACAO` (`ID`),
    FOREIGN KEY (`IDOM`) REFERENCES `DRDB`.`TBOM` (`ID`),
    FOREIGN KEY (`MAT_UTIL`) REFERENCES `DRDB`.`TBMATERIAL` (`ID`)
  );

    CREATE TABLE if not EXISTS `DRDB`.`TBEQUIP_OM` ( /* TABELA SOMENTE PARA CORRETIVA/LISTA */
    `ID` INT NOT NULL AUTO_INCREMENT,
    `IDOM` INT NOT NULL,
    `IDEQUIP` INT NOT NULL,
    `Obs` varchar(200) DEFAULT NULL,
    `OPER_REALIZADA` INT DEFAULT 0,/* Deverá gravar 1 se o manutentor preencher o checkbox no momento da OM LISTA */
    PRIMARY KEY(`ID`),
    FOREIGN KEY (`IDEQUIP`) REFERENCES `DRDB`.`TBEQUIP` (`ID`)
  );


  CREATE TABLE IF NOT EXISTS `DRDB`.`TBOPER_WITH_OM` ( /* QUANDO SE TRATA DE OM CORRETIVA/PREVENTIVA/LISTA */ 
    `ID` INT NOT NULL AUTO_INCREMENT,
    `IDOM` INT NOT NULL,
    `OPER` INT DEFAULT NULL, /* Operação que deverá ser realizada sobre o equipamento */
    PRIMARY KEY(`ID`),
    FOREIGN KEY (`OPER`) REFERENCES `DRDB`.`TBOPERACAO` (`ID`)
  );

  CREATE TABLE IF NOT EXISTS `DRDB`.`TBMAT_WITH_OM` ( /* QUANDO SE TRATA DE OM CORRETIVA/PREVENTIVA/LISTA */ 
    `ID` INT NOT NULL AUTO_INCREMENT,
    `IDOM` INT NOT NULL,
    `IDMAT` INT DEFAULT NULL, /* MATERIAIS DENTRO DE UMA OM */
    `QTDE` FLOAT DEFAULT NULL, /* Qt que sera utilizada do material. */
    PRIMARY KEY(`ID`),
    FOREIGN KEY (`IDMAT`) REFERENCES `DRDB`.`TBMATERIAL` (`ID`)
  );

  CREATE TABLE if not EXISTS `DRDB`.`TBEPI_WITH_TBOM`(
    `ID` INT NOT NULL AUTO_INCREMENT,
    `IDOM` INT NOT NULL,
    `IDEPI` INT NOT NULL,
    `IDMANUT` INT NOT NULL,
    PRIMARY KEY(`ID`),
    FOREIGN KEY (`IDEPI`) REFERENCES `DRDB`.`TBEPI` (`ID`),
    FOREIGN KEY (`IDMANUT`) REFERENCES `DRDB`.`TBUSUARIO`(`ID`),
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


    
  INSERT INTO TBTIPOMAN ( NOME, STATUS ) VALUES ( "Sem Tipo", 1 );

  INSERT INTO TBCAUSADEF ( DSCAUSA, STATUS ) VALUES ( "Sem Causa", 1 );

  INSERT INTO TBSINTOMA ( NOME, STATUS ) VALUES ( "Sem Sintoma", 1 );

  INSERT INTO TBCT (NOME) VALUES ('ADM');

  INSERT INTO TBESTILOLAYOUT (NOME) VALUES ('Corretiva/Preventiva');
  INSERT INTO TBESTILOLAYOUT (NOME) VALUES ('Rota');
  INSERT INTO TBESTILOLAYOUT (NOME) VALUES ('Lista');

  INSERT INTO TBPRIORIDADE (NOME) VALUES ('ALTA');
  INSERT INTO TBPRIORIDADE (NOME) VALUES ('MÉDIA');
  INSERT INTO TBPRIORIDADE (NOME) VALUES ('BAIXA');

  INSERT INTO TBCARGO (NOME) VALUES ('Manutentor');
  INSERT INTO TBCARGO (NOME) VALUES ('Lider de Setor');
  INSERT INTO TBCARGO (NOME) VALUES ('Administrador');

  INSERT INTO TBLAYOUTOM (NOME, IDESTILO) VALUES ('CORRETIVA', '1');
  INSERT INTO TBLAYOUTOM (NOME, IDESTILO) VALUES ('ROTA', '2');
  INSERT INTO TBLAYOUTOM (NOME, IDESTILO) VALUES ('LISTA', '3');

  INSERT INTO TBUSUARIO (IDSAP,LOGIN,SENHA,NOME,CARGO, CDCT) VALUES (1, 'german', '123', 'german', 3, 1); 
  