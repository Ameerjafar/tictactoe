"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GameBoard } from "../component/GameBoard";
import { Chat } from "../component/Chat";

export default function GamePage() {
  const router = useRouter();

  useEffect(() => {
    const roomId = localStorage.getItem("roomId");
    if (!roomId) {
      router.push("/room");
    }
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black">
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

