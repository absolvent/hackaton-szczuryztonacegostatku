import React, { useState, useEffect } from 'react';
import socket from './lib/socket';

const GlobalChat = () => {
  const [msg, setMsg] = useState('');
  const [msgList, setMsgList] = useState([]);

  const submitMessage = e => {
    e.preventDefault();
    socket.emit('global chat message', msg);
    setMsg('');
  }

  const receiveMessage = ({username, msg}) => {
    setMsgList(msgList.concat([{
      username,
      msg,
    }]));
  }

  useEffect(() => {
    socket.on('global chat message', receiveMessage);
    return () => {
      socket.removeListener('global chat message', receiveMessage);
    }
  }, [msgList]);

  return (
    <div>
      <h2>
        Globalny chat
      </h2>
      <p>
        <ul>
          {msgList.map(({ username, msg }, index) => 
            <li key={index}>
              <strong>{username}</strong>: {msg}
            </li>
          )}
        </ul>
      </p>
      <p>
        <form
          onSubmit={submitMessage}
        >
          <input
            type="text"
            placeholder="Twoja wiadomość"
            onChange={({ target }) => {
              setMsg(target.value);
            }}
            value={msg}
          />
          <button>
            Wyślij
          </button>
        </form>
      </p>
    </div>
  );
}

export default GlobalChat;
