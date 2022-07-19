const msgform=document.getElementById('send')
const socket=io('http://localhost:3000')
const msg=document.getElementById('msg-input')
const msgconatiner=document.getElementById('msg')
const roomContainer=document.getElementById('room-container')

if(msgform!=null)   //only ask for name when form is not null , i.e we are in room not index
{
    const name=prompt('Enter your username:')
    appendMessage('You joined')
    //.emit creates an event which is handled by the socket
    console.log(roomName)
    socket.emit('new-user', roomName,name)  //we need to send the room name too
    //roomName defined in the ejs file is the same as the one sent from the server while rendering


//whenever the form is submitted we prevent its default action and simply emit and append the message which is written in the input
msgform.addEventListener('submit', e=>{
    e.preventDefault()
    const message= msg.value
    appendMessage('You: '+message)
    //we need to pass along the room name too
    socket.emit('send-chat-message',roomName,message)   //roomName defined in the ejs file is the same as the one sent from the server while rendering
    msg.value=''
})
}


socket.on('room-created',room =>{
    if(roomContainer==null)     //if we are in the index.js then only we need to do this
        return
    console.log("NEW ROOM!")
    const roomElement=document.createElement('div')
    roomElement.innerText=room
    const roomLink=document.createElement('a')
    roomLink.href= `/${room}`
    roomLink.innerText='join'
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
})


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


function appendMessage(message)
{
    const msgelement=document.createElement('div')
    msgelement.innerText=message
    msgconatiner.append(msgelement)
}