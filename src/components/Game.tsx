import PlayerHand from "./PlayerHand";
import Deck from "./Deck";
import BoardCard from "./BoardCard";
import { CardProps } from "./Card";
import gameService from "@/services/gameService";
import { CardNumber } from "./vsPlayer";

interface IGame {
  cardNumber: CardNumber;
}

const Game = ({ cardNumber }: IGame) => {
  const deck = gameService.generateFullDeck();

  const { playerHands } = gameService.distributeCards(
    deck,
    2,
    cardNumber as number
  );

  return (
    <>
      <PlayerHand cards={playerHands} playerIndex={0} onCardClick={() => {}} />
      <div className="flex gap-4">
        <Deck />
        <BoardCard />
      </div>
      <PlayerHand cards={playerHands} playerIndex={1} onCardClick={() => {}} />
    </>
  );
};

export default Game;
