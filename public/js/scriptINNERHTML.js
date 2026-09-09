//Almacena el formulario para manipularlo
const btnListarInner = document.querySelector('#btnListarINNERHTML');

btnListarInner.addEventListener('click', async (event) => {
  event.preventDefault();

  try {

    const response = await fetch('/obtener-usuarios', { //endpoint obtener-usuarios
      method:   'GET',  //metodo HTTP
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
      document.getElementById('tablaUsuariosINNERHTML').innerHTML = htmlTabla;
    }

    console.log("Response", jsonResponse);

  } catch (error) {
    console.log(error);
  }


});