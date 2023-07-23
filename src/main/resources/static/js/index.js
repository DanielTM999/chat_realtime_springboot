
const socket = new WebSocket('ws://localhost:8080/conect');
const Client = Stomp.over(socket);


function openPopup() {
    const popup = document.getElementById("popup");
    popup.classList.remove("hidden");
}

function openChat() {
    const popup = document.getElementById("popup");
    const chatContainer = document.getElementById("chatContainer");
    const usernameInput = document.getElementById("usernameInput").value;

    if (usernameInput !== "") {
        popup.style.display = "none";
        chatContainer.classList.remove("hidden");
        sessionStorage.setItem("user", usernameInput);
    } else {
        alert("Digite um nome válido!");
    }
}

function sendMessage(e) {
    e.preventDefault();
    const messageInput = document.getElementById("messageInput").value;

    const message = {
        user: sessionStorage.getItem("user"),
        msg: messageInput
    };

    Client.send("/app/chatMessage", {}, JSON.stringify(message));

    document.getElementById("messageInput").value = "";
}

function displayMessage(message, name) {
    const chatMessages = document.getElementById("chatMessages");
    const messageElement = document.createElement("div");

    messageElement.textContent = name + ": " + message;
    chatMessages.appendChild(messageElement);
}

function connect(){
    Client.connect({}, function (frame) {
        console.log('Conectado: ' + frame);


        Client.subscribe('/canal', function (message) {
            const chatMessage = JSON.parse(message.body);
            displayMessage(chatMessage.msg, chatMessage.user);
        });
    });
}


connect();
openPopup();
