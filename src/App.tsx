import { useState } from "react";
import Dashboard from "./components/Dashboard";
import gameContext, { IGameContextProps } from "./gameContext";
import GameContext from "./gameContext";

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);

  const gameContextValue: IGameContextProps = {
    isInRoom,
    setInRoom,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
  };
  return (
    <GameContext.Provider value={gameContextValue}>
      <>
        <Dashboard></Dashboard>
      </>
    </GameContext.Provider>
  );
}

export default App;
