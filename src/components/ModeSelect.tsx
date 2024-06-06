import gameContext from "@/gameContext";
import { useContext } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const ModeSelect = () => {
  const { setMultiplayer, setVsAI, setPractice } = useContext(gameContext);
  return (
    <div className="flex gap-10 flex-col bg-muted/40 p-10 rounded-md">
      <Button
        className="text-xl p-4"
        variant="secondary"
        onClick={() => setMultiplayer(true)}
      >
        <Link to="/multiplayer">Multiplayer</Link>
      </Button>
      <Button
        className="text-xl p-4"
        variant="secondary"
        onClick={() => setVsAI(true)}
      >
        <Link to="/vsAI">vs AI</Link>
      </Button>
      <Button
        className="text-xl p-4"
        variant="secondary"
        onClick={() => setPractice(true)}
      >
        <Link to="/practice">Practice</Link>
      </Button>
    </div>
  );
};

export default ModeSelect;
