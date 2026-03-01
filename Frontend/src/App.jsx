import React, { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

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
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    // Validate input
    if (!inputValue.trim()) {
      toast.error("Please type a message!");
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
    toast.success("Message sent!");

    // Simulate bot response (replace with actual API call)
    setIsLoading(true);
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "This is a bot response. Integrate with your backend API for real conversations.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
      toast.success("Response received!");
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">AI ChatBot</h1>
        <p className="text-sm opacity-90">
          Your intelligent conversation partner
        </p>
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
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-md ${
                message.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-700 text-gray-100 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span
                className={`text-xs mt-2 block ${
                  message.sender === "user" ? "text-blue-100" : "text-slate-400"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-gray-100 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
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
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Shift+Enter for new line)"
            className="flex-1 resize-none bg-slate-700 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600 transition-all max-h-32"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 ${
              isLoading || !inputValue.trim()
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-linear-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg"
            }`}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          💡 Tip: Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default App;
