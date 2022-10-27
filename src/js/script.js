let name;
let totalMessages = [];
let compareMessages = [];
const chat = document.querySelector(".main-content");

loginOnChat();

function loginOnChat() {
  name = prompt("Digite seu nickname: ");
  const userName = { name: name };
  const loginResponse = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    userName
  );
  loginResponse.then(loginSuccess);
  loginResponse.catch(loginError);
}

function loginSuccess(loginResponse) {
  setInterval(keepUserOnline, 5000);
  loadMessages();
  setInterval(loadMessages, 3000);
}

function loginError(loginResponse) {
  const statusCode = loginResponse.response.status;
  if (statusCode === 400) {
    loginOnChat();
  }
}

function keepUserOnline() {
  const userName = { name: name };
  const statusResponse = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    userName
  );
}

function loadMessages() {
  const messagesResponse = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  messagesResponse.then(showMessages);
}

// Adicionar um placeholder depois de loading

function showMessages(messagesResponse) {
  totalMessages = messagesResponse.data;
  console.log("entrou na função");
  chat.innerHTML = "";
  for (let i = 0; i < totalMessages.length; i++) {
    let singleMessage = totalMessages[i];
    if (singleMessage.type === "status") {
      chat.innerHTML += `
                <p class="message status-message">
                    <span>
                        <span class="message-time">(${singleMessage.time}) </span
                        ><span class="user-name">${singleMessage.from}</span
                        ><span class="userMessage"> ${singleMessage.text}</span>
                    </span>
                </p>
            `;
    } else if (
      singleMessage.type === "private_message" &&
      (singleMessage.to === name || singleMessage.from === name)
    ) {
      chat.innerHTML += `
                <p class="message private-message">
                    <span>
                        <span class="message-time" id="messageTime">(${singleMessage.time}) </span
                        ><span class="user-name" id="userName">${singleMessage.from}</span>
                        <span>reservadamente para</span>
                        <span class="user-name" id="userRecipient">${singleMessage.to}</span
                        ><span class="userMessage" id="userMessage"
                            >: ${singleMessage.text}</span>
                    </span>
                </p>
            `;
    } else {
      chat.innerHTML += `
                <p class="message">
                <span>
                    <span class="message-time" id="messageTime">(${singleMessage.time}) </span
                    ><span class="user-name" id="userName">${singleMessage.from}</span>
                    <span>para</span>
                    <span class="user-name" id="userRecipient">${singleMessage.to}</span
                    ><span class="userMessage" id="userMessage"
                        >: ${singleMessage.text}</span
                    >
                </span>
                </p>
            `;
    }
    if (i === 99) {
      compareMessages.push(totalMessages[i]);
    }
  }

  if (compareMessages.length >= 2) {
    const lastMessage = compareMessages[compareMessages.length - 1];
    const penultMessage = compareMessages[compareMessages.length - 2];
    if (
      lastMessage.text !== penultMessage.text ||
      lastMessage.from !== penultMessage.from
    ) {
      scrollToLastMessage(chat);
    }
  } else {
    scrollToLastMessage(chat);
  }
}

function scrollToLastMessage(chat) {
  const lastMessage = chat.lastElementChild;
  lastMessage.scrollIntoView({ behavior: "smooth" });
}
