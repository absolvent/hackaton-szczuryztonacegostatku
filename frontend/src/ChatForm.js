import React, { useState, useEffect } from 'react';
import socket from './lib/socket';

const ChatForm = () => {
  const [msg, setMsg] = useState('');
  const [msgList, setMsgList] = useState([]);

  const getMsgList = ({ msg, id }) => {
    setMsgList(msgList.concat([msg]));
    console.log(id);
  };

  useEffect(() => {
    socket.on('chat message', getMsgList);

    return () => {
      socket.removeListener('chat message', getMsgList);
    }
  }, [msgList])

  return  (
    <div>
      <ul>
        {msgList.map(msg => (
          <li>{msg}</li>
        ))}
      </ul>
      <input 
        type="text"
        onChange={e => setMsg(e.target.value)}
        value={msg}
      />
      <button
        onClick={() => {
          socket.emit('chat message', msg);
          setMsg('');
        }}
      >
        Wyślij
      </button>
    </div>
  );
};

export default ChatForm;