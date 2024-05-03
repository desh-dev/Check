import React from "react";

export interface IGameContextProps {
  isInRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  isPlayerTurn: boolean;
  setPlayerTurn: (turn: boolean) => void;
  isGameStarted: boolean;
  setGameStarted: (started: boolean) => void;
  multiplayer: boolean;
  cardNumber: number | null;
  setCardNumber: (cardNumber: number | null) => void;
  setMultiplayer: (multiplayer: boolean) => void;
  vsAI: boolean;
  setVsAI: (vsAI: boolean) => void;
  vsPlayer: boolean;
  setVsPlayer: (vsPlayer: boolean) => void;
}

const defaultState: IGameContextProps = {
  isInRoom: false,
  setInRoom: () => {},
  isPlayerTurn: false,
  setPlayerTurn: () => {},
  isGameStarted: false,
  setGameStarted: () => {},
  cardNumber: null,
  setCardNumber: () => {},
  multiplayer: false,
  setMultiplayer: () => {},
  vsAI: false,
  setVsAI: () => {},
  vsPlayer: false,
  setVsPlayer: () => {},
};

export default React.createContext(defaultState);
