"use client";

import { createContext, useState, useContext, useEffect } from "react";

type ButtonType = "X" | "O";

interface ButtonTextContextType {
  buttonText: ButtonType;
  setButtonText: (symbol: ButtonType) => void;
  toggleButtonTextForNextRound: () => void;
}

const ButtonTextContext = createContext<ButtonTextContextType | null>(null);

export const ButtonTextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [buttonText, setButtonText] = useState<ButtonType>(() => {
    if (typeof window !== "undefined") {
      const storedSymbol = localStorage.getItem("symbol");
      return (storedSymbol === "X" || storedSymbol === "O") ? storedSymbol : "X";
    }
    return "X";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("symbol", buttonText);
    }
  }, [buttonText]);
  const toggleButtonTextForNextRound = () => {
    setButtonText(prevText => prevText === "X" ? "O" : "X");
  };

  return (
    <ButtonTextContext.Provider value={{ buttonText, setButtonText, toggleButtonTextForNextRound }}>
      {children}
    </ButtonTextContext.Provider>
  );
};

export const useButtonText = () => {
  const context = useContext(ButtonTextContext);
  if (!context) {
    throw new Error("useButtonText must be used within ButtonTextProvider");
  }
  return context;
};
