import React from "react";
import Card, { CardProps } from "./Card";

interface PlayerHandProps {
  cards: CardProps[][];
  playerIndex: number;
  onCardClick: (card: CardProps) => void;
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  playerIndex,
  onCardClick,
}) => {
  return (
    <div className="flex">
      {cards[playerIndex] &&
        cards[playerIndex].map((card, index) => (
          <div
            key={card.id}
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
