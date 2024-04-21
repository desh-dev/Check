import PlayerHand from "./PlayerHand";
import Deck from "./Deck";
import BoardCard from "./BoardCard";
import { CardProps } from "./Card";
import gameService from "@/services/gameService";
import { CardNumber } from "./vsPlayer";
import { useState } from "react";

interface IGame {
  cardNumber: CardNumber;
}

const Game = ({ cardNumber }: IGame) => {
  const deck = gameService.generateFullDeck();

  const { playerHands, boardCard, remainingDeck } = gameService.distributeCards(
    deck,
    2,
    cardNumber as number
  );
  const [player1, setPlayer1] = useState(playerHands[0]);
  const [player2, setPlayer2] = useState(playerHands[1]);
  const [player1Turn, setPlayer1Turn] = useState(true);
  const [player2Turn, setPlayer2Turn] = useState(false);
  const [newDeck, setNewDeck] = useState(remainingDeck);
  const [newBoardCard, setNewBoardCard] = useState(boardCard);

  const playCard = (card: CardProps) => {
    setNewBoardCard(card);
    setNewDeck([...newDeck, card]);
    console.log(newDeck);
  };
  const drawCard = gameService.getRandomCard(newDeck);

  return (
    <>
      <PlayerHand
        playerTurn={true}
        cards={playerHands}
        boardCard={newBoardCard as CardProps}
        playerIndex={0}
        onCardClick={playCard}
      />
      <div className="flex gap-4">
        <Deck onCardClick={() => {}} />
        <BoardCard card={newBoardCard as CardProps} />
      </div>
      <PlayerHand
        playerTurn={false}
        cards={playerHands}
        boardCard={newBoardCard as CardProps}
        playerIndex={1}
        onCardClick={playCard}
      />
    </>
  );
};

export default Game;
