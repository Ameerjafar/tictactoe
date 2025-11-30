import { useWebSocketContext } from "../context/WebSocketContext";
import { useState, useEffect, useRef } from "react";
interface AllMessage {
  message: string;
  sentByYou: boolean;
}

export const Chat = () => {
  const { messages, sendMessage } = useWebSocketContext();
  const [message, setMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<AllMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const buttonHandler = () => {
    if (!message.trim()) return;
    const object = {
      type: "message",
      message,
      roomId: localStorage.getItem("roomId"),
    };
    setAllMessages((prevMessages) => [
      ...prevMessages,
      { message, sentByYou: true },
    ]);
    sendMessage(object);
  };

  useEffect(() => {
    console.log("inside the message handler")
    if (messages && messages.type === "message") {
      console.log("received from the messaage");
      setAllMessages((prevMessages) => [
        ...prevMessages,
        { message: messages.message, sentByYou: false },
      ]);
    }
    console.log(allMessages);
  }, [messages]);

  return (
    <div className="w-80 h-full flex flex-col bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-2xl">
      <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
        <div className="relative">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
        </div>
        <h2 className="text-lg font-bold text-white tracking-wide">Live Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {allMessages.length === 0 && (
          <div className="text-center text-white/30 mt-10 text-sm italic">
            No messages yet. Start the conversation!
          </div>
        )}
        {allMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sentByYou ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm font-medium shadow-md transition-all duration-200 hover:scale-[1.02] ${msg.sentByYou
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                : "bg-white/10 text-gray-100 border border-white/5 rounded-bl-none backdrop-blur-md"
                }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-black/20 border-t border-white/10">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buttonHandler()}
            placeholder="Type a message..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          />
          <button
            onClick={buttonHandler}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};