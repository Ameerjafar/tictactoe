"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
type ButtonType = "X" | "O";
export const GameBoard = () => {
  const elements = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [buttonText, setButtonText] = useState<ButtonType>("X");
  const router = useRouter();
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
  const buttonHandler = (key: number) => {
    console.log(ele);
    const updateEle: string[] = [];
    ele.forEach((e, ind) => {
      if (key === ind) {
        updateEle[ind] = buttonText;
      } else {
        updateEle[ind] = ele[ind]!;
      }
    });
    setEle(updateEle);
    setButtonText((prev) => (prev === "X" ? "O" : "X"));
  };

  const isGameOver = (): boolean => {
    console.log("is game over is calling");
    winningCombination.forEach((eachRow: number[], ind: number) => {
      if (
        ele[eachRow[0]!] !== "" &&
        ele[eachRow[1]!] !== "" &&
        ele[eachRow[2]!] !== "" &&
        ele[eachRow[0]!] === ele[eachRow[1]!] &&
        ele[eachRow[2]!] === ele[eachRow[0]!]
      ) {
        router.push('/gameover');
        console.log("return true is calling");
        return true;
      }
    });
    return false;
  };
  return (
    <div className="flex flex-wrap ">
      {elements.map((element, index) => (
        <div key={index} className="w-1/3 p-2">
          <button
            onClick={() => buttonHandler(index)}
            className={`bg-red-500 text-white w-10 h-10 disabled:cursor-not-allowed`}
            disabled={ele[index] !== ""}
          >
            {ele[index] !== "" ? ele[index] : null}
          </button>
        </div>
      ))}
    </div>
  );
};
