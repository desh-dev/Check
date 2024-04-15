import { useState } from "react";
import Dashboard from "./components/Dashboard";
import { IGameContextProps } from "./gameContext";
import GameContext from "./gameContext";
import ModeSelect from "./components/ModeSelect";

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);
  const [multiplayer, setMultiplayer] = useState(false);
  const [vsAI, setVsAI] = useState(false);
  const [vsPlayer, setVsPlayer] = useState(false);

  const gameContextValue: IGameContextProps = {
    isInRoom,
    setInRoom,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
    multiplayer,
    setMultiplayer,
    vsAI,
    setVsAI,
    vsPlayer,
    setVsPlayer,
  };
  return (
    <GameContext.Provider value={gameContextValue}>
      <>
        <Dashboard>
          <ModeSelect />
        </Dashboard>
      </>
    </GameContext.Provider>
  );
}

export default App;
