export interface CardProps {
  suit: string;
  rank: string;
  id: string;
}

const Card = ({ suit, rank, id }: CardProps) => {
  return (
    <img
      className={`h-22 w-16  ${id !== "cover" ? "playing-card" : ""}`}
      src={`./src/assets/${suit}_${rank}.svg`}
    />
  );
};

export default Card;
