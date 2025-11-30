"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWebSocketContext } from "../context/WebSocketContext";
import { toast } from "sonner";
import { measureMemory } from "vm";
type ButtonType = "X" | "O";
export const GameBoard = () => {
  const elements = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [buttonText, setButtonText] = useState<ButtonType>("X");
  const router = useRouter();
  // const [turn, setTurn] = useState<boolean>(true);
  const { messages, sendMessage } = useWebSocketContext();
  const symbol = localStorage.getItem("symbol");
  const [ele, setEle] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // useEffect(() => {
  //   const round = localStorage.getItem("currentRound");
  //   console.log("turn inside the button text", buttonText)
  //   console.log("turn", turn);
  //   if ((parseInt(round!) & 1) === 1 && symbol === "X") {
  //     setTurn(true);
  //   }
  //   else {
  //     setTurn(false);
  //   }
  // }, [])
  useEffect(() => {
    console.log("inside the message thing", messages);
    if (messages && messages.type === 'updateGameState' && messages.gameState) {
      setEle(messages.gameState);
      if (messages.symbol != "") {
        setButtonText((prev) => (prev === "X" ? "O" : "X"));
      }
    }
    if (messages.type === 'joinRoom' || messages.type === 'createRoom') {
      localStorage.setItem("twoPlayer", messages.twoPlayer.toString());
    }
  }, [messages]);
  const playSound = (type: "move" | "win" | "draw") => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === "move") {
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === "win") {
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(659.25, audioContext.currentTime + 0.2);
      oscillator.frequency.linearRampToValueAtTime(783.99, audioContext.currentTime + 0.4);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.6);
    } else {
      // Draw sound - a descending tone sequence
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(300, audioContext.currentTime + 0.2);
      oscillator.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.4);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };
  useEffect(() => {
    const gameOver = isGameOver();
    if (gameOver) {
      router.push('/gameover');
    }
  }, [ele])
  const buttonHandler = (key: number) => {
    const twoPlayer = localStorage.getItem("twoPlayer");
    if (localStorage.getItem("spectator") === "true") {
      toast.info("You are in spectator mode");
      return;
    }
    if (twoPlayer !== "2") {
      toast.info("Wait for another player to join");
      return;
    }
    if (symbol && symbol !== buttonText) {
      toast.info("Not your turn!");
      return;
    }
    playSound("move");
    console.log(ele);
    const updateEle: string[] = [];
    ele.forEach((e, ind) => {
      if (key === ind && ele[ind] === "") {
        updateEle[ind] = buttonText;
      } else {
        updateEle[ind] = ele[ind]!;
      }
    });

    setEle(updateEle);
    console.log("what is wrong in this one", updateEle);
    const gameOver = isGameOver();
    let player = false;
    if (localStorage.getItem("spectator") !== "true") {
      player = true;
    }
    const object = {
      gameState: updateEle,
      type: "updateGameState",
      roomId: localStorage.getItem("roomId"),
      symbol,
      gameOver,
      player
    };
    sendMessage(object);
    setButtonText((prev) => (prev === "X" ? "O" : "X"));
  };
  const isGameOver = (): boolean => {
    console.log("is game over is calling");
    const isWon = winningCombination.some((eachRow: number[], ind: number) => {
      if (
        ele[eachRow[0]!] !== "" &&
        ele[eachRow[1]!] !== "" &&
        ele[eachRow[2]!] !== "" &&
        ele[eachRow[0]!] === ele[eachRow[1]!] &&
        ele[eachRow[2]!] === ele[eachRow[0]!]
      ) {
        playSound("win");
        localStorage.setItem("winnerSymbol", ele[eachRow[0]!]!);
        console.log("return true is calling");
        return true;
      }
    });
    const isDraw = ele.every((e) => e !== "");
    if (isDraw && !isWon) {
      playSound("draw");
      localStorage.setItem("winnerSymbol", "D");
      return true;
    }
    return isWon;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/20">
        <div className="grid grid-cols-3 gap-3">
          {elements.map((element, index) => (
            <div key={index} className="relative">
              <button
                onClick={() => buttonHandler(index)}
                className={`
                  w-24 h-24 sm:w-32 sm:h-32 rounded-lg text-4xl sm:text-6xl font-bold transition-all duration-300 ease-in-out
                  flex items-center justify-center shadow-md
                  ${ele[index] === ""
                    ? "bg-white/5 hover:bg-white/20 cursor-pointer hover:scale-105"
                    : "cursor-not-allowed"
                  }
                  ${ele[index] === "X"
                    ? "bg-blue-500/20 text-blue-400 border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    : ""
                  }
                  ${ele[index] === "O"
                    ? "bg-red-500/20 text-red-400 border-2 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                    : ""
                  }
                `}
                disabled={ele[index] !== "" && symbol === buttonText}
              >
                <span
                  className={`transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${ele[index] ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 rotate-180"
                    }`}
                >
                  {ele[index]}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
