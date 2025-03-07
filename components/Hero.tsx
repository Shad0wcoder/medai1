'use client'
import { useState } from 'react';
import { FaSearch } from "react-icons/fa";

export default function Hero() {
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <section 
      className="flex flex-col items-center text-center mt-10 px-4">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to</h1>
      <h1 className="text-6xl font-bold text-red-600">MedAI</h1>
      <h2 className="text-1xl font-bold text-blue-600">(AI-Powered Medical Diagnosis)</h2>
      <p className="text-gray-600 mt-2">Enter symptoms or upload an image for AI-based analysis.</p>

      {/* Search Bar */}
      <div className="mt-10 flex w-full max-w-md">
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter symptoms..." 
          className="w-full p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md "
        />
        <button className="bg-blue-600 text-white px-5 py-3 rounded-r-md hover:bg-blue-700">
            <FaSearch />
        </button>
      </div>

      {/* Image Upload */}
      <div className="mt-6">
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileUpload"/>
        <label htmlFor="fileUpload" className="cursor-pointer bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
          {selectedFile ? selectedFile.name : "Upload an Image"}
        </label>
      </div>

      {/* Chatbot Placeholder */}
      <div className="mt-8 p-6 bg-white shadow-md rounded-lg w-full max-w-lg">
        <h2 className="text-lg font-semibold">AI Chatbot</h2>
        <p className="text-gray-500">Start chatting with MedAI for symptom analysis.</p>
      </div>
    </section>
  );
}