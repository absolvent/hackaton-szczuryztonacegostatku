const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', function(socket){
  // console.log('a user connected');
  // socket.on('disconnect', function(){
  //   console.log('user disconnected');
  // });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    socket.emit('chat message', msg);
  });
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});