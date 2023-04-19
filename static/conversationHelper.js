// conversationHelper.js
import { handleIncomingMessage } from "./messageHelper.js";
import socket from "./socketUtil.js";

export async function loadConversation(messagesList) {
  const response = await fetch("/conversation");
  const data = await response.json();

  if (data && data.messages) {
    for (const message of data.messages) {
      handleIncomingMessage(socket, messagesList, message);
    }
  }
}

export async function saveConversation(messagesList) {
  const messages = Array.from(messagesList.querySelectorAll("li")).map((li) => {
    const role = li.classList.contains("user-message") ? "user" : "assistant";
    const content = li.querySelector(".message-content").textContent;
    const timestamp = li.querySelector(".timestamp").textContent;
    return { role, content, timestamp };
  });

  const response = await fetch("/conversation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  const data = await response.json();
  console.log("Conversation saved:", data.success);
}
