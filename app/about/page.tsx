"use client";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-4">About MedAI</h2>
        <p className="text-gray-600 text-center mb-6">
          MedAI is an intelligent healthcare assistant that helps users analyze their symptoms,
          get potential disease insights, and receive medical advice using advanced AI.
        </p>

        {/* Mission Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-blue-500">🌍 Our Mission</h3>
          <p className="text-gray-700 mt-2">
            Our mission is to make healthcare **accessible, efficient, and proactive** using AI-driven
            technology. We aim to provide **instant symptom analysis, multilingual support, and real-time insights** 
            for users worldwide.
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-blue-500">🚀 Key Features</h3>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>AI-powered **symptom analysis**</li>
            <li>Multilingual support with **DeepL API** integration</li>
            <li>Smart health recommendations and doctor referrals</li>
            <li>Secure and **privacy-focused** data management</li>
            <li>Real-time alerts and health monitoring</li>
          </ul>
        </div>

        {/* Vision Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-blue-500">💡 Our Vision</h3>
          <p className="text-gray-700 mt-2">
            We envision a future where **AI bridges the gap between people and healthcare**, ensuring
            everyone has access to accurate and reliable medical insights—anytime, anywhere.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-gray-700">Want to know more? <a href="/contact" className="text-blue-500 hover:underline">Contact us</a></p>
        </div>
      </div>
    </div>
  );
}
