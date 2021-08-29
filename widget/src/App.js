import ChatWidget from "react-styled-chat-widget";
import React, {useCallback, useEffect, useState} from 'react';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState(null);


  const receiveMessage = (event) => {
    console.log('==========receiveMessage============');
    console.log(`WIDGET EVENT NAME: ${event.data.eventName}`);
    console.log(`WIDGET EVENT DATA: ${event.data.data}`);
    console.log('====================================');
    // if (event.data.eventName === 'done') {
    //   setOrigin(event.data.origin)
    // }
  }

  useEffect(() => {
    window.addEventListener("message", receiveMessage, false);
  }, [])
  
  useEffect(() => {
    // load some messages from history here using setMessages
    setLoading(false);
  }, []);


  // used to switch message delivery indicator
  const onMessageSend = useCallback((currentID, setDeliveryStatus) => {
    setDeliveryStatus();
  }, []);

  // called when user presses the send button
  const onSendClick = useCallback((message: string) => {
    window.parent.postMessage({ eventName: 'hide', data: { message }}, 'http://127.0.0.1:5500/')
    setMessages((messages) => {
      return [
        ...messages,
        {id: Math.floor(Math.random() * 10000), isPrimary: true, date: new Date(), sent: true, message, author: 'You'},
      ]
    })
  }, []);


  return (
    <ChatWidget
      defaultPosition={'bottomRight'}
      messages={messages} // required
      loading={loading} // required
      onMessageSend={onMessageSend} // required
      onSendClick={onSendClick} // required
      spinner={<div>loading...</div>} // required
    >
      <div>
        <p>Welcome to support window!</p>
        <hr/>
        <p>Here you can chat directly with moderators. They usually answer in a few hours.</p>
      </div>
    </ChatWidget>
  );
}

export default App;
