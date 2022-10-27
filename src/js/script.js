let name;

loginOnChat();

function loginOnChat(){
    name = prompt("Digite seu nickname: ");
    const userName = {name: name}
    const loginResponse = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userName);
}

function loginSuccess(acceptResponse){
    setInterval(keepUserOnline,5000);
}

function loginError(errorResponse){
    const statusCode = errorResponse.response.status;
    if(statusCode === 400){
        loginOnChat();
    }
}

function keepUserOnline(){
    const userName = {name: name}
    const statusResponse = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userName);
    statusResponse.then(statusSuccess);
    statusResponse.catch(statusError);
}