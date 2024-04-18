import { useState, useEffect, FormEvent } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

interface message {
  receiver: string
  content: string
}

function App() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<message[]>([]);

  useEffect(() => {
    socket.on("message", (data:message) => {
      setMessages((state:message[])=> [...state, data])
    });
    return () => {socket.off("message")}
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("message", text);
    setMessages([...messages, {receiver: "Me: ", content: text}])
    setText("");
  };



  return (
    <div className="container">
      <div className="screen">
        {messages.map((message:message, index:number)=> (
            message.receiver === "Me: " ? (
              <div key={index}>
                <p className="right"><b>{message.receiver}</b>{message.content}</p>
              </div>
            ) : (
              <div key={index}>
                <p className="left"><b>{message.receiver}</b>{message.content}</p>
              </div>
            )
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input id="input" value={text} type="text" onChange={(e) => setText(e.target.value)} autoFocus spellCheck autoComplete="off"/>
        <button>Send</button>
      </form>
    </div>
  );
}

export default App;
