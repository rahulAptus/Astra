import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Main.css";
import { assets } from "../../assets/assets";

const Main = () => {
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate a unique thread ID when the component mounts
    const generatedThreadId = `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setThreadId(generatedThreadId);
  }, []);

  const handleSend = () => {
    if (input && threadId) {
      
      const userMessage = { sender: "user", text: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setLoading(true);

      axios
        .post("http://localhost:8000/ask", {
          query: input,
          thread_id: threadId,
        })
        .then((response) => {
          
          const { chatbot_response } = response.data;
          if (typeof chatbot_response === "string") {
            
            const botMessage = { sender: "bot", text: chatbot_response };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
            setError(null);
          } else {
            setError("Unexpected response format from the server.");
          }
        })
        .catch((error) => {
          console.error("Error sending query:", error);
          setError("Failed to send the query.");
        })
        .finally(() => {
          setLoading(false);
        });
      setInput("");
    } else {
      setError("Please enter a query and ensure the conversation is started.");
    }
  };

  return (
    <div className="main">
      <div className="nav">
        <img src={assets.astra_icon} alt="" />
      </div>
      <div className="main-container">
        <div className="greet">
          <span>Hello, User</span>
          <p>How may I help you today?</p>
        </div>
        <div className="cards">
          <div className="card">
            <p>Suggest beautiful places to see on an upcoming road trip</p>
            <img src={assets.compass_icon} alt="" />
          </div>
          <div className="card">
            <p>Briefly summarize this concept: urban planning</p>
            <img src={assets.bulb_icon} alt="" />
          </div>
          <div className="card">
            <p>Brainstorm team bonding activities for our work retreat</p>
            <img src={assets.message_icon} alt="" />
          </div>
          <div className="card">
            <p>Improve the readability of the following code</p>
            <img src={assets.code_icon} alt="" />
          </div>
        </div>

        <div className="conversation">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === "user" ? "user" : "bot"}`}
            >
              <p>{message.text}</p>
            </div>
          ))}
          {loading && (
            <div className="message bot">
              <p>Loading...</p>
            </div>
          )}
        </div>

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here "
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              {input ? (
                <img onClick={handleSend} src={assets.send_icon} alt="" />
              ) : null}
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its responses. Your privacy and Gemini Apps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
