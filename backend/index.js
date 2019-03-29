const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let rooms = [];

let users = [];

const getUser = socketId => 
  users.find(({ id }) => id ===`user-${socketId}`);

io.on('connection', function(socket){
  socket.on('disconnect', function(){
    users = users.filter(({ id }) => id !== `user-${socket.id}`);
    io.emit('users', users);
  });

  // socket.on('chat message', function(msg){
  //   io.emit('chat message', {
  //     msg,
  //     id: socket.id,
  //   });
  // });

  socket.on('get users', () => {
    io.emit('users', users);
  })

  socket.on('set username', name => {
    userData = {
      id: `user-${socket.id}`,
      name,
    };

    users.push(userData);
    io.emit('users', users);
  })

  socket.on('create room', name => {
    const roomData = {
      id: `room-${socket.id}`,
      name,
    };
    rooms.push(roomData);
    socket.join(roomData.id);
    io.emit('rooms', rooms)
  });

  socket.on('join room', roomId => {
    socket.join(roomId);
  })

  socket.on('global chat message', msg => {
    const user = getUser(socket.id);
    if (user) {
      io.emit('global chat message', {
        username: user.name,
        msg,
      });
    }
  })

  socket.on('room chat message', (id, msg) => {
    io.to(id).emit(msg);
  });
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});