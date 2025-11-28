"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWebSocketContext } from "../context/WebSocketContext.";
export const Room = () => {
  const { sendMessage } = useWebSocketContext();
  const [roomId, setRoomId] = useState<string>("");
  const router = useRouter();

  const createRoomHandler = () => {
    const createRoomId = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    setRoomId(createRoomId.toString());
    const name = localStorage.getItem("name") || "Player";
    const userId = localStorage.getItem("userId") || Math.random().toString(36).substring(7);

    const data = {
        name: name,
        type: "createRoom",
        admin: true,
        player: true,
        userId: userId,
        roomId: createRoomId.toString(),
        gameState: ["", "", "", "", "", "", "", "", ""],
      };
      localStorage.setItem("roomId", createRoomId.toString());
      router.push('/game');
      sendMessage(data)
      
  };
  const joinRoomHandler = () => {
    const name = localStorage.getItem("name") || "Player";
    const userId = localStorage.getItem("userId") || Math.random().toString(36).substring(7);

    const data = {
      name: name,
      type: "joinRoom",
      admin: false,
      player: true,
      userId: userId,
      roomId: roomId.toString(),
      gameState: ["", "", "", "", "", "", "", "", ""],
    };
    localStorage.setItem("roomId", roomId);
    router.push('/game')
    sendMessage(data);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-white mb-6">Game Room</h2>
        
        <button 
          onClick={createRoomHandler} 
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/30 mb-6"
        >
          Create New Room
        </button>
        
        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-white/20"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400">OR</span>
          <div className="flex-grow border-t border-white/20"></div>
        </div>

        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Enter Room ID"
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-center tracking-widest"
          />
          <button 
            onClick={joinRoomHandler}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!roomId}
          >
            Join Room
          </button>
        </div>
        
        {roomId && (
          <div className="mt-4 text-gray-400 text-sm">
            Current Room ID: <span className="font-mono text-white">{roomId}</span>
          </div>
        )}
      </div>
    </div>
  );
};
