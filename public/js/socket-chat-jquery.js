
const urlparams = new URLSearchParams(window.location.search);

const nombre = urlparams.get('name');
const room = urlparams.get('room');

// Referencia jquery
const divUsuarios = $('#divUsuarios');
const formEnviar = $('#formEnviar');
const txtMensaje = $('#txtMensaje');
const divChatbox = $('#divChatbox');


// Funciones para renderizar usuarios
const usersRender = (people) => {
    console.log(people);

    let html = '';

    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span>'+ urlparams.get('room') +'</span></a>';
    html += '</li>';

    for(let i = 0; i<people.length; i++){
        html += '<li>'
        html += '    <a data-id="'+ people[i].id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ people[i].name +'<small class="text-success">online</small></span></a>'
        html += '</li>'
    }

    divUsuarios.html(html);
}

const messageRender = ({name, message, date}, me) => {
    let html = '';
    const fecha = new Date(date);
    const hour = fecha.getHours() + ':' + fecha.getMinutes();

    let adminClass = 'info';
    if(name === 'Admin'){
        adminClass = 'danger'
    }

    if(me){
        html += '<li class="reverse">'
        html += '    <div class="chat-content">'
        html += '        <h5>'+ name +'</h5>'
        html += '        <div class="box bg-light-inverse">'+ message +'</div>'
        html += '    </div>'
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        html += '    <div class="chat-time">'+ hour +'</div>'
        html += '</li>'
    } else {
        html += '<li class="animated fadeIn">'

        if(name !== 'Admin'){
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        }

        html += '    <div class="chat-content">'
        html += '        <h5>'+ name +'</h5>'
        html += '        <div class="box bg-light-'+ adminClass +'" >'+ message +'</div>'
        html += '    </div>'
        html += '    <div class="chat-time">'+ hour +'</div>'
        html += '</li>'
    }
    
    divChatbox.append(html);
}

const scrollBottom = () => {
    // selectors
    const newMessage = divChatbox.children('li:last-child');

    // heights
    const clientHeight = divChatbox.prop('clientHeight');
    const scrollTop = divChatbox.prop('scrollTop');
    const scrollHeight = divChatbox.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//  Listeners
divUsuarios.on('click', 'a', function(){
    const id = $(this).data('id');

    if(id){
        console.log(id);
    }
});

formEnviar.on('submit', function(e){
    e.preventDefault();

    if(txtMensaje.val().trim().length === 0){
        return;
    }

    socket.emit('createMessage', {
        name: nombre,
        message: txtMensaje.val()
    }, function(message) {
        txtMensaje.val('').focus();
        messageRender(message, true);
        scrollBottom();
    });
});