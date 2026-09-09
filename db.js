const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'etapa_uno'
});

db.connect((err) => {
  if (err) {
    console.log('Error conexión');
  } else {
    console.log('Conectado a MySQL: http://localhost/phpmyadmin/');
  }
});

module.exports = db;