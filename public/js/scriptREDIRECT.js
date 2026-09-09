// El evento load se dispara cuando una página web se ha cargado por completo (HTML + imágenes + CSS + scripts)
window.addEventListener('load', async () => {

  try {

    const response = await fetch('/obtener-usuarios', {
      method: 'GET'
    });

    const jsonResponse = await response.json();

    if (jsonResponse.exito) {

      let htmlTabla = `
        <table border="1">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Comentario</th>
          </tr>
      `;

      jsonResponse.data.forEach(usuario => {

        htmlTabla += `
          <tr>
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.apellido}</td>
            <td>${usuario.comentario}</td>
          </tr>
        `;

      });

      htmlTabla += '</table>';

      document.getElementById('tablaUsuarios').innerHTML = htmlTabla;

    }

    console.log("Response", jsonResponse);

  } catch (error) {

    console.log(error);

  }

});