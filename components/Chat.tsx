"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaImage, FaPaperPlane, FaTimes } from "react-icons/fa";
import axios from "axios";

const Chat = () => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text?: string; image?: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userAvatar, setUserAvatar] = useState("/user-avatar.png");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user', { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
        const data = await res.json();
        if (data?.user?.avatar) {
          setUserAvatar(data.user.avatar);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);


  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setExpanded(true);
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", { text: input });

      if (response?.data?.result) {
        const { Disease, Precautions, Treatments } = response.data.result;

        let formattedResponse = `🩺 **Diagnosis Suggestion:**\n\n`;
        formattedResponse += `🔍 Possible Condition: **${Disease}**\n\n`;

        formattedResponse += `🛑 **Precautions to Take:**\n`;
        formattedResponse += Precautions?.length
          ? Precautions.map((precaution) => `• ${precaution}`).join("\n") + "\n\n"
          : "• No specific precautions listed.\n\n";

        formattedResponse += `💊 **Recommended Treatments:**\n`;
        formattedResponse += Treatments?.length
          ? Treatments.map((treatment) => `• ${treatment}`).join("\n")
          : "• No specific treatments listed.";

        setMessages((prev) => [...prev, { sender: "ai", text: formattedResponse }]);
      } else {
        setMessages((prev) => [...prev, { sender: "ai", text: "⚠️ Unexpected response format. Please try again." }]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { sender: "ai", text: "❌ Sorry, I couldn't process that request. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section className="flex flex-col items-center text-center mt-10 px-4">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to</h1>
      <h1 className="text-6xl font-bold text-red-600">MedAI</h1>
      <h2 className="text-xl font-bold text-blue-600">(AI-Powered Medical Diagnosis)</h2>
      <p className="text-gray-600 mt-2">Enter symptoms or upload an image for AI-based analysis.</p>

      <div className="relative flex flex-col items-center justify-center mt-auto">
        {/* Chat Section */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-1 sm:top-20 sm:left-20 sm:right-20 sm:bottom-5 
                       bg-white shadow-xl flex flex-col z-50 
                       w-75 h-full sm:w-auto sm:h-auto rounded-lg"
          >
            {/* Chat Header */}
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold flex justify-between items-center">
              <span>MedAI Chat</span>
              <button onClick={() => setExpanded(false)} className="text-lg"><FaTimes /></button>
            </div>

            {/* Chat Messages Area with Auto-Scroll */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#f9fafe]">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                    {/* Profile Icon */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">
                      <img
                        src={msg.sender === "user" ? userAvatar : "/AI.png"}
                        alt="avatar"
                        className={`object-cover
    ${msg.sender === "user" ? "w-10 h-10 rounded-full border-2 border-green-500" : "w-10 h-10"}`}
                      />


                    </div>

                    {/* Text Message */}
                    {msg.text && (
                      <span
                        className={`px-4 py-2 rounded-lg max-w-[70%] text-left ${msg.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-[#e0f2f1] text-gray-800"
                          } break-words whitespace-pre-line`}
                      >
                        {msg.text}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}


              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
                  className="p-2 flex justify-start"
                >
                  <span className="px-3 py-1 rounded-lg bg-gray-200 text-gray-600">MedAI is analyzing...</span>
                </motion.div>
              )}
            </div>

            {/* Chat Input Field */}
            <div className="flex items-center border-t p-2 bg-gray-100">
              <input
                type="text"
                className="flex-grow p-2 border rounded-l-lg outline-none"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {/* Send Button */}
              <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
                <FaPaperPlane />
              </button>
            </div>
          </motion.div>
        )}

        {/* Initial Input Section */}
        {!expanded && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-96 p-5 flex flex-col items-center">
            <div className="flex w-full max-w-md">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter symptoms..."
                className="w-full p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
              <button onClick={handleSendMessage} className="bg-blue-600 text-white px-5 py-3 rounded-r-md hover:bg-blue-700">
                <FaSearch />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Chat;
