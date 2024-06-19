import React from "react";

export interface IAuth {
  email?: string;
  isSigningIn?: boolean;
}

export interface IGameContextProps {
  auth: IAuth;
  setAuth: React.Dispatch<React.SetStateAction<IAuth>>;
  cardNumber: number | null;
  setCardNumber: (cardNumber: number | null) => void;
}

const defaultState: IGameContextProps = {
  auth: {},
  setAuth: () => {},
  cardNumber: null,
  setCardNumber: () => {},
};

export default React.createContext(defaultState);
