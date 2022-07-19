const express=require('express')
const app=express()
const server=require('http').Server(app)

const io = require('socket.io')(server, { //pass the server instead of the port number
	cors: {
		origin: true, // cross-origin resource sharing(cors) allows server to load resources from any origin other than its own
	},
})

app.set('views','./views')
app.set('view engine','ejs')
app.use(express.static(__dirname+'/public'))     //middleware
app.use(express.urlencoded({extended: true}))    //this parses the body of the POST request

const rooms={}

app.get('/',(req,res)=>{
  res.render('index',{rooms: rooms})  //passing all the rooms to display all room names on the index page
})

app.post('/room',(req,res)=>{
  if(rooms[req.body.room]!=null)  //if room dosen't exist then return to home page
  {
    return res.redirect('/')
  }
  rooms[req.body.room]={users:{}}   //saving all the rooms and the users of that room as empty object initially
  res.redirect(req.body.room)
  //send message when new room created
  console.log("new room!!")
  io.emit('room-created',req.body.room)
})

app.get('/:room',(req,res)=>{
  if(rooms[req.params.room]==null)  //if room dosen't exist then return to home page
  {
    return res.redirect('/')
  }
  res.render('room',{roomName: req.params.room})  // we are passing room name to the ejs file while rendering it so that we can implement the isloation of rooms from one another
})

server.listen(3000)

//we now use the users variables only inside the room
//const users={}  //used to store the names of the users in a key value format where key will be the socked id
io.on('connection', socket=>{

    socket.on('new-user', (room,name)=>{
        socket.join(room)   //now when we call socket.to(room), this will make sure the event is created for only those which have joined the room
        rooms[room].users[socket.id]=name   //add the user to the room
       // console.log(socket.to(room))
        socket.to(room).emit('user-connected',name)    //broadcasts to all the other users 
    })

    socket.on('send-chat-message',(room,message)=>{
        socket.to(room).emit('chat-message',{message: message, name: rooms[room].users[socket.id]})
    })
    //when user disconnects it automatically removes from the room
    socket.on('disconnect', ()=>{
        //we do not have the room of the user so we need to find all the rooms the user was in and send the disconnect message to all of them
        getUserRooms(socket).forEach(room => {
            socket.to(room).emit('user-disconnected', rooms[room].users[socket.id])
            delete rooms[room].users[socket.id]
        });

    })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}
