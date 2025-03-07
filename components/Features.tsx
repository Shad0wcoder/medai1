'use client';
import React from 'react';
export default function Features() {
    return (
      <section className="max-w-6xl mx-auto mt-12 px-4 text-center">
        <h2 className="text-3xl font-bold text-blue-600">Why Choose MedAI?</h2>
        <p className="text-gray-600 mt-2">Experience next-level AI-driven healthcare assistance.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Feature 1 */}
          <div className="p-6 bg-white shadow-md rounded-md">
            <h3 className="text-xl font-semibold">Instant Diagnosis</h3>
            <p className="text-gray-500 mt-2">Get AI-driven medical insights based on symptoms.</p>
          </div>
          {/* Feature 2 */}
          <div className="p-6 bg-white shadow-md rounded-md">
            <h3 className="text-xl font-semibold">Image Recognition</h3>
            <p className="text-gray-500 mt-2">Upload skin or injury images for quick medical analysis.</p>
          </div>
          {/* Feature 3 */}
          <div className="p-6 bg-white shadow-md rounded-md">
            <h3 className="text-xl font-semibold">24/7 AI Chatbot</h3>
            <p className="text-gray-500 mt-2">Get medical advice anytime, anywhere.</p>
          </div>
        </div>
      </section>
    );
  }
  