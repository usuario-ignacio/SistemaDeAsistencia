// ============================================================
// ASISTENCIA.JS — Lógica de cliente para asistencia.html
// Entrega: solo JavaScript. No se modificó ningún HTML ni backend.
// ============================================================

// --- Referencias a elementos que YA EXISTEN en asistencia.html ---
const btnEntrada = document.querySelector('#btnEntrada');
const btnSalida = document.querySelector('#btnSalida');
const btnCerrarSesion = document.querySelector('#btnCerrarSesion');

// --- Mensaje de resultado: no existe en el HTML original, se crea en runtime ---
const mensaje = document.createElement('p');
mensaje.style.fontWeight = 'bold';
mensaje.style.marginTop = '20px';
document.body.appendChild(mensaje);

// --- Sesión guardada por login.js ---
const idUsuario = localStorage.getItem('id_usuario');

// ⚠️ LIMITACIÓN DE BACKEND (heredada de login.js, documentada aquí también):
// Si /login-comprobar todavía no devuelve id_usuario, esta variable llega vacía.
// En vez de mandar una petición rota al backend (que igual fallaría, porque
// `asistencia` exige id_usuario como NOT NULL), avisamos claramente en pantalla.
if (!idUsuario) {
  mensaje.style.color = '#dc3545';
  mensaje.textContent = 'No se pudo identificar tu sesión (falta id_usuario del login). Avisa al equipo de backend.';
}

// --- Reglas de horario para decidir el "tipo" de marca ---
// Viven en el cliente porque ni el backend ni el HTML las calculan hoy.
// Los reportes del panel admin filtran por tipo = 'Atraso' / 'Anticipado',
// así que hay que enviar exactamente esos valores cuando corresponda.
const HORA_LIMITE_ENTRADA = { horas: 9, minutos: 30 };
const HORA_LIMITE_SALIDA = { horas: 17, minutos: 30 };

function calcularTipo(accion) {
  const ahora = new Date();
  const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();

  if (accion === 'entrada') {
    const limite = HORA_LIMITE_ENTRADA.horas * 60 + HORA_LIMITE_ENTRADA.minutos;
    return minutosActuales > limite ? 'Atraso' : 'Entrada';
  } else {
    const limite = HORA_LIMITE_SALIDA.horas * 60 + HORA_LIMITE_SALIDA.minutos;
    return minutosActuales < limite ? 'Anticipado' : 'Salida';
  }
}

async function registrarAsistencia(accion) {
  if (!idUsuario) return; // ya se avisó arriba, no seguimos con una petición rota

  const tipo = calcularTipo(accion);
  const marca = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

  try {
    // El backend espera EXACTAMENTE { tipo, marca, id_usuario } (POST /asistencia)
    const response = await fetch('/asistencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, marca, id_usuario: idUsuario })
    });

    const jsonResponse = await response.json();

    if (jsonResponse.exito) {
      mensaje.style.color = '#28a745';
      mensaje.textContent = `Registrado: ${tipo} a las ${marca}`;
    } else {
      mensaje.style.color = '#dc3545';
      mensaje.textContent = jsonResponse.message || 'No se pudo registrar la asistencia';
    }

  } catch (error) {
    console.error(error);
    mensaje.style.color = '#dc3545';
    mensaje.textContent = 'Error de conexión con el servidor';
  }
}

btnEntrada.addEventListener('click', () => registrarAsistencia('entrada'));
btnSalida.addEventListener('click', () => registrarAsistencia('salida'));

btnCerrarSesion.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});
