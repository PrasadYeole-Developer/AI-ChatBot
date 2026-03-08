import React, { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { GrSend } from "react-icons/gr";
import { FaHourglassEnd } from "react-icons/fa6";

const App = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    // Validate input
    if (!inputValue.trim()) {
      toast.error("Please enter the message!");
      return;
    }

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    setIsLoading(true);
    socket.emit("get-content", { prompt: inputValue });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);
    textareaRef.current?.focus();

    socketInstance.on("ai-response", (data) => {
      const botMessage = {
        id: messages.length + 1,
        text: data.response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
      textareaRef.current?.focus();
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-[#1E2022] via-[#1E2022] to-black select-none">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            background: "#ab0022",
            color: "#fff",
            font: "0.875rem 'Noto Sans', sans-serif",
            padding: "12px 20px",
            borderRadius: "0.150rem",
          },
        }}
      />
      {/* Header */}
      <div className="bg-[#C9D6DF] text-[#1E2022] p-5 shadow-lg flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black pb-1">YapBot</h1>
        <p className="text-xs opacity-90">Your AI chat buddy</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded shadow-md ${
                message.sender === "user"
                  ? "bg-[#52616B]/30 text-[#F0F5F9] rounded-br-none"
                  : "bg-[#52616B]/50 text-[#F0F5F9] rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className={`text-xs mt-2 block text-gray-400`}>
                {message.timestamp
                  .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .toUpperCase()}
              </span>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#52616B]/50 text-gray-100 px-5 py-5 rounded rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 p-1 bg-[#C9D6DF] rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 p-1 bg-[#C9D6DF] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 p-1 bg-[#C9D6DF] rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-800 p-4 shadow-lg">
        <div className="flex space-x-3">
          <textarea
            value={inputValue}
            ref={textareaRef}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 resize-none bg-slate-700 text-white placeholder-gray-400 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9D6DF] border border-slate-600 transition-all max-h-32"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className={`px-6 py-3 rounded font-semibold transition-transform hover:scale-105 cursor-pointer active:scale-95 ${
              isLoading || !inputValue.trim()
                ? "bg-[#52616B] text-gray-400 cursor-not-allowed"
                : "bg-linear-to-br from-[#1E2022] via-[#1E2022]/90 to-[#52616B] text-white hover:shadow-lg"
            }`}
          >
            {isLoading ? (
              <FaHourglassEnd className="animate-spin" />
            ) : (
              <GrSend />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Press Enter to Send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};

export default App;
