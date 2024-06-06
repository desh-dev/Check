import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import gameContext from "@/gameContext";
import { useContext } from "react";

const Multiplayer = () => {
  const { setMultiplayer } = useContext(gameContext);
  return (
    <div className="flex gap-10 flex-col bg-muted/40 p-10 rounded-md">
      <Button className="text-xl m-0" variant={"secondary"}>
        <Link to={"/jambo"}>Jambo</Link>
      </Button>
      <Button className="text-xl m-0" variant={"secondary"}>
        <Link to={"/vsFriend"}>vs Friend</Link>
      </Button>
      <Button
        className="text-xl p-4"
        variant={"default"}
        onClick={() => setMultiplayer(false)}
      >
        <Link to={"/"}>Back</Link>
      </Button>
    </div>
  );
};

export default Multiplayer;
