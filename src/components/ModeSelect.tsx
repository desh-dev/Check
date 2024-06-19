import Dashboard from "./Dashboard";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const ModeSelect = () => {
  return (
    <Dashboard>
      <div className="flex gap-10 flex-col bg-muted/40 p-10 rounded-md">
        <Button className="text-xl p-4" variant="secondary">
          <Link to="multiplayer">Multiplayer</Link>
        </Button>
        <Button className="text-xl p-4" variant="secondary">
          <Link to="vs-ai">vs AI</Link>
        </Button>
        <Button className="text-xl p-4" variant="secondary">
          <Link to="practice">Practice</Link>
        </Button>
      </div>
    </Dashboard>
  );
};

export default ModeSelect;
