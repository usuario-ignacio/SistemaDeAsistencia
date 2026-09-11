//CAPA NEGOCIO
const express = require('express');
const router = express.Router();
const db = require('../db');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit'); //importar


// ---- GENERAR REPORTE ASISTENCIA (QUERY PARAMS) ----
router.get('/reporte-asistencia', (request, response) => {
    
    const opcionesFecha = { 
        timeZone: 'America/Santiago', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    }; // Ej: '2026-09-01'

    const fecha = new Intl.DateTimeFormat('en-CA', opcionesFecha).format(new Date());
    
    // Se requiere el ID del usuario que genera el reporte para la tabla 'reporte'[cite: 1].
    // Si no se envía en la petición, por defecto asignamos el ID 3 (admin).
    const idAdmin = request.query.id_admin || 3; 

    // JOIN con la tabla usuario para obtener el nombre (usuario) del alumno[cite: 1]
    // Usamos DATE(a.fecha) por si tu columna incluye horas (TIMESTAMP)[cite: 1]
    const sqlSelect = `
        SELECT a.id_asistencia, a.fecha, a.tipo, a.marca, u.usuario 
        FROM asistencia a
        JOIN usuario u ON a.id_usuario = u.id_usuario
        WHERE DATE(a.fecha) = ?
    `;

    db.query(sqlSelect, [fecha], (error, resultados) => {
        if (error) {
            return response.status(500).json({
                statusHTTP: 'INTERNAL_SERVER_ERROR',
                exito: false,
                message: 'Error al consultar las asistencias'
            });
        }

        const nombreArchivo = `reporte_asistencia_${Date.now()}.pdf`;
        const rutaDestino = path.join(__dirname, 'reportes', nombreArchivo);

        const doc = new PDFDocument();
        const streamFisico = fs.createWriteStream(rutaDestino);
        
        doc.pipe(streamFisico);

        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Disposition', `inline; filename="${nombreArchivo}"`);
        doc.pipe(response);

        // --- DISEÑO DEL PDF ---
        doc.fontSize(18).text(`Reporte de Asistencias del día: ${fecha}`, { align: 'center' });
        doc.moveDown();
        
        // Iteramos usando las columnas de tu esquema[cite: 1]
        resultados.forEach(registro => {
            doc.fontSize(12).text(
                `ID: ${registro.id_asistencia} | Usuario: ${registro.usuario} | Marca: ${registro.marca} | Tipo: ${registro.tipo}`
            );
        });
        
        doc.end();

        streamFisico.on('finish', () => {
            // Inserción adaptada a la estructura de la tabla reporte[cite: 1]
            // Usamos NOW() para la fecha y pasamos el tipo de reporte estático[cite: 1]
            const sqlInsert = `
                INSERT INTO reporte (nombre_archivo, fecha, tipo, id_usuario) 
                VALUES (?, NOW(), ?, ?)
            `;
            
            const tipoReporte = 'Asistencia Diaria';

            db.query(sqlInsert, [nombreArchivo, tipoReporte, idAdmin], (errorInsert) => {
                if (errorInsert) {
                    console.error('Error al insertar el reporte en la BD:', errorInsert);
                } else {
                    console.log(`Reporte ${nombreArchivo} guardado exitosamente en BD.`);
                }
            });
        });
    });
});

