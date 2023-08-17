import { useState } from 'react';
import Chat from './components/chat';

function App() {
  const [tags, setTags] = useState([]);
  const [messages, setMessages] = useState([]);

  return (
    <div className="App">
      <Chat
        tags={tags}
        setTags={setTags}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}

export default App;
