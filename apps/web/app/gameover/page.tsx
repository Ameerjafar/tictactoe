"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useButtonText } from "../context/ButtonTextContext";
export default function GameOver() {
  const [winner, setWinner] = useState<string | null>(null);
  const { buttonText, setButtonText } = useButtonText();
  const { sendMessage } = useWebSocketContext();
  const router = useRouter();

  useEffect(() => {
    const storedWinner = localStorage.getItem("winnerSymbol");
    setWinner(storedWinner);
  }, []);

  const handlePlayAgain = () => {
    localStorage.removeItem("winnerSymbol");
    const symbol: any = localStorage.getItem("symbol");
      if(symbol === "X") {
        localStorage.setItem("symbol", "O");
      }
      else {
        localStorage.setItem("symbol", "X");
      }
      setButtonText("X")
    // localStorage.setItem("currentRound", nextRound.toString());
    const object = {
      gameState: ["", "", "", "", "", "", "", "", ""],
      type: "updateGameState",
      roomId: localStorage.getItem("roomId"),
      symbol: ""
    }; 
    sendMessage(object);
     router.push("/game");
  }; 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-10 shadow-2xl border border-white/20 text-center max-w-lg w-full transform transition-all hover:scale-105 duration-500">
        <h1 className="text-5xl font-extrabold mb-8 tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          GAME OVER
        </h1>
        
        {winner ? (
          <div className="mb-8">
            <p className="text-xl text-gray-300 mb-4">The Winner is</p>
            <div 
              className={`text-8xl font-bold animate-bounce ${
                winner === "X" 
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

        <button
          onClick={handlePlayAgain}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-500/30 transform hover:-translate-y-1"
        >
          { localStorage.getItem("spectator") === "true" ? "See the match again" : "Play Again"}
        </button>
      </div>
    </div>
  );
}