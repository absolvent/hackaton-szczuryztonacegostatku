import React, { useState, useEffect } from 'react';
import socket from './lib/socket';

const UserList = () => {
  const [userList, setUserList] = useState([]);

  const onUsersChange = users => {
    setUserList(users);
  }

  useEffect(() => {
    socket.on('users', onUsersChange);
    socket.emit('get users');
    return () => {
      socket.removeListener('users', onUsersChange);
    };
  }, []);

  return (
    <div>
      <h2>Lista userów</h2>
      <ul>
        {userList.map(({id, name}) => 
          <li
            key={id}
          >
            {name}
          </li>
        )}
      </ul>
    </div>
  );
};

export default UserList;
