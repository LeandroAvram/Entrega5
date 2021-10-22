const socket = io();

async function cargarProductos(productos) {
    const plantilla = await obtenerPlantillaProductos()
    const render = Handlebars.compile(plantilla);
    const html = render({ productos })
    document.getElementById('productos').innerHTML = html
}

function obtenerPlantillaProductos() {
    return fetch('/plantillas/listaProductos.hbs')
        .then(respuesta => respuesta.text())
}


socket.on('actualizarProductos', productos => {
    cargarProductos(productos)
});


function agregarProducto(form) {
    const producto = {
        title: form["title"].value,
        price: form["price"].value,
        thumbnail: form["thumbnail"].value,
    }
    socket.emit('nuevoProducto', producto);
    form.reset();
    return false;
}

Handlebars.registerHelper('formatDate', function(date) {
    return new Handlebars.SafeString(
        new Date(date).toLocaleString()
    );
});

async function cargarMensajes(mensajes) {
    const plantilla = await obtenerPlantillaMensajes()
    const render = Handlebars.compile(plantilla);
    const html = render({ mensajes })
    document.getElementById('mensajes').innerHTML = html
    const scrollHeight = document.getElementById("mensajes").scrollHeight
    document.getElementById("mensajes").scrollTop = scrollHeight
}

function obtenerPlantillaMensajes() {
    return fetch('/plantillas/listaMensajes.hbs')
        .then(respuesta => respuesta.text())
}


socket.on('actualizarMensajes', Mensajes => {
    cargarMensajes(Mensajes)
});


function agregarMensaje(form) {
    const mensaje = {
        mail: form["mail"].value,
        mensaje: form["mensaje"].value,
        fecha: new Date()
    }
    socket.emit('nuevoMensaje', mensaje);
    form["mensaje"].value=""
    return false;
}