// ---- GENERAR REPORTE ASISTENCIA (QUERY PARAMS) ----
router.get('/reporte-atrasos', (request, response) => {
    
    const opcionesFecha = { 
        timeZone: 'America/Santiago', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    }; // Ej: '2026-09-01'

    const fecha = new Intl.DateTimeFormat('en-CA', opcionesFecha).format(new Date());
    
    // Se requiere el ID del usuario que genera el reporte para la tabla 'reporte'[cite: 1].
    // Si no se envía en la petición, por defecto asignamos el ID 3 (admin).
    const idAdmin = request.query.id_admin || 3; 

    // JOIN con la tabla usuario para obtener el nombre (usuario) del alumno[cite: 1]
    // Usamos DATE(a.fecha) por si tu columna incluye horas (TIMESTAMP)[cite: 1]
    const sqlSelect = `
        SELECT a.id_asistencia, a.fecha, a.tipo, a.marca, u.usuario 
        FROM asistencia a
        JOIN usuario u ON a.id_usuario = u.id_usuario
        WHERE DATE(a.fecha) = ? AND a.tipo = 'Atraso'
    `;

    db.query(sqlSelect, [fecha], (error, resultados) => {
        if (error) {
            return response.status(500).json({
                statusHTTP: 'INTERNAL_SERVER_ERROR',
                exito: false,
                message: 'Error al consultar los atrasos'
            });
        }

        const nombreArchivo = `reporte_atrasos_${Date.now()}.pdf`;
        const rutaDestino = path.join(__dirname, 'reportes', nombreArchivo);

        const doc = new PDFDocument();
        const streamFisico = fs.createWriteStream(rutaDestino);
        
        doc.pipe(streamFisico);

        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Disposition', `inline; filename="${nombreArchivo}"`);
        doc.pipe(response);

        // --- DISEÑO DEL PDF ---
        doc.fontSize(18).text(`Reporte de Atrasos del día: ${fecha}`, { align: 'center' });
        doc.moveDown();
        
        // Iteramos usando las columnas de tu esquema[cite: 1]
        resultados.forEach(registro => {
            doc.fontSize(12).text(
                `ID: ${registro.id_asistencia} | Usuario: ${registro.usuario} | Fecha: ${registro.fecha} | Tipo: ${registro.tipo}`
            );
        });
        
        doc.end();

        streamFisico.on('finish', () => {
            // Inserción adaptada a la estructura de la tabla reporte[cite: 1]
            // Usamos NOW() para la fecha y pasamos el tipo de reporte estático[cite: 1]
            const sqlInsert = `
                INSERT INTO reporte (nombre_archivo, fecha, tipo, id_usuario) 
                VALUES (?, NOW(), ?, ?)
            `;
            
            const tipoReporte = 'Atrasos';

            db.query(sqlInsert, [nombreArchivo, tipoReporte, idAdmin], (errorInsert) => {
                if (errorInsert) {
                    console.error('Error al insertar el reporte en la BD:', errorInsert);
                } else {
                    console.log(`Reporte ${nombreArchivo} guardado exitosamente en BD.`);
                }
            });
        });
    });
});

router.get('/reporte-anticipados', (request, response) => {
    
    const opcionesFecha = { 
        timeZone: 'America/Santiago', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    }; // Ej: '2026-09-01'

    const fecha = new Intl.DateTimeFormat('en-CA', opcionesFecha).format(new Date());
    
    // Se requiere el ID del usuario que genera el reporte para la tabla 'reporte'[cite: 1].
    // Si no se envía en la petición, por defecto asignamos el ID 3 (admin).
    const idAdmin = request.query.id_admin || 3; 

    // JOIN con la tabla usuario para obtener el nombre (usuario) del alumno[cite: 1]
    // Usamos DATE(a.fecha) por si tu columna incluye horas (TIMESTAMP)[cite: 1]
    const sqlSelect = `
        SELECT a.id_asistencia, a.fecha, a.tipo, a.marca, u.usuario 
        FROM asistencia a
        JOIN usuario u ON a.id_usuario = u.id_usuario
        WHERE DATE(a.fecha) = ? AND a.tipo = 'Anticipado'
    `;

    db.query(sqlSelect, [fecha], (error, resultados) => {
        if (error) {
            return response.status(500).json({
                statusHTTP: 'INTERNAL_SERVER_ERROR',
                exito: false,
                message: 'Error al consultar los anticipados'
            });
        }

        const nombreArchivo = `reporte_anticipados_${Date.now()}.pdf`;
        const rutaDestino = path.join(__dirname, 'reportes', nombreArchivo);

        const doc = new PDFDocument();
        const streamFisico = fs.createWriteStream(rutaDestino);
        
        doc.pipe(streamFisico);

        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Disposition', `inline; filename="${nombreArchivo}"`);
        doc.pipe(response);

        // --- DISEÑO DEL PDF ---
        doc.fontSize(18).text(`Reporte de Anticipados del día: ${fecha}`, { align: 'center' });
        doc.moveDown();
        
        // Iteramos usando las columnas de tu esquema[cite: 1]
        resultados.forEach(registro => {
            doc.fontSize(12).text(
                `ID: ${registro.id_asistencia} | Usuario: ${registro.usuario} | Fecha: ${registro.fecha} | Tipo: ${registro.tipo}`
            );
        });
        
        doc.end();

        streamFisico.on('finish', () => {
            // Inserción adaptada a la estructura de la tabla reporte[cite: 1]
            // Usamos NOW() para la fecha y pasamos el tipo de reporte estático[cite: 1]
            const sqlInsert = `
                INSERT INTO reporte (nombre_archivo, fecha, tipo, id_usuario) 
                VALUES (?, NOW(), ?, ?)
            `;
            
            const tipoReporte = 'Anticipados';

            db.query(sqlInsert, [nombreArchivo, tipoReporte, idAdmin], (errorInsert) => {
                if (errorInsert) {
                    console.error('Error al insertar el reporte en la BD:', errorInsert);
                } else {
                    console.log(`Reporte ${nombreArchivo} guardado exitosamente en BD.`);
                }
            });
        });
    });
});

