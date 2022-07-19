const express=require('express')
const app=express()
const server=require('http').Server(app)


const io = require('socket.io')(server, { //pass the server instead of the port number
	cors: {
		origin: true, // cross-origin resource sharing(cors) allows server to load resources from any origin other than its own
	},
})

const users={}  //used to store the names of the users in a key value format where key will be the socked id
io.on('connection', socket=>{

    socket.on('new-user', name=>{
        users[socket.id]=name
        socket.broadcast.emit('user-connected',name)    //broadcasts to all the other users 
    })

    socket.on('send-chat-message',message=>{
    socket.broadcast.emit('chat-message',{message: message, name: users[socket.id]})
    })

    socket.on('disconnect', ()=>{
      socket.broadcast.emit('user-disconnected', users[socket.id])
      delete users[socket.id]
    })
})
