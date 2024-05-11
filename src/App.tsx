import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import { IGameContextProps } from "./gameContext";
import GameContext from "./gameContext";
import ModeSelect from "./components/ModeSelect";
import VsPlayer, { CardNumber } from "./components/vsPlayer";
import BackButton from "./components/BackButton";

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);
  const [cardNumber, setCardNumber] = useState<CardNumber>(null);
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
    cardNumber,
    setCardNumber,
    multiplayer,
    setMultiplayer,
    vsAI,
    setVsAI,
    vsPlayer,
    setVsPlayer,
  };

  const toggleModeSelect = (
    setState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setState(false);
  };

  return (
    <GameContext.Provider value={gameContextValue}>
      <>
        <Dashboard>
          {!multiplayer && !vsAI && !vsPlayer && <ModeSelect />}
          {vsPlayer && (
            <VsPlayer>
              <BackButton
                toggle={() => toggleModeSelect(setVsPlayer)}
                state={vsPlayer}
                setState={setVsPlayer}
              />
            </VsPlayer>
          )}
          {/* {vsAI && (
            <VsAI>
              <Back toggle={() => toggleModeSelect(setVsAI)} state={vsAI} setState={setVsAI} />
            </VsAI>
          )}
          {multiplayer && (
            <Multiplayer>
              <Back toggle={() => toggleModeSelect(setMultiplayer)} state={multiplayer} setState={setMultiplayer} />
            </Multiplayer>
          )} */}
        </Dashboard>
      </>
    </GameContext.Provider>
  );
}

export default App;
