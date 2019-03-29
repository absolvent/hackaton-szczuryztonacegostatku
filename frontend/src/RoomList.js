import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import socket from './lib/socket';

const RoomList = () => {
  const [roomName, setRoomName] = useState('');
  const [roomList, setRoomList] = useState([]);

  const submitRoom = e => {
    e.preventDefault();
    socket.emit('create room', roomName);
    setRoomName('');
  }

  const receiveRoomList = roomList => {
    setRoomList(roomList);
  }

  useEffect(() => {
    socket.on('rooms', receiveRoomList);
    socket.emit('get rooms');
    return () => {
      socket.removeListener('rooms', receiveRoomList);
    }
  }, []);

  return (
    <div>
      <h2>Pokoje</h2>
      <div>
        <ul>
          {roomList.map(({id, creatorName, name}) => 
            <li>
              <strong>{name}</strong>, stworzony przez {creatorName} | <Link to={`/room/${id}`}>Dołącz</Link>
            </li>
          )}
        </ul>
      </div>
      <div>
        <form
          onSubmit={submitRoom}
        >
          <h3>Swtórz pokój</h3>
          <input
            type="text"
            placeholder="Nazwa pokoju"
            value={roomName}
            onChange={({ target }) => setRoomName(target.value)}
          />
          <button>
            Stwórz
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomList;
