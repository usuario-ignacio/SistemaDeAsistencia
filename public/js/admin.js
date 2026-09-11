// ============================================================
// ADMIN.JS — Lógica de cliente para admin.html
// Entrega: solo JavaScript. No se modificó ningún HTML ni backend.
// ============================================================

// --- Protección de la página (SOLO en el cliente) ---
// Esto evita que alguien sin rol admin vea la pantalla por accidente,
// pero NO reemplaza seguridad real: los endpoints del backend deberían
// validar sesión/token del lado del servidor. Eso está fuera de esta
// entrega porque es lógica de backend, no de cliente.
const rolSesion = (localStorage.getItem('rol') || '').toLowerCase();
if (!rolSesion.includes('admin')) {
  window.location.href = 'index.html';
}

// ============================================================
// SECCIÓN 1: GESTIÓN DE USUARIOS
// ============================================================

const seccionUsuarios = document.querySelector('#gestionUsuarios');
const inputId = document.querySelector('#idUsuario');
const inputCorreo = document.querySelector('#correoUsuario');
const inputClave = document.querySelector('#passUsuario');
const btnCrear = document.querySelector('.btn-crear');
const btnModificar = document.querySelector('.btn-modificar');
const btnEliminar = document.querySelector('.btn-eliminar');



const inputNombreUsuario = document.querySelector('#nombreUsuario');
const inputNumero = document.querySelector('#numeroUsuario');

// Mensaje de resultado: tampoco existe en el HTML original, se crea en runtime
const mensajeAdmin = document.createElement('p');
mensajeAdmin.style.fontWeight = 'bold';
seccionUsuarios.insertBefore(mensajeAdmin, btnCrear);

function mostrarMensajeAdmin(texto, exito) {
  mensajeAdmin.style.color = exito ? '#28a745' : '#dc3545';
  mensajeAdmin.textContent = texto;
}

function limpiarFormularioUsuario() {
  inputId.value = '';
  inputNombreUsuario.value = '';
  inputCorreo.value = '';
  inputClave.value = '';
  inputNumero.value = '';
}

btnCrear.addEventListener('click', async () => {
  const usuario = inputNombreUsuario.value.trim();
  const email = inputCorreo.value.trim();
  const clave = inputClave.value;
  const numero = inputNumero.value.trim();

  if (!usuario || !email || !clave || !numero) {
    return mostrarMensajeAdmin('Completa usuario, correo, contraseña y número.', false);
  }

  try {
    // El backend espera { usuario, clave, email, numero } (POST /registro-usuario)
    const response = await fetch('/registro-usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave, email, numero })
    });
    const jsonResponse = await response.json();
    mostrarMensajeAdmin(
      jsonResponse.exito ? 'Usuario creado exitosamente.' : (jsonResponse.message || 'No se pudo crear el usuario.'),
      jsonResponse.exito
    );
    if (jsonResponse.exito) limpiarFormularioUsuario();
  } catch (error) {
    console.error(error);
    mostrarMensajeAdmin('Error de conexión con el servidor.', false);
  }
});

