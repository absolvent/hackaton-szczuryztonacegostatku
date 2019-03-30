import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import UserList from './UserList';
import Map from './components/Map';
import socket from './lib/socket';

const getReadyUsersIdList = room =>
  room ? room.players.filter(({ ready }) => !!ready).map(({id}) => id) : undefined;

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
    socket.on('room not exists', () => history.push('/'))
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
          readyPlayersIdList={getReadyUsersIdList(room)}
        />
        <Chat
          title={`Chat pokoju: ${room.name}`}
          eventName="room chat message"
        />
      </div>
      <div>
        {room && room.players && 
          <div>
            <Map
              players={room.players}
            />
          </div>
        }
      </div>
    </div>
  ) : null;
};

export default Room;
