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
            listItem.textContent = `[${wrappedMessage.timestamp}] ${wrappedMessage.message}`;
            messagesList.appendChild(listItem);
        }

        messagesList.scrollTop = messagesList.scrollHeight;
    });


});
