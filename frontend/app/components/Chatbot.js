"use client";

import { useState } from "react";

export default function Chatbot({ recipeId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const res = await fetch(`http://localhost:8001/ask/${recipeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });

    const data = await res.json();
    const botMsg = { sender: "bot", text: data.answer };
    setMessages((prev) => [...prev, botMsg]);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-amber-600 text-white px-4 py-2 rounded shadow"
      >
        {isOpen ? "Close Chat" : "Ask a Question"}
      </button>

      {isOpen && (
        <div className="mt-2 w-96 h-[400px] bg-amber-900 text-amber-100 rounded-lg shadow-lg flex flex-col p-3">
          <div className="flex-1 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md ${
                  msg.sender === "user" ? "bg-amber-700 text-right" : "bg-amber-800"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              className="flex-1 px-3 py-2 rounded text-black"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask something about this recipe..."
            />
            <button
              onClick={handleSend}
              className="bg-amber-600 text-white px-3 py-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
