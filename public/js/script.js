//CAPA PRESENTACIÓN

//Almacena el formulario para manipularlo
const formulario = document.querySelector('#miFormulario');

//----------------------------------------------------------------------------
//--- 0. Logica del evento submit (presionar boton enviar del formulario) ----
//----------------------------------------------------------------------------
//
// async: viene de asincronico, que es algo que ocurre sin coincidir en el tiempo (contrario de sincronico, mismo tiempo).
//        Con este async le estamos diciendo al codigo, aquí dentro en algunas acciones me voy a tardar (como fetch)
formulario.addEventListener('submit', async (event) => {
  //----------------------------------------------------------------
  //------------ 1. Evitamos que la página se recargue -------------
  //----------------------------------------------------------------
  event.preventDefault();

  //-----------------------------------------------------------------
  //-- 2. Capturamos cada input del formulario de forma individual --
  //-----------------------------------------------------------------
  const nombreInput     = document.querySelector('#nombre').value;
  const apellidoInput   = document.querySelector('#apellido').value;
  const comentarioInput = document.querySelector('#comentario').value;


  
  //----------------------------------------------------------------
  //--- 4. Envio de datos al servidor (Hacemos un HTTP Request) ----
  //----------------------------------------------------------------
  try {
    const response = await fetch('/usuario', { //endpoint usuario
      method:   'POST',  //metodo HTTP
      headers:  { 'Content-Type': 'application/json' },  //los datos que envío están en formato JSON”
      body:     JSON.stringify({       
                                  nombre:   nombreInput,
                                  apellido: apellidoInput,
                                  comentario: comentarioInput 
                              }) // convierte un objeto de JavaScript en texto JSON para enviarlo al servidor
    });

    const jsonResponse = await response.json(); //Convierte la respuesta a un objeto JavaScript

    if (jsonResponse.exito) {
      location.reload(); //actualiza la pagina
    }
    console.log("Response", jsonResponse);

  } catch (error) {
    console.log(error);
  }

});