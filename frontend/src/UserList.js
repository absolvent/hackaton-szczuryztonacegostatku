import React, { useState, useEffect } from 'react';
import socket from './lib/socket';

const UserList = ({ title, eventName }) => {
  const [userList, setUserList] = useState([]);

  const onUsersChange = users => {
    setUserList(users);
  }

  useEffect(() => {
    socket.on(eventName, onUsersChange);
    socket.emit(`get ${eventName}`);
    return () => {
      socket.removeListener(eventName, onUsersChange);
    };
  }, []);

  return (
    <div>
      <h2>{title}</h2>
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
