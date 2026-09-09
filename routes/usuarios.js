//CAPA NEGOCIO
const express = require('express');
const router = express.Router();
const db = require('../db'); //importar
const bcrypt = require('bcrypt');


//----------------------------------------------------------------
//------------------ Verificar Usuario   -------------------------
//----------------------------------------------------------------
router.post('/login-comprobar', (request, response) => {

  console.log("Request desde el formulario:", request.body);

  const usuario = request.body.usuario;
  const clave = request.body.clave;

  // 1. Modificación: Buscar únicamente por usuario
  const sql = 'SELECT usuario, clave, rol FROM usuario WHERE usuario = ?';

  // 2. Modificación: Pasar solo el parámetro usuario
  db.query(sql, [usuario], async (err, respuesta) => {
    
    if (err) { 
      console.log('Error conexión:', err);
      return response.status(500).json({ exito: false }); // 3. Se añade return
    }

    // 4. Nueva validación para evitar errores si el usuario no existe en la BD
    if (respuesta.length === 0) {
      console.log('Usuario no encontrado');
      return response.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 5. Corrección de variables: usar 'respuesta' y 'clave'
    const hashGuardado = respuesta[0].clave;
    const esValida = await bcrypt.compare(clave, hashGuardado);

    if (esValida) {
      const rolresponse = respuesta[0].rol;

      if (rolresponse === 'administrador') {
        response.status(200).json({ exito: true, rol: 'administrador' });
      }
      else if (rolresponse === 'usuario') {
        response.status(200).json({ exito: true, rol: 'usuario' });
      }
    } else {
      console.log('Credenciales incorrectas');
      response.status(401).json({ message : 'Credenciales inválidas' });
    }
  });
});

//----------------------------------------------------------------
//------------------ Registro de usuario -------------------------
//----------------------------------------------------------------

router.post('/registro-usuario', async (request, response) => {

  //Revisa todo el request
  console.log("Request desde el formulario:", request.body);

  //Obtengo los datos que llegan desde la capa de presentacion
  const usuario = request.body.usuario;
  const clave = request.body.clave;
  const email = request.body.email;
  const numero = request.body.numero;

  const saltRounds = 10;

  try {
        // 1. Convertir la clave plana en un hash irreversible
        const claveHasheada = await bcrypt.hash(clave, saltRounds);

        // 2. Insertar en la tabla usando la variable encriptada (claveHasheada)
        const sqlInsert = `
            INSERT INTO usuario (usuario, clave, rol, email, numero) 
            VALUES (?, ?, 'usuario', ?, ?)
        `;

  //Lógica, validaciones, operaciones en backend, inteligencia
  //.....
  //.....

  //Setea los valores (nombre , apellido) como par ordenado a values (?,?) y ejecuta
  db.query(sqlInsert, [usuario, claveHasheada, email, numero], (err, respuesta) => {
    if (err) { //si existe error
      console.log('Error conexión:', err);
      return response.status(500).json({ exito: false }); //HTTP Response fallido
    }

    response.status(201).json({
      statusHTTP: 'OK',
      exito: true,
      message: 'Datos creados exitosamente'
    });

  });
  } catch (error) {
        response.status(500).json({ exito: false, message: 'Error al procesar la contraseña' });
    }

});

//----------------------------------------------------------------
// ---------------- ELIMINA UN USUARIO ESPECIFICO ---------------
//----------------------------------------------------------------
router.delete('/usuario/:id', (request, response) => {

  const id = request.params.id; //obtiene parametro id

  const sql = 'DELETE FROM usuario WHERE id_usuario = ?';

  db.query(sql, [id], (error, resultado) => {

    if (error) {
      return response.status(500).json({
        statusHTTP: 'INTERNAL_SERVER_ERROR',
        exito: false,
        message: 'Error al eliminar usuario'
      });
    }

    //usuario no encontrado
    if (resultado.affectedRows === 0) {
      return response.status(404).json({
        statusHTTP: 'NOT_FOUND',
        exito: false,
        message: 'Usuario no encontrado'
      });
    }


    //HTTP Response exitoso
    response.status(200).json({
      statusHTTP: 'OK',
      exito: true,
      message: 'Usuario eliminado exitosamente'
    });

  });

});

//----------------------------------------------------------------
// ------------ ACTUALIZA UNA NOTICIA ESPECIFICA -----------------
//----------------------------------------------------------------
router.put('/usuario/:id', (request, response) => {

  const id = request.params.id; //obtiene parametro id

  //Obtiene datos de la request
  const usuario     = request.body.usuario;
  const clave   = request.body.clave;
  const email = request.body.email;
  const numero = request.body.numero;


  const sql = `
    UPDATE usuario
    SET usuario = ?, clave = ?, email = ?, numero = ?
    WHERE id_usuario = ?
  `;

  db.query(sql, [usuario, clave, email, numero, id], (error) => {

    if (error) {

      console.log('Error conexión:', error); //uso interno

      return response.status(500).json({
        statusHTTP: 'INTERNAL_SERVER_ERROR',
        exito: false,
        message: 'Error al actualizar usuario'
      });
    }

    //HTTP Response exitoso
    response.status(200).json({
      statusHTTP: 'OK',
      exito: true,
      message: 'Usuario actualizado exitosamente'
    });

  });

});




/* //----------------------------------------------------------------
// ------------------ Lista todos los usuarios -------------------
//----------------------------------------------------------------
router.get('/obtener-usuarios', (request, response) => {

  //Query SELECT
  const sql = 'SELECT * FROM usuario';

  //Ejecuta la query
  db.query(sql, (err, resultados) => {
    if (err) { //si existe error
      console.log('Error conexión:', err);
      response.status(500).json({ exito: false }); //HTTP Response fallido
    }

    //HTTP Response exitoso
    response.status(200).json({
      statusHTTP: 'OK',
      exito: true,
      data: resultados
    });

  });
}); */



module.exports = router; // exporta este router para poder usarlo en server.js