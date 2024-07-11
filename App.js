import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import trivia from "./trivia.json"

const CHATBOT_USER_OBJ = {
  _id: 2,
  name: "React Native Chatbot",
  avatar: "https://loremflickr.com/140/140",
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [questionCounter, setQuestionCounter] = useState(0);
  const [userReady, setUserReady] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [score, setScore] = useState(1);

  useEffect(() => {
    if (messages.length < 1) {
      // Add a "starting message" when chat UI first loads
      addBotMessage(
        "Hello! Welcome to Allison's trivia chat bot! Say 'Go' when you're ready to play! 🧐"
      );
    }
  }, []);

  const addNewMessage = (newMessages) => {
    setMessages((previousMessages) => {
      // console.log("PREVIOUS MESSAGES:", previousMessages);
      // console.log("NEW MESSAGE:", newMessages);
      return GiftedChat.append(previousMessages, newMessages);
    });
  };

  const addBotMessage = (text) => {
    addNewMessage([
      {
        _id: Math.round(Math.random() * 1000000),
        text: text,
        createdAt: new Date(),
        user: CHATBOT_USER_OBJ,
      },
    ]);
  };

  const respondToUser = (userMessages) => {
    console.log("Recent user msg:", userMessages[0].text);
    if (!userReady && userMessages[0].text.toLowerCase() != 'go') { // user is not ready and has not said go
      addBotMessage("No rush, say 'Go' when you are ready to start...");
      return;
    }
    else if ((userReady && !waiting) || userMessages[0].text.toLowerCase() === 'go') { // user has said go to start the game or has said next to get the next question
      if (userMessages[0].text.toLowerCase() != 'go') {
        addBotMessage("Say 'Go' for the next question!")
        return;
      }
      console.log(questionCounter)
      setUserReady(true);
      addBotMessage(`Question ${questionCounter + 1}: ${trivia[questionCounter].question}`);
      setWaiting(true);
    }
    else if (waiting) { // waitng for user's answer user's answer
      if (userMessages[0].text.toLowerCase() === trivia[questionCounter].answer || userMessages[0].text === trivia[questionCounter].answer) {
        addBotMessage("Correct! 😎✅");
      } else {
        addBotMessage("Incorrect... 😭❌ Try again.");
        return;
      }
      setQuestionCounter(questionCounter + 1)
      if (questionCounter + 1 == trivia.length) {
        addBotMessage("No more questions! Thanks for playing Allison's trivia chat bot! 🫶")
        return;
      }
      setWaiting(false)
      addBotMessage("Say 'Go' for the next question!")
    }
  };

  const onSend = useCallback((messages = []) => {
    addNewMessage(messages);
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => {
        onSend(messages);
        // Wait a sec before responding
        setTimeout(() => respondToUser(messages), 1000);
      }}
      user={{
        _id: 1,
        name: "Baker",
      }}
      renderUsernameOnMessage={true}
    />
  );
}

// Workaround to hide an unnessary warning about defaultProps
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};
