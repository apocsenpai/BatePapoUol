let name;
let totalMessages = [];
let compareMessages = [];
let destinatary = "Todos";
let type = "Público";
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
  messageInformation();
}

function loginError(loginResponse) {
  const statusCode = loginResponse.response.status;
  showMessageError(statusCode, userLogin);
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
    let timeAgo = convertTime(singleMessage.time);
    if (singleMessage.type === "status") {
      chat.innerHTML += `
                <p data-test="message" class="message status-message">
                    <span>
                        <span class="message-time">(${timeAgo}) </span
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
                <p data-test="message" class="message private-message">
                    <span>
                        <span class="message-time" id="messageTime">(${timeAgo}) </span
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
                <p data-test="message" class="message">
                <span>
                    <span class="message-time" id="messageTime">(${timeAgo}) </span
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
    if (i === totalMessages.length-1) {
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
  showMessageError(statusCode, userMessage);
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
    messageInformation();
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
    <div data-test="all" class="activeUser otherUser">
        <div>
          <ion-icon id="btnActiveUsers" name="people"></ion-icon>
          <span class="destinatary">Todos</span>
        </div>
        <ion-icon name="checkmark-sharp" data-test="check" class="check"></ion-icon>
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
    <div data-test="participant" class="activeUser">
      <div>
        <ion-icon name="person-circle"></ion-icon> <span>${participant}</span>
      </div>
      <ion-icon name="checkmark-sharp" data-test="check" class="check"></ion-icon>
    </div>
  `;
  } else if(destinatary === participant){
    activeUsers.innerHTML += `
    <div data-test="participant" class="activeUser otherUser selected">
      <div>
        <ion-icon name="person-circle"></ion-icon> <span class="destinatary">${participant}</span>
      </div>
      <ion-icon name="checkmark-sharp" data-test="check" class="check"></ion-icon>
    </div>
  `;
  }else {
    activeUsers.innerHTML += `
    <div data-test="participant" class="activeUser otherUser">
      <div>
        <ion-icon name="person-circle"></ion-icon> <span class="destinatary">${participant}</span>
      </div>
      <ion-icon name="checkmark-sharp" data-test="check" class="check"></ion-icon>
    </div>
  `;
  }
}

function optionTreatment(option) {
  if (option.classList.contains("otherUser")) {
    destinatary = option.querySelector(".destinatary").innerHTML;
  } else if (option.classList.contains("type-message")) {
    type = option.querySelector(".type-message-option").innerHTML;
    if (type === "Reservadamente") {
      typeMessageChoose = "private_message";
    } else {
      typeMessageChoose = "message";
    }
  }
}

function showMessageError(statusCode, element){
  if (statusCode === 400) {
    element.classList.add("message-error");
    element.placeholder = "Login inválido";
    setTimeout(() => {
      element.classList.remove("message-error");
      element.placeholder = "Digite seu nome";
    }, 1500);
  }else{
    window.location.reload();
  }
}

function messageInformation(){  
  const information = userMessage.parentNode.querySelector('span');
  information.innerHTML = `
  Enviando para ${destinatary} (${type})
  `;
}

function convertTime(time){
  let hour = (Number(time[0]+time[1])-3);
  if(hour<=0){
    hour = (hour+12).toLocaleString('pt-BR',{minimumIntegerDigits:2});
  }
  console.log(hour)
  const minute = Number(time[3]+time[4]).toLocaleString('pt-BR',{minimumIntegerDigits:2});
  const seconds = Number(time[6]+time[7]).toLocaleString('pt-BR',{minimumIntegerDigits:2});
  
  return `${hour}:${minute}:${seconds}`;
}