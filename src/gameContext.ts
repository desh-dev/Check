import React from "react";

export interface IGameContextProps {
  cardNumber: number | null;
  setCardNumber: (cardNumber: number | null) => void;
  multiplayer: boolean;
  setMultiplayer: (multiplayer: boolean) => void;
  vsAI: boolean;
  setVsAI: (vsAI: boolean) => void;
  practice: boolean;
  setPractice: (practice: boolean) => void;
}

const defaultState: IGameContextProps = {
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
