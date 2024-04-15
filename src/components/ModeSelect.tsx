import gameContext from "@/gameContext";
import { useContext } from "react";
import { Button } from "./ui/button";

const ModeSelect = () => {
  const { setMultiplayer, setVsAI, setVsPlayer } = useContext(gameContext);

  return (
    <div className="flex gap-10 flex-col bg-muted/40 p-10 rounded-md">
      <Button
        className="text-xl p-4"
        variant={"secondary"}
        onClick={() => setMultiplayer(true)}
      >
        Multiplayer
      </Button>
      <Button
        className="text-xl p-4"
        variant={"secondary"}
        onClick={() => setVsAI(true)}
      >
        vs AI
      </Button>
      <Button
        className="text-xl p-4"
        variant={"secondary"}
        onClick={() => setVsPlayer(true)}
      >
        vs Player
      </Button>
    </div>
  );
};

export default ModeSelect;
