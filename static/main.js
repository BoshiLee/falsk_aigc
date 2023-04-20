// main.js
import {handleMessage, onIncomingMessage, sendMessage} from "./messageHelper.js";
import socket from "./socketUtil.js";
import { loadConversation } from "./conversationHelper.js";

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const sendButton = document.getElementById("send-button");
  const messagesList = document.getElementById("messages");
  const messageInput = document.getElementById("message");

  // Event listeners
  messageInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  socket.on("connect", () => {
    console.log("connected");
    loadConversation(messagesList).then(messages => {
        for (const message of messages) {
            handleMessage(message);
        }
      }
    );

    messageInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        sendMessage(socket, messageInput);
      }
    });
    sendButton.addEventListener("click", () => {
      sendMessage(socket, messageInput);
    });
  });

  onIncomingMessage(socket, messagesList);
});
