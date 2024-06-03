import Card, { CardProps } from "./Card";

interface PlayerHandProps {
  playerTurn?: boolean;
  playerHand?: CardProps[];
  handleCardClick?: (card: CardProps, event: React.MouseEvent) => void;
}

const PlayerHand = ({
  playerTurn,
  playerHand,
  handleCardClick,
}: PlayerHandProps) => {
  const overlap = (playerHand?.length as number) < 10 ? -10 : -10;

  return (
    <div className="player-hand-container flex w-full justify-center">
      {playerHand &&
        playerHand.map((card, index) => (
          <div
            key={index}
            onClick={(event: React.MouseEvent) =>
              handleCardClick?.(card, event)
            }
            className={`relative ml-[${overlap}px] z-${index} ${
              playerTurn ? "cursor-pointer" : ""
            }`}
          >
            <Card {...card} />
          </div>
        ))}
    </div>
  );
};

export default PlayerHand;
