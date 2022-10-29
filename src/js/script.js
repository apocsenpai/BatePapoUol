let name;
let totalMessages = [];
let compareMessages = [];
let destinatary = "Todos";
let typeMessageChoose = "message";

const chat = document.querySelector(".main-content");
const btnSendMessage = document.getElementById("btnSendMessage");
const userMessage = document.getElementById("messageToSend");
const btnActiveUsers = document.getElementById("btnActiveUsers");
const sidebar = document.querySelector(".activeUsers-display");
const btnCloseSidebar = document.querySelector(".btn-close-sidebar");
const activeUsers = document.querySelector(".active-users");
const typeMessage = document.querySelectorAll(".type-message");
const blackScreen = document.querySelector(".black-screen");
const btnLogin = document.getElementById("btnLogin");
const userLogin = document.getElementById("userLogin");
const displayLogin = document.querySelector(".login-display");

btnLogin.addEventListener("click", loginOnChat);

btnSendMessage.addEventListener("click", sendMessages);

btnActiveUsers.addEventListener("click", showSidebar);

btnCloseSidebar.addEventListener("click", closeSideBar);

blackScreen.addEventListener("click", closeSideBar);

document.addEventListener("keypress", (keyPressed) => {
  if (keyPressed.key === "Enter") {
    if(displayLogin.classList.contains('hidden-class')!==true){
       btnLogin.click();
    }else{
    btnSendMessage.click();
    }
  }
});

typeMessage.forEach(selectOption);

function loginOnChat() {
  name = userLogin.value;
  const userName = { name: name };
  const loginResponse = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    userName
  );
  loginResponse.then(loginSuccess);
  loginResponse.catch(loginError);
}

function loginSuccess(loginResponse) {
  
  displayLogin.classList.add("hidden-class");
  setInterval(keepUserOnline, 5000);
  loadMessages();
  setInterval(loadMessages, 3000);
  findParticipants();
  setInterval(findParticipants, 10000);
}

function loginError(loginResponse) {
  const statusCode = loginResponse.response.status;
  if (statusCode === 400) {
    userLogin.classList.add("message-error");
    userLogin.placeholder = "Login inválido";
    setTimeout(() => {
      userLogin.classList.remove("message-error");
      userLogin.placeholder = "Digite seu nome";
    }, 1500);
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
      scrollToLastMessage();
    }
  } else {
    scrollToLastMessage();
  }
}

function sendMessages() {
  const message = {
    from: name,
    to: destinatary,
    text: userMessage.value,
    type: typeMessageChoose,
  };

  const sendMessageResponse = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    message
  );
  sendMessageResponse.then(loadMessages);
  sendMessageResponse.catch(sendMessageError);

  userMessage.value = "";
}

function sendMessageError(sendMessageError) {
  const statusCode = sendMessageError.response.status;
  if (statusCode === 400) {
    userMessage.classList.add("message-error");
    userMessage.placeholder = "Por favor, digite alguma mensagem!";
    setTimeout(() => {
      userMessage.classList.remove("message-error");
      userMessage.placeholder = "Escreva aqui...";
    }, 1500);
  } else {
    window.location.reload();
  }
}

function scrollToLastMessage() {
  const lastMessage = chat.lastElementChild;
  lastMessage.scrollIntoView({ behavior: "smooth" });
}

function showSidebar() {
  sidebar.classList.remove("hidden-class");
}

function closeSideBar() {
  sidebar.classList.add("hidden-class");
}

function selectOption(option) {
  option.addEventListener("click", () => {
    chooseType(option);
    optionTreatment(option);
  });
}

function chooseType(option) {
  if (option.classList.contains("selected") === true) {
    return;
  } else {
    removeSelect(option);
    option.classList.add("selected");
  }
}

function removeSelect(option) {
  option.parentNode.querySelectorAll(".selected").forEach((element) => {
    element.classList.remove("selected");
  });
}

function findParticipants() {
  const participantsResponse = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/participants"
  );
  participantsResponse.then(participantsActive);
  participantsResponse.catch(participantsError);
}

function participantsActive(participants) {
  const participantsList = participants.data;
  activeUsers.innerHTML = `
    <div class="activeUser otherUser">
        <div>
          <ion-icon id="btnActiveUsers" name="people"></ion-icon>
          <span class="destinatary">Todos</span>
        </div>
        <ion-icon name="checkmark-sharp" class="check"></ion-icon>
    </div>
  `;
  for (let i = 0; i < participantsList.length; i++) {
    let participant = participantsList[i];
    showParticipants(participant.name);
  }
  const activeUser = document.querySelectorAll(".otherUser");
  activeUser.forEach(selectOption);
}

function participantsError() {
  activeUsers.innerHTML = `<p>Não há participantes online</p>`;
}

function showParticipants(participant) {
  if (name === participant) {
    activeUsers.innerHTML += `
    <div class="activeUser">
      <div>
        <ion-icon name="person-circle"></ion-icon> <span >${participant}</span>
      </div>
      <ion-icon name="checkmark-sharp" class="check"></ion-icon>
    </div>
  `;
  } else {
    activeUsers.innerHTML += `
    <div class="activeUser otherUser">
      <div>
        <ion-icon name="person-circle"></ion-icon> <span class="destinatary">${participant}</span>
      </div>
      <ion-icon name="checkmark-sharp" class="check"></ion-icon>
    </div>
  `;
  }
}

function optionTreatment(option) {
  if (option.classList.contains("otherUser")) {
    destinatary = option.querySelector(".destinatary").innerHTML;
  } else if (option.classList.contains("type-message")) {
    const type = option.querySelector(".type-message-option").innerHTML;
    if (type === "Reservadamente") {
      typeMessageChoose = "private_message";
    } else {
      typeMessageChoose = "message";
    }
  }
}
