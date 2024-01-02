    import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
    const socket = io();

    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');

    socket.on('connect', () => {
        console.log('Conectado al servidor');
        // Enviar un mensaje al servidor
        socket.emit('message', '¡Usuario nuevo conectado!');
    });
    // Manejar mensajes del servidor
    socket.on('message_server', (serverMessage) => {
        console.log('Servidor:'+serverMessage);
        let item = `<li>${serverMessage}</li>`
        messages.insertAdjacentHTML('beforeend', item);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault()
            if (input.value) {
            let message = input.value;
            console.log(input.value);
            socket.emit('message',message );
            input.value = ''

        }
        return false;
    });
