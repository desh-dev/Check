import Card from "./Card";
import { CardProps } from "./Card";

interface IBoardCard {
  card: CardProps;
}
const BoardCard = ({ card }: IBoardCard) => {
  return (
    <div className="board-card">
      <Card suit={card.suit} rank={card.rank} id="cover" />
    </div>
  );
};

export default BoardCard;
