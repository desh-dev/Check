import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Multiplayer = () => {
  return (
    <div className="flex gap-10 flex-col bg-muted/40 p-10 rounded-md">
      <Button className="text-xl m-0" variant={"secondary"}>
        <Link to={"multiplayer/jambo"}>Jambo</Link>
      </Button>
      <Button className="text-xl m-0" variant={"secondary"}>
        <Link to={"/multiplayer/vs-friend"}>vs Friend</Link>
      </Button>
      <Button className="text-xl p-4" variant={"default"}>
        <Link to={"/"}>Back</Link>
      </Button>
    </div>
  );
};

export default Multiplayer;
