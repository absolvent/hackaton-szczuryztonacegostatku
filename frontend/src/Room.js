import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import UserList from './UserList';
import socket from './lib/socket';

const Room = ({ match, history }) => {
  const [room, setRoom] = useState(null);

  const roomId = match.params.id;

  const receiveRoom = room => {
    console.log(room);
    if (!room) {
      return history.push('/');
    }
    setRoom(room);
  }

  useEffect(() => {
    socket.on('room', receiveRoom);
    socket.emit('join room', roomId);
    return () => {
      socket.removeListener('room', receiveRoom);
    };
  }, []);

  return room ? (
    <div>
      <h1>Pokój: {room.name}</h1>
      <div>
        <UserList
          title="Uzytkownicy w pokoju"
          eventName="room users"
        />
        <Chat
          title={`Chat pokoju: ${room.name}`}
          eventName="room chat message"
        />
      </div>
    </div>
  ) : null;
};

export default Room;
