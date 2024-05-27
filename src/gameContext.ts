import React from "react";

export interface IGameContextProps {
  isInRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  playerName: string;
  setPlayerName: (playerName: string) => void;
  isGameStarted: boolean;
  setGameStarted: (started: boolean) => void;
  multiplayer: boolean;
  cardNumber: number | null;
  setCardNumber: (cardNumber: number | null) => void;
  setMultiplayer: (multiplayer: boolean) => void;
  vsAI: boolean;
  setVsAI: (vsAI: boolean) => void;
  practice: boolean;
  setPractice: (practice: boolean) => void;
}

const defaultState: IGameContextProps = {
  isInRoom: false,
  setInRoom: () => {},
  playerName: "",
  setPlayerName: () => {},
  isGameStarted: false,
  setGameStarted: () => {},
  cardNumber: null,
  setCardNumber: () => {},
  multiplayer: false,
  setMultiplayer: () => {},
  vsAI: false,
  setVsAI: () => {},
  practice: false,
  setPractice: () => {},
};

export default React.createContext(defaultState);
