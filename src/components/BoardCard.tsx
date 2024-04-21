import Card from "./Card";
import { CardProps } from "./Card";

interface IBoardCard {
  card: CardProps;
}
const BoardCard = ({ card }: IBoardCard) => {
  return <Card suit={card.suit} rank={card.rank} id={card.id} />;
};

export default BoardCard;
