"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaPaperPlane, FaTimes, FaImage } from "react-icons/fa"; // Added FaImage for image upload icon
import useSocket from "./useSocket"; // custom socket hook
import { FormatData } from "@/lib/minterfaces"; // Your interface

const Chat = () => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<FormatData[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userAvatar, setUserAvatar] = useState("/user-avatar.png");
  const [_userName, setUserName] = useState("");
  const [image, setImage] = useState<File | null>(null); // New state for image
  const [imagePreview, setImagePreview] = useState<string | null>(null); 

  const { sendMessage, setName, sendImage } = useSocket(setMessages);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user", { credentials: "include" });
        const data = await res.json();
        if (data?.user) {
          if (data.user.avatar) setUserAvatar(data.user.avatar);
          if (data.user.name) {
            setUserName(data.user.name);
            setName(data.user.name);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [setName]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() && !image) return; // Prevent sending empty messages or images without text

    setExpanded(true);
    if (input.trim()) {
  sendMessage(input);
    }
    if (image) {
      sendImage(image); // Send the image to the backend or display it in the chat
      setMessages((prev) => [
        ...prev,
        { sender: "user", image: URL.createObjectURL(image) }
      ]);
      setImage(null); 
      setImagePreview(null); // Clear image preview
    }
    setInput(""); // Clear input
    setIsTyping(true);

    try {
      sendMessage(input);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "❌ Sorry, I couldn't process that request. Please try again later." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle image file selection or drag and drop
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Set image preview
    }
  };

  // Handle drag and drop image
  // const handleDragOver = (e: React.DragEvent) => {
  //   e.preventDefault();
  // };

  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   const file = e.dataTransfer.files?.[0];
  //   if (file) {
  //     setImage(file);
  //     setImagePreview(URL.createObjectURL(file)); // Set image preview
  //   }
  // };

  return (
    <section className="flex flex-col items-center text-center mt-10 px-4">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to</h1>
      <h1 className="text-6xl font-bold text-red-600">MedAI</h1>
      <h2 className="text-xl font-bold text-blue-600">(AI-Powered Medical Diagnosis)</h2>
      <p className="text-gray-600 mt-2">Enter symptoms or upload an image for AI-based analysis.</p>

      <div className="relative flex flex-col items-center justify-center mt-auto">
        {/* Chat Box */}
        {expanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-1 sm:top-20 sm:left-20 sm:right-20 sm:bottom-5 bg-white shadow-xl flex flex-col z-50 w-75 h-full sm:w-auto sm:h-auto rounded-lg overflow-x-hidden"
          >
            {/* Header */}
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold flex justify-between items-center">
              <span>MedAI Chat</span>
              <button onClick={() => setExpanded(false)} className="text-lg"><FaTimes /></button>
            </div>

            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#f9fafe]">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start gap-2 font-medium ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                    <img
                      src={msg.sender === "user" ? userAvatar : "/AI.png"}
                      alt="avatar"
                      className={`object-cover w-10 h-10 rounded-full ${msg.sender === "user" ? "border-2 border-green-500" : ""}`}
                    />
                    <span
                      className={`px-4 py-2 rounded-lg max-w-[70%] text-left 
                        ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-[#e0f2f1] text-gray-800"} 
                        whitespace-pre-wrap break-all overflow-hidden`}
                    >
                      {msg.text}
                    </span>
                    {/* Display Image if it exists */}
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Uploaded"
                        className="max-w-[200px] mt-2 rounded-md"
                      />
                    )}
                  </div>
                </motion.div>
              ))}
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

            {/* Input */}
            <div className="flex items-center border-t p-2 bg-gray-100">
              <input
                type="text"
                className="flex-grow p-2 border rounded-l-lg outline-none"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <div className="flex items-center gap-2">
                {/* Image Upload Button inside Chat */}
                <label
                  htmlFor="image-upload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-l-lg cursor-pointer hover:bg-blue-700"
                >
                  <FaImage />
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                {/* Send Message Button */}
                <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
                  <FaPaperPlane />
                </button>
              </div>
            </div>

            {/* Image Preview Section */}
            {imagePreview && (
              <div className="w-full p-2 flex justify-center mt-2">
                <img src={imagePreview} alt="Preview" className="max-w-[200px] rounded-md" />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-96 p-5 flex flex-col items-center">
            <div className="flex w-full max-w-md">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Enter symptoms..."
                className="w-full p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
              <button onClick={() => setExpanded(true)} className="bg-blue-600 text-white px-5 py-3 rounded-r-md hover:bg-blue-700">
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
