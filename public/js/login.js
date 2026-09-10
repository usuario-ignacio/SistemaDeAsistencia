// ============================================================
// LOGIN.JS — Lógica de cliente para index.html
// Entrega: solo JavaScript. No se modificó ningún HTML ni backend.
// ============================================================

// --- Referencias a elementos que YA EXISTEN en index.html ---
const formularioLogin = document.querySelector('#loginForm');
const inputUsuario = document.querySelector('#correo'); // el id real en el HTML es "correo"
const inputClave = document.querySelector('#password');

// --- Ajuste necesario en runtime, sin tocar el HTML ---
// El input #correo tiene type="email" en el HTML, así que el navegador
// bloquea el submit si lo que se escribe no tiene formato de correo.
// Pero el backend (routes/usuarios.js -> /login-comprobar) autentica
// por columna `usuario`, NO por email. Si dejamos type="email", nadie
// podría loguearse con un nombre de usuario como "jose".
// Cambiamos el type a "text" por JS para que el formulario funcione
// con lo que el backend realmente espera.
inputUsuario.type = 'text';
inputUsuario.placeholder = 'Usuario'; // aviso visual de que en realidad es el usuario, no el correo

// --- Mensaje de error: no existe en el HTML original, se crea en runtime ---
const mensajeError = document.createElement('p');
mensajeError.style.color = '#dc3545';
mensajeError.style.margin = '0 0 10px';
formularioLogin.insertBefore(mensajeError, formularioLogin.querySelector('button'));

formularioLogin.addEventListener('submit', async (event) => {
  event.preventDefault(); // evita que el formulario recargue la página

  const usuario = inputUsuario.value.trim();
  const clave = inputClave.value;
  mensajeError.textContent = '';

  try {
    // El backend espera EXACTAMENTE { usuario, clave } en el body
    const response = await fetch('/login-comprobar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave })
    });

    const jsonResponse = await response.json();

    if (jsonResponse.exito) {
      // Guardamos lo que el backend SÍ devuelve hoy: { exito, rol }
      localStorage.setItem('rol', jsonResponse.rol || '');

      // Guardamos también el nombre de usuario tecleado, como respaldo,
      // por si alguna pantalla necesita mostrarlo (ej. "Bienvenido, jose")
      localStorage.setItem('usuario', usuario);

      // ⚠️ LIMITACIÓN DE BACKEND (solo documentada, no se resuelve aquí):
      // /login-comprobar actualmente NO devuelve "id_usuario" en su respuesta.
      // asistencia.js necesita ese id_usuario para registrar marcas, porque
      // la tabla `asistencia` lo exige como FOREIGN KEY obligatorio.
      // Como esta entrega es solo lógica de cliente, dejo esto listo para
      // cuando el backend agregue "id_usuario" a la respuesta del login:
      if (jsonResponse.id_usuario) {
        localStorage.setItem('id_usuario', jsonResponse.id_usuario);
      } else {
        console.warn(
          'El login no devolvió id_usuario. asistencia.js no podrá registrar marcas ' +
          'hasta que el backend incluya ese dato en la respuesta de /login-comprobar.'
        );
      }

      // El rol en la BD puede venir como 'admin' o 'administrador' según el registro;
      // usamos includes() para cubrir ambos sin depender de un valor exacto.
      const rol = (jsonResponse.rol || '').toLowerCase();
      if (rol.includes('admin')) {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'asistencia.html';
      }

    } else {
      mensajeError.textContent = jsonResponse.message || 'Credenciales inválidas';
    }

  } catch (error) {
    console.error(error);
    mensajeError.textContent = 'Error de conexión con el servidor';
  }
});
