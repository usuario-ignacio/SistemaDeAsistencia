//Almacena el formulario para manipularlo
const btnListarChild = document.querySelector('#btnListarCardAPPENDCHILD');

btnListarChild.addEventListener('click', async (event) => {
    event.preventDefault();

    try {

    const response = await fetch('/obtener-usuarios', {
        method: 'GET'
    });

    const jsonResponse = await response.json();

    if (jsonResponse.exito) {

        const contenedor = document.getElementById('usuariosCardAPPENDCHILD');

        jsonResponse.data.forEach(usuario => {

            // Card principal
            const card = document.createElement('div');
            card.style.backgroundColor = '#2d3748';
            card.style.color = 'white';
            card.style.padding = '15px';
            card.style.margin = '10px';
            card.style.borderRadius = '10px';
            card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
            
            // Nombre
            const nombre = document.createElement('h3');
            nombre.textContent = `${usuario.nombre} ${usuario.apellido}`;
            nombre.style.marginTop = '0';
            nombre.style.color = '#63b3ed';
            
            // ID
            const id = document.createElement('p');
            id.textContent = `ID: ${usuario.id}`;

            // Comentario
            const comentario = document.createElement('p');
            comentario.textContent = usuario.comentario;

            // Construcción del DOM
            card.appendChild(nombre);
            card.appendChild(id);
            card.appendChild(comentario);

            contenedor.appendChild(card);
        });
    }
    console.log("Response", jsonResponse);
    } catch(error) {
    console.error(error);
    }


});