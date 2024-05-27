import socketService from "@/services/socketService";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { MessageCircle, Send } from "lucide-react";

interface IGameMessage {
  message?: string;
  sender: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<IGameMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false); // Chat visibility state
  const sender = socketService.socket?.id || "";

  useEffect(() => {
    socketService.socket?.on("message", (messages) => {
      setMessages([...messages]);

      const chatBody = document.querySelector(".chat-messages") as Element;
      chatBody.scrollTop = chatBody.scrollHeight;
    });
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      // updatedMessages.push({ sender, message });
      setMessages([...messages, { sender, message }]);
      setMessage("");
      socketService.socket?.emit("send_message", [
        ...messages,
        { sender, message },
      ]);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const toggleChatVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <div
        className={`chat-container fixed bottom-12 right-0 flex flex-col bg-gray-200 shadow rounded h-96 w-80 ${
          !isVisible ? "hidden" : "block"
        }`}
      >
        <div className="chat-header relative w-full flex items-center h-12 px-3 bg-white border-b rounded-tl border-gray-200">
          <p className="p-2 font-bold text-gray-700">Chat</p>
        </div>
        <div className="chat-messages flex-grow overflow-y-auto p-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message flex items-start mb-3 ${
                msg.sender === sender ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {msg.sender !== sender && (
                <div className="chat-avatar mr-3">
                  <svg
                    className="w-8 h-8 rounded-full bg-gray-200 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 12c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              )}
              <div
                className={`chat-bubble px-4 py-2 rounded-lg shadow ${
                  msg.sender === sender
                    ? "bg-blue-100 text-gray-700"
                    : "bg-white text-gray-800"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input flex items-center px-3 py-2 border-t border-gray-200">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-grow w-full h-8 outline-none border border-gray-300 border-r-0 rounded-l-lg rounded-r-none px-3 py-1"
            placeholder="Message"
          />
          <Button className="w-8 h-8 bg-white hover:bg-white cursor p-1 outline-none border border-gray-300 border-l-0 rounded-r-lg rounded-l-none">
            <Send
              onClick={sendMessage}
              className="w-6 h-6 p-1 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full"
            />
          </Button>
        </div>
      </div>
      <Button
        variant="secondary"
        className="fixed bottom-2 right-2 rounded-full"
        onClick={toggleChatVisibility}
      >
        <MessageCircle className="w-full h-full" />
      </Button>
    </>
  );
};

export default Chat;
