import createMessage from "./messageHelper.js";
document.addEventListener("DOMContentLoaded", () => {
  const socket = io.connect("http://" + document.domain + ":" + location.port);

  // Elements
  const sendButton = document.getElementById("send-button");
  const messagesList = document.getElementById("messages");
  const messageInput = document.getElementById("message");

  // Functions
  const sendMessage = () => {
    if (messageInput.value) {
      socket.send(messageInput.value);
      messageInput.value = "";
    }
  };



  // Event listeners
  messageInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  socket.on("connect", () => {
    console.log("connected");
    messageInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        sendMessage();
      }
    });

    sendButton.addEventListener("click", () => {
      sendMessage();
    });
  });

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
});
