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
    function createMessage(wrappedMessage) {
        const listItem = document.createElement('li');
        const messageContainer = document.createElement('div');
        const messageContent = document.createElement('div');
        const timestamp = document.createElement('div');

        messageContent.innerHTML = wrappedMessage.message;
        timestamp.innerHTML = wrappedMessage.timestamp;

        listItem.classList.add(`${wrappedMessage.role}-message`);
        messageContainer.classList.add('message-container');
        messageContent.classList.add('message-content');
        timestamp.classList.add('timestamp');

        messageContainer.appendChild(messageContent);
        messageContainer.appendChild(timestamp);
        listItem.appendChild(messageContainer);
    return listItem;
}


    // Receive and display messages from the server
    socket.on('message', (data) => {
        const wrappedMessage = JSON.parse(data);
        const messageId = wrappedMessage.timestamp.replace(/[:\s-]/g, '') + '-' + wrappedMessage.role;
        let listItem = document.getElementById(messageId);

        if (listItem) {
            // If an element with the same timestamp and role exists, update its content
            listItem.querySelector('.message-content').textContent = wrappedMessage.message;
        } else {
            // Otherwise, create a new list item using the reusable function
            listItem = createMessage(wrappedMessage);
            listItem.id = messageId;
            messagesList.appendChild(listItem);
        }
        messagesList.scrollTop = messagesList.scrollHeight;
    });

});
