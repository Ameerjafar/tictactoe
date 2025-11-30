"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useButtonText } from "../context/ButtonTextContext";

export const Room = () => {
  const { messages, sendMessage } = useWebSocketContext();
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
    // setButtonText("X");
    if (!spectator) {
      localStorage.setItem("symbol", "X");
    }
    localStorage.setItem("currentRound", "1");
    localStorage.setItem("spectator", spectator.toString());
    localStorage.setItem("isAdmin", "true");
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
      player: !spectator,
      userId: userId,
      roomId: roomId.toString(),
      gameState: ["", "", "", "", "", "", "", "", ""],
    };
    console.log("joinroom", data);

    localStorage.setItem("roomId", roomId.toString());
    // setButtonText("O");
    if (!spectator) {
      localStorage.setItem("symbol", "O");
    }
    localStorage.setItem("currentRound", "1");
    localStorage.setItem("spectator", spectator.toString());
    localStorage.setItem("isAdmin", "false");
    router.push("/game");
    sendMessage(data);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

        <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-white/10">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tighter mb-2">
              GAME ROOM
            </h2>
            <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">Enter the Arena</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={createRoomHandler}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 group border border-white/10"
            >
              <span className="text-lg">Create New Room</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-bold tracking-widest uppercase">OR JOIN EXISTING</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <input
                  type="text"
                  placeholder="ENTER ROOM ID"
                  onChange={(e) => setRoomId(e.target.value)}
                  className="relative w-full px-6 py-5 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 text-white placeholder-gray-600 text-center text-2xl font-mono tracking-widest transition-all"
                />
              </div>

              <button
                onClick={joinRoomHandler}
                disabled={!roomId}
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none border border-white/10 flex items-center justify-center gap-3"
              >
                <span>Join Room</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-1 bg-black/20 rounded-2xl border border-white/5">
              <button
                onClick={() => setSpectator(false)}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${!spectator ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <div className={`w-2 h-2 rounded-full ${!spectator ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]' : 'bg-gray-600'}`}></div>
                <span className="font-medium">Player</span>
              </button>
              <button
                onClick={() => setSpectator(true)}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${spectator ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <div className={`w-2 h-2 rounded-full ${spectator ? 'bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]' : 'bg-gray-600'}`}></div>
                <span className="font-medium">Spectator</span>
              </button>
            </div>

            <button
              onClick={() => router.push("/profile")}
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-semibold rounded-2xl transition-all border border-white/5 hover:border-white/20 flex items-center justify-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                👤
              </div>
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
