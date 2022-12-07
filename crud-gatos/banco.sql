CREATE DATABASE gatinhos;

USE gatinhos;

CREATE TABLE gato(
    id int PRIMARY KEY AUTO_INCREMENT,
    nome varchar(100) NOT NULL,
    raca varchar(100) NOT NULL,
    peso NUMERIC(5,2),
    data_nascimento date NOT NULL
);