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

  const playCard1 = (card: CardProps) => {
    if (player1Turn) {
      const updatedPlayer1 = player1.filter((c) => c !== card);
      setPlayer1(updatedPlayer1);
      setNewBoardCard(card);
      setNewDeck([...newDeck, card]);
      console.log(newDeck);
      setPlayer1Turn(!player1Turn);
      setPlayer2Turn(true);
    }
  };
  const playCard2 = (card: CardProps) => {
    if (player2Turn) {
      const updatedPlayer2 = player2.filter((c) => c !== card);
      setPlayer2(updatedPlayer2);
      setNewBoardCard(card);
      setNewDeck([...newDeck, card]);
      console.log(newDeck);
      setPlayer2Turn(!player2Turn);
      setPlayer1Turn(true);
    }
  };
  const drawCard = gameService.getRandomCard(newDeck);

  return (
    <>
      <PlayerHand
        playerTurn={true}
        playerHand={player1}
        handleCardClick={playCard1}
      />
      <div className="flex gap-4">
        <Deck onCardClick={() => {}} />
        <BoardCard card={newBoardCard as CardProps} />
      </div>
      <PlayerHand
        playerTurn={false}
        playerHand={player2}
        handleCardClick={playCard2}
      />
    </>
  );
};

export default Game;
