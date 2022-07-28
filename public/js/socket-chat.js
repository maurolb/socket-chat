const socket = io();

const params = new URLSearchParams(window.location.search);

if(!params.has('name') || !params.has('room')){
    window.location = 'index.html';
    throw new Error('name and room are required');
}

const user = {
    name: params.get('name'),
    room: params.get('room'),
}

socket.on('connect', () => {
    console.log('Conectado al servidor');

    socket.emit('joinChat', user, (res) => {
        console.log('online users', res);
    });
});

// Enviar información
// socket.emit('createMessage', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar informacion
socket.on('createMessage', (message) => {
    console.log('Server:', message);
});

// Escuchar cambios de usuario
// Usuario entra o sale del chat
socket.on('onlinePeople', (people) => {
    console.log(people);
});

// Mensajes privados
socket.on('privateMessage', (message) => {
    console.log('Private message:', message)
});
