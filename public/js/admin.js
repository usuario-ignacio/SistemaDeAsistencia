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

// ⚠️ El HTML original de #gestionUsuarios NO tiene inputs para "usuario"
// (nombre de usuario) ni "numero", pero el backend los exige en
// /registro-usuario y PUT /usuario/:id. Como no debo modificar el HTML,
// los creo en tiempo de ejecución (JS puro, con innerHTML) y los inserto
// justo antes del botón "Crear Usuario". Esto NO cambia el archivo .html,
// solo agrega elementos al DOM cuando la página ya cargó.
function crearGrupoInput(id, labelTexto, placeholder) {
  const grupo = document.createElement('div');
  grupo.className = 'form-group';
  grupo.innerHTML = `
    <label for="${id}">${labelTexto}:</label>
    <input type="text" id="${id}" placeholder="${placeholder}">
  `;
  return grupo;
}

const grupoNombreUsuario = crearGrupoInput('nombreUsuarioJS', 'Nombre de Usuario', 'Ej. jperez');
const grupoNumero = crearGrupoInput('numeroUsuarioJS', 'Número de Contacto', 'Ej. 912345678');
seccionUsuarios.insertBefore(grupoNombreUsuario, btnCrear);
seccionUsuarios.insertBefore(grupoNumero, btnCrear);

const inputNombreUsuario = document.querySelector('#nombreUsuarioJS');
const inputNumero = document.querySelector('#numeroUsuarioJS');

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
//
// ⚠️ LIMITACIÓN DE BACKEND (solo documentada, no se resuelve aquí):
// Los únicos endpoints de reportes que existen (routes/reporte.js:
// /reporte-atrasos, /reporte-anticipados, /reporte-inasistencia)
// generan y devuelven un archivo PDF, no JSON. Un fetch() de cliente
// no puede tomar un PDF binario y pintarlo como filas de tabla —
// haría falta un endpoint que devuelva { data: [...] }, que no existe
// y no me corresponde crear en esta entrega (solo lógica de cliente).
//
// Como alternativa 100% de cliente, dejo un aviso dentro de cada tabla
// y agrego un botón "Descargar Reporte PDF" que abre el PDF que el
// backend ya sabe generar.

const reportesConfig = [
  { idSeccion: 'reporteAtrasos', idTabla: 'tablaAtrasos', endpoint: '/reporte-atrasos', columnas: 3 },
  { idSeccion: 'reporteSalidas', idTabla: 'tablaSalidas', endpoint: '/reporte-anticipados', columnas: 3 },
  { idSeccion: 'reporteInasistencias', idTabla: 'tablaInasistencias', endpoint: '/reporte-inasistencia', columnas: 2 }
];

reportesConfig.forEach(({ idSeccion, idTabla, endpoint, columnas }) => {
  const seccion = document.querySelector(`#${idSeccion}`);
  const tbody = document.querySelector(`#${idTabla}`);

  // Fila explicativa dentro de la tabla (por qué no hay filas de datos reales)
  const fila = document.createElement('tr');
  const celda = document.createElement('td');
  celda.colSpan = columnas;
  celda.textContent = 'Este reporte se genera como PDF (no hay endpoint en JSON todavía). Usa el botón de abajo para descargarlo.';
  fila.appendChild(celda);
  tbody.appendChild(fila);

  // Botón de descarga, creado en runtime
  const botonPdf = document.createElement('button');
  botonPdf.className = 'btn-action btn-crear';
  botonPdf.textContent = 'Descargar Reporte PDF';
  botonPdf.style.marginTop = '15px';
  botonPdf.addEventListener('click', () => {
    window.open(endpoint, '_blank'); // el backend ya genera el PDF en este endpoint
  });
  seccion.appendChild(botonPdf);
});

// ============================================================
// SECCIÓN 3: CERRAR SESIÓN
// ============================================================
document.querySelector('.btn-cerrar-sesion').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});
