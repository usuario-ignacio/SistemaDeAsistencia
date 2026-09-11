//CAPA NEGOCIO
const express = require('express');
const router = express.Router();
const db = require('../db'); //importar

//----------------------------------------------------------------
//------------------ REGISTRAR ASISTENCIA ------------------------
//----------------------------------------------------------------
router.post('/asistencia', (request, response) => {

  const tipo = request.body.tipo;
  const marca = request.body.marca;
  const id_usuario = request.body.id_usuario;


  //Validación simple
  if (!tipo || !marca || !id_usuario) {
    return response.status(400).json({
      statusHTTP: 'BAD_REQUEST',
      exito: false,
      message: 'Faltan campos obligatorios'
    });
  }

  const sql = `
    INSERT INTO asistencia (tipo, marca, id_usuario)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [tipo, marca, id_usuario], (error, resultado) => {

    if (error) {
      return response.status(500).json({
        statusHTTP: 'INTERNAL_SERVER_ERROR',
        exito: false,
        message: 'Error al ingresar asistencia'
      });
    }

    //HTTP Response exitoso
    response.status(201).json({
      statusHTTP: 'CREATED',
      exito: true,
      message: 'Asistencia ingresada exitosamente',
    });

  });

});



module.exports = router; // exporta este router para poder usarlo en server.js