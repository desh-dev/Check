import React from "react";

export interface IGameContextProps {
  auth:Object;
  setAuth: (auth:Object) => void;
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
  auth: {},
  setAuth: () => {},
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
