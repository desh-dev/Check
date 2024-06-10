import React from "react";

export interface IAuth {
  email?: string;
  roles?: string[];
  accessToken?: string;
}

export interface IGameContextProps {
  auth: IAuth;
  setAuth: React.Dispatch<React.SetStateAction<IAuth>>;
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
