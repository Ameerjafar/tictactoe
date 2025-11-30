"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GameBoard } from "../component/GameBoard";
import { Chat } from "../component/Chat";

export default function GamePage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRoomId = localStorage.getItem("roomId");

    if (!token) {
      router.push("/signin");
      return;
    }

    if (!storedRoomId) {
      router.push("/room");
    } else {
      setRoomId(storedRoomId);
    }
  }, [router]);

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {roomId && (
        <div className="absolute top-4 right-4 z-50">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 flex items-center gap-3 shadow-lg">
            <span className="text-gray-400 text-sm font-medium">Room ID:</span>
            <span className="text-white font-mono font-bold tracking-wider">{roomId}</span>
            <button
              onClick={copyRoomId}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white group"
              title="Copy Room ID"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      <div>
        <Chat />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="z-10 flex flex-col items-center">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-12 tracking-widest drop-shadow-2xl">
            TIC TAC TOE
          </h1>
          <GameBoard />
        </div>
      </div>
    </div>
  );
}

