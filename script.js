const msgform=document.getElementById('send')
const socket=io('http://localhost:3000')
const msg=document.getElementById('msg-input')
const msgconatiner=document.getElementById('msg')

const name=prompt('Enter your username:')
appendMessage('You joined')

//.emit creates an event which is handled by the socket
socket.emit('new-user', name)

//.on handles the events created by the socket
socket.on('chat-message',data=>{
    appendMessage(data.name+': '+data.message)
})


socket.on('user-connected', name=>{
    appendMessage(name+' connected')
})

socket.on('user-disconnected', name=>{
    appendMessage(name+' Disconnected')
})

//whenever the form is submitted we prevent its default action and simply emit and append the message which is written in the input
msgform.addEventListener('submit', e=>{
    e.preventDefault()
    const message= msg.value
    appendMessage('You: '+message)
    socket.emit('send-chat-message',message)
    msg.value=''
})
function appendMessage(message)
{
    const msgelement=document.createElement('div')
    msgelement.innerText=message
    msgconatiner.append(msgelement)
}