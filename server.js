//Configurar Express para servir el frontend
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
// Indica que solo estos archivos son publicos o del lado del "Cliente"
 app.use(express.static(path.join(__dirname, 'public'))); 
 app.use(express.urlencoded({ extended: true }));

// Rutas
const usuariosRoutes = require('./routes/usuarios');
const asistenciaRoutes = require('./routes/asistencia');
const reporte = require('./routes/reporte');

app.use(usuariosRoutes);
app.use(asistenciaRoutes);
app.use(reporte);

//Muestra la ruta y el puerto escuchando
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});