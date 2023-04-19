// messageHelper.js
const createMessage = (wrappedMessage) => {
    // Elements
    const listItem = document.createElement("li");
    const messageContainer = document.createElement("div");
    const messageContentContainer = document.createElement("div");
    const messageContent = document.createElement("div");
    const timestamp = document.createElement("div");
    const icon = document.createElement("i");

    // Set classes and content
    icon.className =
      wrappedMessage.role === "user"
        ? "icon fas fa-user user-icon"
        : "icon fas fa-robot assistant-icon";
    messageContent.innerHTML = wrappedMessage.message;
    timestamp.innerHTML = wrappedMessage.timestamp;
    listItem.classList.add(`${wrappedMessage.role}-message`);
    messageContainer.classList.add("message-container");
    messageContentContainer.classList.add("message-content-container");
    messageContent.classList.add("message-content");
    timestamp.classList.add("timestamp");

    // Assemble elements
    messageContentContainer.appendChild(messageContent);
    messageContentContainer.appendChild(timestamp);

    if (wrappedMessage.role === "user") {
      messageContainer.appendChild(messageContentContainer);
      messageContainer.appendChild(icon);
    } else {
      messageContainer.appendChild(icon);
      messageContainer.appendChild(messageContentContainer);
    }

    listItem.appendChild(messageContainer);
    return listItem;
};

const sendMessage = (socket, messageInput) => {
  if (messageInput.value) {
    socket.send(messageInput.value);
    messageInput.value = "";
  }
};

const handleIncomingMessage = (socket, messagesList) => {
  socket.on("message", (data) => {
    const wrappedMessage = JSON.parse(data);
    const messageId =
      wrappedMessage.timestamp.replace(/[:\s-]/g, "") +
      "-" +
      wrappedMessage.role;
    let listItem = document.getElementById(messageId);

    if (listItem) {
      listItem.querySelector(".message-content").textContent =
        wrappedMessage.message;
    } else {
      listItem = createMessage(wrappedMessage);
      listItem.id = messageId;
      messagesList.appendChild(listItem);
    }
    messagesList.scrollTop = messagesList.scrollHeight;
  });
};

export { handleIncomingMessage, sendMessage };