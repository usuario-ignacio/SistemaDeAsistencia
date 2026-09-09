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

/* 
//----------------------------------------------------------------
// ------------------ LISTAR TODAS LAS NOTICIAS ------------------
//----------------------------------------------------------------
router.get('/obtener-noticias', (request, response) => {

  //Query SELECT
  const sql = 'SELECT * FROM noticia';

  //Ejecuta la query
  db.query(sql, (err, resultados) => {
    if (err) { //si existe error
      console.log('Error conexión:', err);
      return response.status(500).json({
        statusHTTP: 'INTERNAL_SERVER_ERROR',
        exito: false,
        message: 'Error al obtener noticias'
      });
    }
    
    //HTTP Response exitoso
    response.status(200).json({ 
      statusHTTP: 'OK',
      exito: true, 
      data: resultados
    });

  });
});


//----------------------------------------------------------------
// ---------------- MOSTRAR NOTICIA POR ID  ----------------------
//----------------------------------------------------------------
router.get('/noticia/:id', (request, response) => {

  const id = request.params.id;

  const sql = 'SELECT * FROM noticia WHERE id_noticia = ?';

  db.query(sql, [id], (error, resultados) => {

    if (error) {
      return response.status(500).json({
        statusHTTP: 'INTERNAL_SERVER_ERROR',
        exito: false,
        message: 'Error al buscar noticia'
      });
    }


    //Usuario no encontrado
    if (resultados.length === 0) {
      return response.status(404).json({
        statusHTTP: 'NOT_FOUND',
        exito: false,
        message: 'Noticia no encontrada'
      });
    }

    response.status(200).json({
      statusHTTP: 'OK',
      exito: true,
      message: 'Noticia encontrada exitosamente',
      data: resultados
    });

  });

});


//----------------------------------------------------------------
// ----- LISTAR NOTICIAS POR AUTOR (QUERY PARAMS) ----------------
//----------------------------------------------------------------
router.get('/noticias', (request, response) => {

  const autor = request.query.autor; //Recibe query params

  const sql = 'SELECT * FROM noticia WHERE autor = ?';
  //const sql = 'SELECT * FROM noticia WHERE autor = ? limit 1';

  db.query(sql, [autor], (error, resultados) => {

    if (error) {
      return response.status(500).json({
        statusHTTP: 'INTERNAL_SERVER_ERROR',
        exito: false,
        message: 'Error al obtener noticia'
      });
    }

    //HTTP Response exitoso
    response.status(200).json({
      statusHTTP: 'OK',
      exito: true,
      message: 'Noticia obtenida exitosamente',
      data: resultados
    });
  });
});


//----------------------------------------------------------------
// ---------------- ELIMINA UNA NOTICIA ESPECIFICA ---------------
//----------------------------------------------------------------
router.delete('/noticia/:id', (request, response) => {

  const id = request.params.id; //obtiene parametro id

  const sql = 'DELETE FROM noticia WHERE id_noticia = ?';

  db.query(sql, [id], (error, resultado) => {

    if (error) {
      return response.status(500).json({
        statusHTTP: 'INTERNAL_SERVER_ERROR',
        exito: false,
        message: 'Error al eliminar noticia'
      });
    }

    //Noticia no encontrada
    if (resultado.affectedRows === 0) {
      return response.status(404).json({
        statusHTTP: 'NOT_FOUND',
        exito: false,
        message: 'Noticia no encontrada'
      });
    }


    //HTTP Response exitoso
    response.status(200).json({
      statusHTTP: 'OK',
      exito: true,
      message: 'Noticia eliminada exitosamente'
    });

  });

});

//----------------------------------------------------------------
// ------------ ACTUALIZA UNA NOTICIA ESPECIFICA -----------------
//----------------------------------------------------------------
router.put('/noticia/:id', (request, response) => {

  const id = request.params.id; //obtiene parametro id

  //Obtiene datos de la request
  const titulo     = request.body.titulo;
  const descripcion   = request.body.descripcion;
  const imagen = request.body.imagen;
  const autor = request.body.autor;
  const fecha = request.body.fecha;

  const sql = `
    UPDATE noticia
    SET titulo = ?, descripcion = ?, imagen = ?, autor = ?, fecha = ?
    WHERE id_noticia = ?
  `;

  db.query(sql, [titulo, descripcion, imagen, autor, fecha, id], (error) => {

    if (error) {

      console.log('Error conexión:', error); //uso interno

      return response.status(500).json({
        statusHTTP: 'INTERNAL_SERVER_ERROR',
        exito: false,
        message: 'Error al actualizar noticia'
      });
    }

    //HTTP Response exitoso
    response.status(200).json({
      statusHTTP: 'OK',
      exito: true,
      message: 'Noticia actualizada exitosamente'
    });

  });

});

//----------------------------------------------------------------
//------------- REGISTRA UN USUARIO REDIRECCION ------------------
//----------------------------------------------------------------
//Agregar linea de abajo en SERVER.JS
//app.use(express.urlencoded({ extended: true }));
//se debe agregar atributo name en el formulario
router.post('/noticia-redirect', (request, response) => {

  const titulo     = request.body.titulo;
  const descripcion   = request.body.descripcion;
  const imagen = request.body.imagen;
  const autor = request.body.autor;
  const fecha = request.body.fecha;

  //Validación simple
  if (!titulo || !descripcion || !imagen || !autor || !fecha) {
    return response.status(400).send(`
        <h1>Faltan campos obligatorios</h1>
      `);
  }

  const sql = `
    INSERT INTO noticia (titulo, descripcion, imagen, autor, fecha)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [titulo, descripcion, imagen, autor, fecha], (error, resultado) => {

    if (error) {
      console.log('Error conexión:', err);

      return response.status(500).send(`
        <h1>Error al obtener noticias</h1>
      `);
    }

    response.redirect(302, '/noticias.html');
  });

}); */


module.exports = router; // exporta este router para poder usarlo en server.js