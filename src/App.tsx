import { useState } from "react";
import Dashboard from "./components/Dashboard";
import { IGameContextProps } from "./gameContext";
import GameContext from "./gameContext";
import ModeSelect from "./components/ModeSelect";
import { CardNumber } from "./components/Practice";
import { Outlet } from "react-router-dom";

function App() {
  const [auth, setAuth] = useState({});
  const [cardNumber, setCardNumber] = useState<CardNumber>(null);
  const [multiplayer, setMultiplayer] = useState(false);
  const [vsAI, setVsAI] = useState(false);
  const [practice, setPractice] = useState(false);

  const gameContextValue: IGameContextProps = {
    auth,
    setAuth,
    cardNumber,
    setCardNumber,
    multiplayer,
    setMultiplayer,
    vsAI,
    setVsAI,
    practice,
    setPractice,
  };

  return (
    <GameContext.Provider value={gameContextValue}>
      <>
        <Dashboard>
          {!vsAI && !practice && !multiplayer ? <ModeSelect /> : <Outlet />}
        </Dashboard>
      </>
    </GameContext.Provider>
  );
}

export default App;
