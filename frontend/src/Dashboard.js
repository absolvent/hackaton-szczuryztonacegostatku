import React, { useState } from 'react';
import UsernameForm from './UsernameForm';
import UserList from './UserList';
import GlobalChat from './GlobalChat';
import socket from './lib/socket';

const Dashboard = () => {
  const [userName, setUserName] = useState(null);

  const onSubmitUsername = name => {
    setUserName(name);
    socket.emit('set username', name);
  }

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
          <UserList />
          <GlobalChat />
        </div>
      }
    </div>
  );
};

export default Dashboard;
