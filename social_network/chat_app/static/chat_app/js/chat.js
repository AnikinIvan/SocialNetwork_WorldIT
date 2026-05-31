import {getCSRFToken} from '/static/js/getCSRFToken.js'

//const CHAT_URL = `ws://${window.location.host}/chat/`;

//const chatSocket = new WebSocket(CHAT_URL);

//chatSocket.onmessage = function (event) {
  //let data = JSON.parse(event.data);
  //console.log(data);
//};

let chatSocket = null
const chatTitle = document.getElementById("chat-title")
const chatStatus = document.getElementById("chat-status")
const chatButtons = document.querySelectorAll("[data-chat-user]")

function connectWebSocket(chatId) {
  if (chatSocket){
    chatSocket.close()
  }
  chatSocket = new WebSocket(`ws://${window.location.host}/chat/${chatId}`) 
  chatSocket.onmessage = function(event){
    const data = JSON.parse(event.data)
    chatStatus.textContent = data.onmessage
  }
}

async function openChatWithUser(userId, username) {
  const response = await fetch(
    `chat/chat_with${userId}`,
      {
      method:"POST", 
      headers : {
        "X-CSRFToken":getCSRFToken()
      }
    }
  )
  const data = await response.json()
  if (!data.success){
    return 
  }
  chatTitle.textContent = `Чат з ${data.username || username}`
  connectWebSocket(data.chatId)
}

chatButtons.forEach(function(button){
  button.addEventListener(
    "click", 
    async function(){
      await openChatWithUser(button.dataset.chatUser, button.dataset.chatUsername) 
    }
  )
})
