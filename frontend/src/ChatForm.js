import React, { useState, useEffect } from 'react';
import socket from './lib/socket';

const ChatForm = () => {
  const [msg, setMsg] = useState('');
  const [msgList, setMsgList] = useState([]);

  socket.on('chat message', (msg) => {
    setMsgList(msgList.concat([msg]));
  });

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