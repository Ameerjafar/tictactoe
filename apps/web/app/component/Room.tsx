"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useButtonText } from "../context/ButtonTextContext";

export const Room = () => {
  const { sendMessage } = useWebSocketContext();
  const { setButtonText } = useButtonText();
  const [roomId, setRoomId] = useState<string>("");
  const [spectator, setSpectator] = useState(false);
  const router = useRouter();
  const createRoomHandler = () => {
    const createRoomId = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    setRoomId(createRoomId.toString());
    const name = localStorage.getItem("name") || "Player";
    const userId =
      localStorage.getItem("userId") || Math.random().toString(36).substring(7);

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
    setButtonText("X"); 
    if(!spectator) {
      localStorage.setItem("symbol", "X");
    }
    localStorage.setItem("currentRound", "1");
    localStorage.setItem("spectator", spectator.toString());
    router.push("/game");
    sendMessage(data);
  };
  const joinRoomHandler = () => {
    const name = localStorage.getItem("name") || "Player";
    const userId =
      localStorage.getItem("userId") || Math.random().toString(36).substring(7);

    const data = {
      name: name,
      type: "joinRoom",
      admin: false,
      player: spectator,
      userId: userId,
      roomId: roomId.toString(),
      gameState: ["", "", "", "", "", "", "", "", ""],
    };

    localStorage.setItem("roomId", roomId.toString());
    setButtonText("O");
    if(!spectator) {
      localStorage.setItem("symbol", "O");
    }
    localStorage.setItem("currentRound", "1");
    localStorage.setItem("spectator", spectator.toString());
    router.push("/game");
    sendMessage(data);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 w-full max-w-md text-center">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-8 tracking-tight">
            GAME ROOM
          </h2>

          <button
            onClick={createRoomHandler}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/20 mb-8 flex items-center justify-center gap-2 group"
          >
            <span className="text-lg">Create New Room</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
          </button>

          <div className="relative flex py-2 items-center mb-8">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-sm font-medium tracking-wider">OR JOIN EXISTING</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Room ID"
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-6 py-4 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-600 text-center text-xl tracking-widest transition-all"
              />
            </div>
            
            <button
              onClick={joinRoomHandler}
              disabled={!roomId}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              Join Room
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 p-4 bg-white/5 rounded-xl border border-white/5">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="radio" 
                  name="role" 
                  className="peer sr-only" 
                  onChange={() => setSpectator(false)} 
                  defaultChecked 
                />
                <div className="w-5 h-5 border-2 border-gray-500 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all"></div>
              </div>
              <span className="text-gray-400 group-hover:text-white transition-colors">Player</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="radio" 
                  name="role" 
                  className="peer sr-only" 
                  onChange={() => setSpectator(true)} 
                />
                <div className="w-5 h-5 border-2 border-gray-500 rounded-full peer-checked:border-purple-500 peer-checked:bg-purple-500 transition-all"></div>
              </div>
              <span className="text-gray-400 group-hover:text-white transition-colors">Spectator</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