router.get('/reporte-inasistencia', (request, response) => {
    
    const opcionesFecha = { 
        timeZone: 'America/Santiago', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    }; // Ej: '2026-09-01'

    const fecha = new Intl.DateTimeFormat('en-CA', opcionesFecha).format(new Date());
    
    // Se requiere el ID del usuario que genera el reporte para la tabla 'reporte'[cite: 1].
    // Si no se envía en la petición, por defecto asignamos el ID 3 (admin).
    const idAdmin = request.query.id_admin || 3; 

    // JOIN con la tabla usuario para obtener el nombre (usuario) del alumno[cite: 1]
    // Usamos DATE(a.fecha) por si tu columna incluye horas (TIMESTAMP)[cite: 1]
    const sqlSelect = `
        SELECT a.id_asistencia, a.fecha, a.tipo, a.marca, u.usuario 
        FROM asistencia a
        JOIN usuario u ON a.id_usuario = u.id_usuario
        WHERE DATE(a.fecha) = ? AND a.tipo = 'Inasistencia'
    `;

    db.query(sqlSelect, [fecha], (error, resultados) => {
        if (error) {
            return response.status(500).json({
                statusHTTP: 'INTERNAL_SERVER_ERROR',
                exito: false,
                message: 'Error al consultar las inasistencias'
            });
        }

        const nombreArchivo = `reporte_inasistencias_${Date.now()}.pdf`;
        const rutaDestino = path.join(__dirname, 'reportes', nombreArchivo);

        const doc = new PDFDocument();
        const streamFisico = fs.createWriteStream(rutaDestino);
        
        doc.pipe(streamFisico);

        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Disposition', `inline; filename="${nombreArchivo}"`);
        doc.pipe(response);

        // --- DISEÑO DEL PDF ---
        doc.fontSize(18).text(`Reporte de Inasistencias del día: ${fecha}`, { align: 'center' });
        doc.moveDown();
        
        // Iteramos usando las columnas de tu esquema[cite: 1]
        resultados.forEach(registro => {
            doc.fontSize(12).text(
                `ID: ${registro.id_asistencia} | Usuario: ${registro.usuario} | Fecha: ${registro.fecha} | Tipo: ${registro.tipo}`
            );
        });
        
        doc.end();

        streamFisico.on('finish', () => {
            // Inserción adaptada a la estructura de la tabla reporte[cite: 1]
            // Usamos NOW() para la fecha y pasamos el tipo de reporte estático[cite: 1]
            const sqlInsert = `
                INSERT INTO reporte (nombre_archivo, fecha, tipo, id_usuario) 
                VALUES (?, NOW(), ?, ?)
            `;
            
            const tipoReporte = 'Inasistencias';

            db.query(sqlInsert, [nombreArchivo, tipoReporte, idAdmin], (errorInsert) => {
                if (errorInsert) {
                    console.error('Error al insertar el reporte en la BD:', errorInsert);
                } else {
                    console.log(`Reporte ${nombreArchivo} guardado exitosamente en BD.`);
                }
            });
        });
    });
});

// ---- NUEVO ENDPOINT: OBTENER DATOS EN JSON PARA LAS TABLAS DEL DASHBOARD ----
router.get('/datos-json', (request, response) => {
    
    const tipo = request.query.tipo; // Recibirá 'Atraso', 'Anticipado' o 'Inasistencia'
    
    const opcionesFecha = { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' };
    const fecha = new Intl.DateTimeFormat('en-CA', opcionesFecha).format(new Date());

    const sqlSelect = `
        SELECT u.usuario, a.fecha, a.marca 
        FROM asistencia a
        JOIN usuario u ON a.id_usuario = u.id_usuario
        WHERE DATE(a.fecha) = ? AND a.tipo = ?
    `;

    db.query(sqlSelect, [fecha, tipo], (error, resultados) => {
        if (error) {
            return response.status(500).json({ exito: false, message: 'Error de BD' });
        }
        response.status(200).json({ exito: true, data: resultados });
    });
});


module.exports = router; // exporta este router para poder usarlo en server.js