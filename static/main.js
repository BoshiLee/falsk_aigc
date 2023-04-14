document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://' + document.domain + ':' + location.port);
    const messageInput = document.getElementById('message');
    const messagesList = document.getElementById('messages');
    socket.on('connect', () => {
        console.log('connected');
        messageInput.addEventListener('keydown', (event) => {

            if (event.key === 'Enter' && messageInput.value) {
                socket.send(messageInput.value);
                messageInput.value = '';
            }
        });
    });
    // Receive and display messages from the server
    socket.on('message', (msg) => {
        const listItem = document.createElement('li');
        listItem.textContent = msg;
        messagesList.appendChild(listItem);
        messagesList.scrollTop = messagesList.scrollHeight;
    });
});