btnModificar.addEventListener('click', async () => {
  const id = inputId.value.trim();
  const usuario = inputNombreUsuario.value.trim();
  const email = inputCorreo.value.trim();
  const clave = inputClave.value;
  const numero = inputNumero.value.trim();

  if (!id) return mostrarMensajeAdmin('Ingresa el ID del usuario a modificar.', false);

  try {
    // PUT /usuario/:id espera { usuario, clave, email, numero }
    const response = await fetch(`/usuario/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave, email, numero })
    });
    const jsonResponse = await response.json();
    mostrarMensajeAdmin(
      jsonResponse.exito ? 'Usuario actualizado exitosamente.' : (jsonResponse.message || 'No se pudo actualizar el usuario.'),
      jsonResponse.exito
    );
    if (jsonResponse.exito) limpiarFormularioUsuario();
  } catch (error) {
    console.error(error);
    mostrarMensajeAdmin('Error de conexión con el servidor.', false);
  }
});

btnEliminar.addEventListener('click', async () => {
  const id = inputId.value.trim();
  if (!id) return mostrarMensajeAdmin('Ingresa el ID del usuario a eliminar.', false);

  try {
    // DELETE /usuario/:id
    const response = await fetch(`/usuario/${id}`, { method: 'DELETE' });
    const jsonResponse = await response.json();
    mostrarMensajeAdmin(
      jsonResponse.exito ? 'Usuario eliminado exitosamente.' : (jsonResponse.message || 'No se pudo eliminar el usuario.'),
      jsonResponse.exito
    );
    if (jsonResponse.exito) limpiarFormularioUsuario();
  } catch (error) {
    console.error(error);
    mostrarMensajeAdmin('Error de conexión con el servidor.', false);
  }
});

// ============================================================
// SECCIÓN 2: REPORTES (Atrasos / Salidas Anticipadas / Inasistencias)
// ============================================================

const reportesConfig = [
  { idSeccion: 'reporteAtrasos', idTabla: 'tablaAtrasos', endpointPdf: '/reporte-atrasos', tipoBD: 'Atraso' },
  { idSeccion: 'reporteSalidas', idTabla: 'tablaSalidas', endpointPdf: '/reporte-anticipados', tipoBD: 'Anticipado' },
  { idSeccion: 'reporteInasistencias', idTabla: 'tablaInasistencias', endpointPdf: '/reporte-inasistencia', tipoBD: 'Inasistencia' }
];

// Función para obtener los datos JSON y pintar la tabla
async function cargarTablaReporte(config) {
  const tbody = document.querySelector(`#${config.idTabla}`);
  tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Cargando registros de hoy...</td></tr>';

  try {
    // Llama al nuevo endpoint que creamos en reporte.js
    const response = await fetch(`/datos-json?tipo=${config.tipoBD}`);
    const jsonResponse = await response.json();

    if (jsonResponse.exito) {
      tbody.innerHTML = ''; // Limpiamos el mensaje de carga
      
      if (jsonResponse.data.length === 0) {
         tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No hay registros de este tipo hoy.</td></tr>';
         return;
      }

      // Rellenamos la tabla iterando sobre los datos
      jsonResponse.data.forEach(registro => {
        const fila = document.createElement('tr');
        
        // Adaptar las columnas según la tabla (Inasistencia tiene 2 columnas en tu HTML, las otras 3)
        if (config.tipoBD === 'Inasistencia') {
            fila.innerHTML = `
                <td>${registro.usuario}</td>
                <td>Falta registrada hoy</td>
            `;
        } else {
            fila.innerHTML = `
                <td>${registro.usuario}</td>
                <td>1 (Hoy)</td>
                <td>${registro.marca}</td>
            `;
        }
        tbody.appendChild(fila);
      });
    }
  } catch (error) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:red;">Error al cargar datos del servidor.</td></tr>';
  }
}

// 1. Configurar los botones de descarga de PDF al final de cada tabla
reportesConfig.forEach((config) => {
  const seccion = document.querySelector(`#${config.idSeccion}`);
  
  const botonPdf = document.createElement('button');
  botonPdf.className = 'btn-action btn-crear';
  botonPdf.textContent = `Descargar PDF de ${config.tipoBD}s`;
  botonPdf.style.marginTop = '15px';
  
  // Al hacer clic, abre la ruta antigua para descargar el PDF generado por pdfkit
  botonPdf.addEventListener('click', () => {
    window.open(config.endpointPdf, '_blank'); 
  });
  
  seccion.appendChild(botonPdf);
});

// 2. Escuchar los clics en el menú lateral de admin.html para cargar la tabla
document.querySelectorAll('.sidebar button').forEach(boton => {
  boton.addEventListener('click', () => {
    const action = boton.getAttribute('onclick');
    if (action && action.includes('reporteAtrasos')) cargarTablaReporte(reportesConfig[0]);
    if (action && action.includes('reporteSalidas')) cargarTablaReporte(reportesConfig[1]);
    if (action && action.includes('reporteInasistencias')) cargarTablaReporte(reportesConfig[2]);
  });
});

// ============================================================
// SECCIÓN 3: CERRAR SESIÓN
// ============================================================
document.querySelector('.btn-cerrar-sesion').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'login.html';
});
