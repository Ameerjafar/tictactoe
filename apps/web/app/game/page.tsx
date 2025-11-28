"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GameBoard } from "../component/GameBoard";

export default function GamePage() {
  const router = useRouter();

  useEffect(() => {
    const roomId = localStorage.getItem("roomId");
    if (!roomId) {
      router.push("/room");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8 tracking-wider drop-shadow-lg">TIC TAC TOE</h1>
      <GameBoard />
    </div>
  );
}
