export interface CardProps {
  suit: string;
  rank: string;
  id: string;
}

const Card = ({ suit, rank }: CardProps) => {
  return <img className="h-22 w-16" src={`./src/assets/${suit}_${rank}.svg`} />;
};

export default Card;
