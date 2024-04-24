import React from "react";
import { Button } from "./ui/button";

interface BackProps {
  toggle: () => void;
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

const Back = ({ toggle, state, setState }: BackProps) => {
  const handleClick = () => {
    setState(false);
    toggle();
  };

  return (
    <Button onClick={handleClick}>Back</Button>
  );
};

export default Back;