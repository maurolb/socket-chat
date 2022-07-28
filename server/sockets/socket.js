const { Users } = require('../classes/Users');
const { io } = require('../server');
const { createMessage } = require('../utils/utils');

const users = new Users();

io.on('connection', (client) => {

    client.on('joinChat', ({name, room}, callback) => {

        if(!name || !room){
            return callback({
                error: true,
                msg: 'name/room is required'
            });
        }

        client.join(room);

        users.addPerson(client.id, name, room);

        client.broadcast.to(room).emit('onlinePeople', users.getRoomPeople(room));
        client.broadcast.to(room).emit('createMessage', createMessage('Admin', name + ' se unió'));

        
        callback(users.getRoomPeople(room));
    });

    client.on('createMessage', (data, callback) => {

        const {name, room} = users.getPerson(client.id);

        const message = createMessage(name, data.message);
        client.broadcast.to(room).emit('createMessage', message);

        callback(message);
    });

    // Mensajes privados
    client.on('privateMessage', ({user, message}) => {

        const {name} = users.getPerson(client.id);

        client.broadcast.to(user).emit('privateMessage',createMessage(name, message));
    });

    client.on('disconnect', () => {
        const {name, room} = users.removePerson(client.id);

        client.broadcast.to(room).emit('createMessage', createMessage('Admin', name + ' abandonó el chat'));
        client.broadcast.to(room).emit('onlinePeople', users.getRoomPeople(room));
    });

});