import Card, { CardProps } from "./Card";

interface PlayerHandProps {
  playerTurn: boolean;
  playerHand: CardProps[];
  handleCardClick: (card: CardProps) => void;
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  playerTurn,
  playerHand,
  handleCardClick,
}) => {
  return (
    <div className="flex">
      {playerHand &&
        playerHand.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(card)}
            className={`relative ${
              index > 0 ? "ml-[-20]" : "ml-0"
            } z-${index} ${playerTurn ? "cursor-pointer" : ""}`}
          >
            <Card {...card} />
          </div>
        ))}
    </div>
  );
};

export default PlayerHand;
