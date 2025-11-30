"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useButtonText } from "../context/ButtonTextContext";

export default function GameOver() {
  const [winner, setWinner] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { buttonText, setButtonText } = useButtonText();
  const { sendMessage, messages } = useWebSocketContext();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roomId = localStorage.getItem("roomId");

    if (!token) {
      router.push("/signin");
      return;
    }

    if (!roomId) {
      router.push("/room");
      return;
    }

    const storedWinner = localStorage.getItem("winnerSymbol");
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setWinner(storedWinner);
    setIsAdmin(adminStatus);
  }, [router]);

  useEffect(() => {
    if (messages && messages?.type === "restartGame") {
      console.log("restart game is calling");
      localStorage.removeItem("winnerSymbol");
      const symbol: any = localStorage.getItem("symbol");
      if (symbol === "X") {
        localStorage.setItem("symbol", "O");
      } else if (symbol === "O") {
        localStorage.setItem("symbol", "X");
      }
      setButtonText("X");
      router.push("/game");
    }
  }, [messages]);

  const handlePlayAgain = () => {
    localStorage.removeItem("winnerSymbol");
    const restartObject = {
      type: "restartGame",
      roomId: localStorage.getItem("roomId"),
    };
    sendMessage(restartObject);
    const gameStateObject = {
      gameState: ["", "", "", "", "", "", "", "", ""],
      type: "updateGameState",
      roomId: localStorage.getItem("roomId"),
      symbol: ""
    };
    sendMessage(gameStateObject);

    router.push("/game");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-10 shadow-2xl border border-white/20 text-center max-w-lg w-full transform transition-all hover:scale-105 duration-500">
        <h1 className="text-5xl font-extrabold mb-8 tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          GAME OVER
        </h1>

        {winner !== "D" ? (
          <div className="mb-8">
            <p className="text-xl text-gray-300 mb-4">The Winner is</p>
            <div
              className={`text-8xl font-bold animate-bounce ${winner === "X"
                ? "text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                : "text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                }`}
            >
              {winner}
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-2xl text-gray-300">It's a Draw!</p>
          </div>
        )}

        {isAdmin ? (
          <button
            onClick={handlePlayAgain}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-500/30 transform hover:-translate-y-1"
          >
            Start New Game
          </button>
        ) : (
          <div className="w-full py-4 bg-gray-700/50 text-gray-400 font-bold rounded-lg border border-gray-600/50">
            Waiting for admin to start new game...
          </div>
        )}
      </div>
    </div>
  );
}