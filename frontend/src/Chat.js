import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import socket from './lib/socket';

const Chat = ({ title, eventName }) => {
  const [msg, setMsg] = useState('');
  const [msgList, setMsgList] = useState([]);

  const submitMessage = e => {
    e.preventDefault();
    socket.emit(eventName, msg);
    setMsg('');
  }

  const receiveMessage = ({username, msg}) => {
    setMsgList(msgList.concat([{
      username,
      msg,
    }]));
  }

  useEffect(() => {
    socket.on(eventName, receiveMessage);
    return () => {
      socket.removeListener(eventName, receiveMessage);
    }
  }, [msgList, title, eventName]);

  return (
    <div>
      <h2>
        {title}
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

Chat.propTypes = {
  eventName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Chat;
