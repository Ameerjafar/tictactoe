"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useButtonText } from "../context/ButtonTextContext";
import axios from "axios";
import { toast } from "sonner";

export default function GameOver() {
  const [winner, setWinner] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { buttonText, setButtonText } = useButtonText();
  const { sendMessage, messages } = useWebSocketContext();
  const mounted = useRef<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    let isWin = false;
    let isDraw = false;
    const winner = localStorage.getItem("winnerSymbol");
    const symbol = localStorage.getItem("symbol");
    const userId = localStorage.getItem("userId");
    const roomId = localStorage.getItem("roomId");

    if (winner === "D") {
      isDraw = true;
    } else if (winner === symbol) {
      isWin = true;
    }

    const apiCall = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/game/creategame`,
          {
            roomId,
            isWin,
            isDraw,
            userId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error creating game:", error);
      }
    };

    if (userId && roomId && winner) {
      apiCall();
    }
  }, []);
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
  const handleCloseRoom = () => {
    const roomId = localStorage.getItem("roomId");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const data = {
      roomId,
      userId,
      type: "closeRoom",
    };
    sendMessage(data);
    router.push('/room')
  }

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
    if (messages?.type === 'closeRoom') {
      toast.info("Room closed by admin")
      router.push("/room")
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
      symbol: "",
    };
    sendMessage(gameStateObject);

    router.push("/game");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-black text-white overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none"></div>

      <div className="relative z-10 bg-white/5 backdrop-blur-2xl rounded-3xl p-12 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 text-center max-w-md w-full transform transition-all hover:scale-[1.02] duration-500 group">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <h1 className="text-6xl font-black mb-10 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-sm">
          GAME OVER
        </h1>

        {winner !== "D" ? (
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
            <p className="text-lg text-gray-400 mb-4 font-medium uppercase tracking-widest">Winner</p>
            <div
              className={`text-9xl font-black animate-bounce ${winner === "X"
                ? "text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-300 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                : "text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-orange-300 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                }`}
            >
              {winner}
            </div>
          </div>
        ) : (
          <div className="mb-10">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center shadow-lg border border-white/10">
              <span className="text-4xl">🤝</span>
            </div>
            <p className="text-3xl font-bold text-gray-200">It's a Draw!</p>
          </div>
        )}

        <div className="space-y-4">
          {isAdmin ? (
            <>
              <button
                onClick={handlePlayAgain}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/25 transform hover:-translate-y-0.5 border border-white/10"
              >
                Start New Game
              </button>
              <button
                onClick={handleCloseRoom}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold rounded-xl transition-all border border-white/5 hover:border-white/20"
              >
                Close Room
              </button>
            </>
          ) : (
            <div className="w-full py-4 bg-white/5 text-gray-400 font-medium rounded-xl border border-white/5 flex items-center justify-center gap-2 animate-pulse">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              Waiting for admin...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
