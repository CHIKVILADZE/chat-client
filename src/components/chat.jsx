import React, { useState, useEffect } from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Timeline } from 'primereact/timeline';
import { io } from 'socket.io-client';
import TagsInput from './TagsInput'; // Import TagsInput component

const socket = io('http://localhost:3001');

function Chat({ setMessages, messages }) {
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [tags, setTags] = useState([]);

  const [tagMessages, setTagMessages] = useState({});

  socket.on('fetchedMessages', (fetchedMessages) => {
    // Group messages by tags
    const messagesByTags = {};
    fetchedMessages.forEach((message) => {
      if (message.tags && typeof message.tags === 'string') {
        const messageTags = message.tags.split(',').map((tag) => tag.trim());
        messageTags.forEach((tag) => {
          if (!messagesByTags[tag]) {
            messagesByTags[tag] = [];
          }
          messagesByTags[tag].push(message);
        });
      }
    });
    setTagMessages(messagesByTags);
  });

  socket.on('chat', (arg) => setMessages([...messages, arg]));

  const addMessage = () => {
    if (message || tags.length > 0) {
      const send = { author, message: message || tags.join(', '), tags: tags };
      setMessages([...messages, send]);
      setMessage('');
      setTags([]);
      socket.emit('chat', send);
    }
  };

  return (
    <>
      <div className="mytagsvalues">
        <input
          className="userName"
          placeholder="Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <TagsInput
          tags={tags}
          setTags={setTags}
          messages={messages}
          setMessages={setMessages}
          tagMessages={tagMessages}
        />
        <Button label="Send" onClick={addMessage} />
      </div>
      <div className="card">
        <Timeline
          value={messages}
          opposite={(item) => item.author}
          content={(item) => (
            <small className="p-text-secondary">{item.message}</small>
          )}
        />
      </div>
    </>
  );
}

export default Chat;
