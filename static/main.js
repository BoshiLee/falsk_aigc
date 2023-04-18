document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://' + document.domain + ':' + location.port);
    const messageInput = document.getElementById('message');
    const sendButton = document.getElementById('send-button');
    const messagesList = document.getElementById('messages');

    const sendMessage = () => {
        if (messageInput.value) {
            socket.send(messageInput.value);
            messageInput.value = '';
        }
    };

    socket.on('connect', () => {
        console.log('connected');
        messageInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });

        sendButton.addEventListener('click', () => {
            sendMessage();
        });
    });

    // Receive and display messages from the server
    socket.on('message', (data) => {
        const wrappedMessage = JSON.parse(data);
        const messageId = wrappedMessage.timestamp.replace(/[:\s-]/g, '') + '-' + wrappedMessage.role;
        let listItem = document.getElementById(messageId);

        if (listItem) {
            // If an element with the same timestamp and role exists, update its content
            listItem.textContent = `[${wrappedMessage.timestamp}] ${wrappedMessage.message}`;
        } else {
            // Otherwise, create a new list item and append it to the messages list
            listItem = document.createElement('li');
            listItem.id = messageId;
            listItem.className = `${wrappedMessage.role}-message`;
            listItem.textContent = `[${wrappedMessage.timestamp}] ${wrappedMessage.message}`;
            messagesList.appendChild(listItem);
        }

        messagesList.scrollTop = messagesList.scrollHeight;
    });

});
