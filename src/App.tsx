import { useState } from "react";
import Dashboard from "./components/Dashboard";
import { IGameContextProps } from "./gameContext";
import GameContext from "./gameContext";
import ModeSelect from "./components/ModeSelect";
import { CardNumber } from "./components/Practice";
import BackButton from "./components/BackButton";
import Practice from "./components/Practice.tsx";

function App() {
  const [cardNumber, setCardNumber] = useState<CardNumber>(null);
  const [multiplayer, setMultiplayer] = useState(false);
  const [vsAI, setVsAI] = useState(false);
  const [practice, setPractice] = useState(false);

  const gameContextValue: IGameContextProps = {
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
          {!vsAI && !practice && <ModeSelect />}
          {practice && (
            <Practice>
              <BackButton state={practice} setState={setPractice}>
                Back
              </BackButton>
            </Practice>
          )}
          {/* {vsAI && (
            <VsAI>
              <Back toggle={() => toggleModeSelect(setVsAI)} state={vsAI} setState={setVsAI} />
            </VsAI>
          )} */}
        </Dashboard>
      </>
    </GameContext.Provider>
  );
}

export default App;
