import { useState } from "react";
import {MdSend} from 'react-icons/md'
export const AssistantPanel = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, input]);
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col p-3 justify-between h-full">

  <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
    Assistant
  </h3>

  <div className="flex-1 overflow-y-auto space-y-3">

    {messages.length === 0 && (
      <p className="text-sm text-gray-400 text-center mt-10">
        Ask about your workflow
      </p>
    )}

    <div className="flex-1 overflow-y-auto space-y-3">

  {messages.map((msg, i) => (
    <div
      key={i}
      className="self-end bg-blue-500 text-white px-3 py-2 rounded-lg max-w-[80%]"
    >
      {msg}
    </div>
  ))}

</div> 
  </div>

  <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500">
    <input value={input} onChange={(e) => setInput(e.target.value)} className="bg-transparent outline-none text-sm flex-1 text-gray-700 dark:text-gray-200 placeholder-gray-400" />
    <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
      <MdSend/>
    </button>
  </div>

</div>
  );
};