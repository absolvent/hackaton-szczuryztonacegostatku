const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let rooms = [];

let users = [];

const getUser = socketId => 
  users.find(({ id }) => id ===`user-${socketId}`);

const getRoom = roomId =>
  rooms.find(({ id }) => id === roomId);

io.on('connection', function(socket){

  const getRoomId = () => {
    const rooms = Object.keys(socket.rooms);
    return rooms && rooms.length > 0 ? rooms[0] : null;
  }

  const getRoomUsers = roomId => {
    const socketIdList = Object.keys(io.sockets.adapter.rooms[roomId].sockets)
      .map(id => `user-${id}`);
    return users.filter(({ id }) => socketIdList.includes(id));
  }

  socket.on('disconnect', function(){
    users = users.filter(({ id }) => id !== `user-${socket.id}`);
    rooms = rooms.filter(({ id }) => id !== `room-${socket.id}`);
    io.emit('users', users);
  });

  socket.on('get users', () => {
    socket.emit('users', users);
  });

  socket.on('get room users', () => {
    const roomId = getRoomId();
    io.to(roomId).emit('room users', getRoomUsers(roomId));
  });

  socket.on('get rooms', () => {
    socket.emit('rooms', rooms);
  });

  socket.on('get room', roomId => {
    socket.emit('room', getRoom(roomId));
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
    const user = getUser(socket.id);
    if (user) {
      const roomData = {
        id: `room-${socket.id}`,
        creatorName: user.name,
        name,
      };
      rooms.push(roomData);
      socket.join(roomData.id);
      io.emit('rooms', rooms);
    }
  });

  socket.on('leave all rooms', () => {
    const roomId = getRoomId();
    if (roomId) {
      socket.leave();
    }
  });

  socket.on('join room', roomId => {
    socket.leaveAll();
    socket.join(roomId);
    socket.emit('room', getRoom(roomId));
    io.to(roomId).emit('room users', getRoomUsers(roomId));
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

  socket.on('room chat message', msg => {
    const user = getUser(socket.id);
    const roomId = Object.keys(socket.rooms)[0];
    if (user) {
      io.to(roomId).emit('room chat message', {
        username: user.name,
        msg,
      });
    }
  });
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});