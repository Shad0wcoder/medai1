"use client";
import { useState } from "react";

const faqs = [
  {
    question: "What is MedAI?",
    answer: "MedAI is an intelligent diagnosis and healthcare assistant that analyzes user symptoms and provides potential disease predictions, medical advice, and doctor recommendations."
  },
  {
    question: "How does MedAI analyze symptoms?",
    answer: "MedAI uses AI and machine learning algorithms to compare your symptoms with medical databases and provide possible conditions and advice."
  },
  {
    question: "Can MedAI replace a doctor?",
    answer: "No, MedAI is designed to assist users with preliminary diagnosis and guidance. It should not replace professional medical consultation."
  },
  {
    question: "Is my medical data secure?",
    answer: "Yes, we prioritize data privacy and security. Your information is encrypted and not shared with third parties."
  },
  {
    question: "Does MedAI support multiple languages?",
    answer: "Yes! MedAI integrates with the DeepL API to provide multilingual symptom translation, making healthcare accessible to more users worldwide."
  },
  {
    question: "Can I upload images for diagnosis?",
    answer: "We are working on integrating an AI-powered image recognition feature for enhanced diagnosis capabilities."
  },
  {
    question: "How can I contact a doctor through MedAI?",
    answer: "MedAI provides recommendations for nearby doctors and telemedicine services based on your condition."
  },
  {
    question: "Is MedAI free to use?",
    answer: "MedAI offers basic features for free, but premium features like advanced diagnosis and doctor consultations may require a subscription."
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">MedAI - Frequently Asked Questions</h2>
        
        {faqs.map((faq, index) => (
          <div key={index} className="border-b">
            <button 
              className="w-full text-left p-4 flex justify-between items-center text-lg font-medium focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className="text-blue-500">{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && (
              <p className="p-4 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
