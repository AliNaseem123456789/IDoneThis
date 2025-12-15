import React from "react";

export default function Chatbot() {
  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-xl overflow-hidden border z-50">
      <div className="bg-indigo-500 text-white px-4 py-2 flex justify-between items-center">
        <span>AI Agent</span>
        <span className="text-xs opacity-75">Online</span>
      </div>
      <div className="p-4 text-gray-700 text-sm h-48 overflow-y-auto">
        <p>I'm AI Agent from Company. How can I help you today?</p>
      </div>
      <div className="flex border-t">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-2 outline-none text-sm"
        />
        <button className="px-4 bg-indigo-500 text-white text-sm">Send</button>
      </div>
    </div>
  );
}
