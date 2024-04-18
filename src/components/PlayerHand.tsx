import React from "react";
import Card, { CardProps } from "./Card";

interface PlayerHandProps {
  cards: CardProps[];
  onCardClick: (card: CardProps) => void;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ cards, onCardClick }) => {
  return (
    <div className="flex border border-dashed p-2">
      {cards.map((card, index) => (
        <div
          key={card.rank && card.suit}
          onClick={() => onCardClick(card)}
          className={`relative ${
            index > 0 ? "ml-[-20]" : "ml-0"
          } z-${index} cursor-pointer`}
        >
          {/* Render your SVG card here */}
          <Card {...card} />
        </div>
      ))}
    </div>
  );
};

export default PlayerHand;
