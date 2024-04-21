import Card, { CardProps } from "./Card";

interface IDeckProps {
  onCardClick: () => void;
}

const Deck = ({ onCardClick }: IDeckProps) => {
  return (
    <div className="cursor-pointer" onClick={() => onCardClick}>
      <Card suit="card" rank="cover" id="deck" />
    </div>
  );
};

export default Deck;
