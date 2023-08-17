import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://chat-x360.onrender.com');

function TagsInput({ tags, setTags, messages, setMessages }) {
  const [value, setValue] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    socket.emit('fetchMessages');
    socket.on('fetchedMessages', (fetchedMessages) => {
      setMessages(fetchedMessages);
      console.log(fetchedMessages);
    });

    return () => {
      socket.off('fetchedMessages');
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    const value = tagInput.trim();
    if (!value) return;
    setTags([...tags, value]);
    setTagInput('');
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
    console.log('Search', searchTerm);
  };

  const removeTag = (index) => {
    setTags(tags.filter((el, i) => i !== index));
  };

  return (
    <div>
      <div className="tags-input-container">
        <input
          type="text"
          placeholder="Add a Tag"
          className="tags-input"
          onKeyDown={handleKeyDown}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />

        {tags.map((tag, index) => (
          <div className="tag-item" key={index}>
            <span className="text">{tag}</span>
            <span className="close" onClick={() => removeTag(index)}>
              &times;
            </span>
          </div>
        ))}
      </div>
      <div className="search-container">
        <div className="search-inner">
          <input
            type="text"
            className="input-search"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setTagInput(e.target.value);
            }}
          />
        </div>
        <div className="dropdown">
          {messages
            .filter((message) =>
              message.message.toLowerCase().startsWith(value.toLowerCase())
            )
            .map((message, index) => (
              <div
                className="dropdown-row"
                onClick={() => {
                  setTagInput(message.message);
                  onSearch(message.message);
                }}
                key={index}
              >
                <span className="text">{message.message}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default TagsInput;
