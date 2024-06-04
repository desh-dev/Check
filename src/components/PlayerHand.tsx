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
  const overlapSmall =
    (playerHand?.length as number) < 8
      ? -20
      : (playerHand?.length as number) <= 9
      ? -26
      : -30;

  return (
    <div className="player-hand max-w-[75%] flex w-full justify-center">
      {playerHand &&
        playerHand.map((card, index) => (
          <div
            key={index}
            onClick={(event: React.MouseEvent) =>
              handleCardClick?.(card, event)
            }
            className={`relative ${
              index !== 0 && `ml-[${overlapSmall}px] md:ml-[-20px]`
            } z-${index} ${playerTurn ? "cursor-pointer" : ""}`}
          >
            <Card {...card} />
          </div>
        ))}
    </div>
  );
};

export default PlayerHand;
