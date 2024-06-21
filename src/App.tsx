import { useState } from "react";
import Dashboard from "./components/Dashboard";
import { IGameContextProps } from "./gameContext";
import GameContext from "./gameContext";
import ModeSelect from "./components/ModeSelect";
import { CardNumber } from "./components/Practice";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "./hooks/Auth";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

function App() {
  const [auth, setAuth] = useState({});
  const [cardNumber, setCardNumber] = useState<CardNumber>(null);

  const gameContextValue: IGameContextProps = {
    auth,
    setAuth,
    cardNumber,
    setCardNumber,
  };
  const location = useLocation();

  const shouldRenderModeSelect = location.pathname === "/";

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <GameContext.Provider value={gameContextValue}>
          <>
            {shouldRenderModeSelect ? (
              <ModeSelect></ModeSelect>
            ) : (
              <Dashboard></Dashboard>
            )}
          </>
        </GameContext.Provider>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;
