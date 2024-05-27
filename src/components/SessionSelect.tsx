import React from "react";
import Dashboard from "./Dashboard";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface Props {
  setCreateRoom: React.Dispatch<React.SetStateAction<boolean>>;
  setJoinRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

const SessionSelect = ({ setCreateRoom, setJoinRoom }: Props) => {
  return (
    <>
      <Dashboard>
        <div className="flex gap-10 flex-col bg-muted/40 p-10 rounded-md">
          <Button
            className="text-xl p-4"
            variant={"secondary"}
            onClick={() => setCreateRoom(true)}
          >
            Create Room
          </Button>
          <Button
            className="text-xl p-4"
            variant={"secondary"}
            onClick={() => setJoinRoom(true)}
          >
            Join Room
          </Button>
          <Button className="text-xl p-4">
            <Link to={"/multiplayer"}>Back</Link>{" "}
          </Button>
        </div>
      </Dashboard>
    </>
  );
};

export default SessionSelect;
