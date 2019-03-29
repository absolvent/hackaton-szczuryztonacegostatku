const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const response = result => ({
  result,
});

const emptyMap = () => [...Array(10)].map(() => [...Array(10)].map(() => false));

const emptyPlayerData = id => ({
  id,
  shipMap: emptyMap(),
  shotMap: emptyMap(),
  ready: false,
  canShoot: false,
})

let rooms = [];

let users = [];

const getUser = socketId => 
  users.find(({ id }) => id ===`user-${socketId}`);

const getRoom = roomId =>
  rooms.find(({ id }) => id === roomId);

const replacePlayerData = (roomId, playerIndex, playerData) => {
  const roomIndex = rooms.findIndex(({ id }) => id == roomId);
  if (roomIndex && rooms[roomIndex].players[playerIndex]) {
    rooms[roomIndex].players[playerIndex]  = playerData; 
  }
}

const createRoom = ({
  name,
  socketId
}) => {
  const user = getUser(socketId);
  return user ? {
    id: `room-${socketId}`,
    creatorName: user.name,
    name,
    players: [],
    isDraft: true,
    isPlaying: false,
  } : null;
};

io.on('connection', function(socket){

  const getRoomId = () => {
    const rooms = Object.keys(socket.rooms);
    return rooms && rooms.length > 0 ? rooms[0] : null;
  }

  const getRoomUsers = roomId => {
    const roomData = io.sockets.adapter.rooms[roomId];
    if (!roomData || !roomData.sockets) {
      return [];
    }
    const socketIdList = Object.keys(io.sockets.adapter.rooms[roomId].sockets)
      .map(id => `user-${id}`);
    return users.filter(({ id }) => socketIdList.includes(id));
  }

  const leaveRooms = () => {
    Object.keys(socket.rooms).map(roomId => {
      socket.leave(roomId);
    })
  };

  const currentRoom = () => getRoom(getRoomId());

  const getPlayerDataIndex = () => {
    const room = currentRoom();
    return room ? room.players.findIndex(({ id }) => id === `user-${socket.id}`) : null;
  }

  const getPlayerData = () => {
    const index = getPlayerDataIndex();
    return index ? currentRoom().players[index] : null;
  }

  const joinRoom = roomId => {
    const room = getRoom(roomId);
    if (room && room.players && room.players.length < 2) {
      room.players.push(emptyPlayerData(`user-${socket.id}`));
      const index = rooms.findIndex(({ id }) => id === roomId);
      console.log(roomId, room, index);
      if (rooms[index]) {
        console.log(4);
        rooms[index] = room;
        socket.join(roomId);
        console.log(5);
        return response(true);
      }
      return response(false);
    }

    return response(false);
  }

  socket.on('add ship', ({isChedked, row, element}) => {
    const playerData = getPlayerData();
    if (!playerData) {
      return;
    }
    playerData.shipMap[row][element] = isChedked;
    replacePlayerData(getRoomId(), getPlayerDataIndex(), playerData);
    io.to(getRoomId()).emit('room', currentRoom());
  });

  socket.on('disconnect', () => {
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
    const roomData = createRoom({
      name,
      socketId: socket.id,
    });
    if (roomData) {
      rooms.push(roomData);
      socket.join(roomData.id);
      io.emit('rooms', rooms);
    }
  });

  socket.on('leave all rooms', () => {
    leaveRooms();
  });

  socket.on('join room', roomId => {
    const { result } = joinRoom(roomId);
    console.log(1);
    if (result) {
      console.log(2, result);
      io.to(roomId).emit('room', getRoom(roomId));
      io.to(roomId).emit('room users', getRoomUsers(roomId));
    } else {
      console.log(3);
      socket.emit('room not exists');
    }
    console.log(4);
    return result;
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
    console.log(roomId, msg);
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