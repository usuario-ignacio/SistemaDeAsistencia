CREATE DATABASE etapa_uno;
USE etapa_uno;

CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL,
  clave VARCHAR(255) NOT NULL,
  rol VARCHAR(50) DEFAULT 'usuario' NOT NULL,
  email VARCHAR(50)  NOT NULL,
  numero VARCHAR(50) NOT NULL
);

INSERT INTO usuario (usuario, clave, rol, email, numero) VALUES 
('vicho','peluconaconfalda','usuario','vicho@gmail.com','12345678'),
('jose','password','admin','jose@gmail.com','12345678'),
('ignacio','password','admin','ignacio@gmail.com','12345678'),
('fenia','password','admin','fenia@gmail.com','12345678');


CREATE TABLE asistencia (
  id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tipo VARCHAR(50) NOT NULL,
  marca VARCHAR(50) NOT NULL,
  id_usuario INT NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE reporte (
  id_reporte INT AUTO_INCREMENT PRIMARY KEY,
  nombre_archivo VARCHAR(255) NOT NULL,
  fecha DATETIME NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  id_usuario INT NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE log_usuario (
  id_log INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL,
  fecha DATETIME NOT NULL
);