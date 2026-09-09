const btnListarAppend = document.querySelector('#btnListarTableAPPENDCHILD');

btnListarAppend.addEventListener('click', async (event) => {
  event.preventDefault();

  try {

    const response = await fetch('/obtener-usuarios', {
      method: 'GET'
    });

    const jsonResponse = await response.json();

    if (jsonResponse.exito) {

      const contenedor = document.getElementById('usuariosTableAPPENDCHILD');


      // Crear tabla
      const tabla = document.createElement('table');
      tabla.border = '1';

      // Crear encabezado
      const filaHeader = document.createElement('tr');
      const headers = ['ID', 'Nombre', 'Apellido', 'Comentario'];

      headers.forEach(texto => {
        const th = document.createElement('th');
        th.textContent = texto;
        filaHeader.appendChild(th);
      });

      tabla.appendChild(filaHeader);

      
      // Crear filas de datos
      jsonResponse.data.forEach(usuario => {

        const fila = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = usuario.id;

        const tdNombre = document.createElement('td');
        tdNombre.textContent = usuario.nombre;

        const tdApellido = document.createElement('td');
        tdApellido.textContent = usuario.apellido;

        const tdComentario = document.createElement('td');
        tdComentario.textContent = usuario.comentario;

        fila.appendChild(tdId);
        fila.appendChild(tdNombre);
        fila.appendChild(tdApellido);
        fila.appendChild(tdComentario);

        tabla.appendChild(fila);
      });

      contenedor.appendChild(tabla);

    }

    console.log("Response", jsonResponse);

  } catch (error) {
    console.log(error);
  }

});