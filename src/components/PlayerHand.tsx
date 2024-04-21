import React, { useState } from "react";
import Card, { CardProps } from "./Card";

interface PlayerHandProps {
  playerIndex: number;
  playerTurn: boolean;
  boardCard: CardProps;
  cards: CardProps[][];
  onCardClick: (card: CardProps) => void;
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  boardCard,
  playerTurn,
  playerIndex,
  onCardClick,
}) => {
  const [playerHands, setPlayerHands] = useState(cards);
  const handleCardClick = (clickedCard: CardProps) => {
    if (
      boardCard.rank === clickedCard.rank ||
      boardCard.suit === clickedCard.suit
    ) {
      setPlayerHands((prevPlayerHands) =>
        prevPlayerHands.map((playerHand, index) =>
          index === playerIndex
            ? playerHand.filter((card) => card.id !== clickedCard.id)
            : playerHand
        )
      );
      onCardClick(clickedCard);
    }
  };
  return (
    <div className="flex">
      {playerHands[playerIndex] &&
        playerHands[playerIndex].map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`relative ${
              index > 0 ? "ml-[-20]" : "ml-0"
            } z-${index} ${playerTurn ? "cursor-pointer" : ""}`}
          >
            {/* Render your SVG card here */}
            <Card {...card} />
          </div>
        ))}
    </div>
  );
};

export default PlayerHand;
