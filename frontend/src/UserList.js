import React, { useState, useEffect } from 'react';
import socket from './lib/socket';

const readyPlaerBadge = (userId, readyPlayersIdList) => {
  if (!readyPlayersIdList && (typeof readyPlayersIdList == 'undefined' || typeof readyPlayersIdList.length == 'undefined')) {
    return null;
  }

  return readyPlayersIdList.includes(userId) ? ' GOTOWY' : ' CZEKA';
}

const UserList = ({ title, eventName, readyPlayersIdList }) => {
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
            {name} {readyPlaerBadge(id, readyPlayersIdList)}
          </li>
        )}
      </ul>
    </div>
  );
};

UserList.defaultProp = {
  readyPlayersIdList: false,
};

export default UserList;
