import React from "react";

// Define types for the props
export interface CardProps {
  suit: string;
  rank: string;
}

const Card: React.FC<CardProps> = ({ suit, rank }) => {
  return (
    <div>
      <img className="h-18 w-14" src={`./src/assets/${suit}_${rank}.svg`} />
    </div>
  );
};

export default Card;
