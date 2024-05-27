import React from "react";
import { Button } from "./ui/button";

interface BackProps {
  children: React.ReactNode;
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  toggle?: () => void;
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
}

const BackButton = ({
  toggle,
  state,
  setState,
  children,
  buttonVariant,
}: BackProps) => {
  const handleClick = () => {
    setState(!state);
    toggle?.();
  };

  return (
    <Button variant={buttonVariant} onClick={handleClick}>
      {children}
    </Button>
  );
};

export default BackButton;
