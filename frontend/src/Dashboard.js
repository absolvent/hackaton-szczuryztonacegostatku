import React, { useState, useEffect } from 'react';
import UsernameForm from './UsernameForm';
import UserList from './UserList';
import Chat from './Chat';
import RoomList from './RoomList';
import socket from './lib/socket';

const Dashboard = () => {
  const [userName, setUserName] = useState(null);

  const onSubmitUsername = name => {
    setUserName(name);
    socket.emit('set username', name);
  }

  useEffect(() => {
    socket.emit('leave all rooms');
  }, []);

  return (
    <div>
      <h1>
        Dashboard<br />
        {userName}
      </h1>
      <p>
        {!userName &&
          <UsernameForm
            onSubmit={onSubmitUsername}
          />
        }
      </p>
      {userName &&
        <div>
          <UserList
            title="Zalogowani"
            eventName="users"
          />
          <Chat
            eventName="global chat message"
            title="Chat globalny"
          />
          <RoomList />
        </div>
      }
    </div>
  );
};

export default Dashboard;
