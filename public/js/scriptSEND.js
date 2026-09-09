
const listarUsuarios = () => {
  window.location.href = '/obtener-usuarios-send'; //ruta a donde quiero ir
};

const btnListarSEND = document.querySelector('#btnListarSEND');

btnListarSEND.addEventListener('click', listarUsuarios);

