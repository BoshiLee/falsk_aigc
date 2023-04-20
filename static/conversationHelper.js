// conversationHelper.js

export async function fetchConversation() {
  const response = await fetch("/conversation");
  const data = await response.json();
  if (data && data.messages) {
    return data.messages;
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
