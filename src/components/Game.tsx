import PlayerHand from "./PlayerHand";
import Deck from "./Deck";
import BoardCard from "./BoardCard";
import { CardProps } from "./Card";
import gameService from "@/services/gameService";
import { CardNumber } from "./vsPlayer";
import { useRef, useState } from "react";
import SuitSelector from "./SuitSelector";
import { Club, Spade, Heart, Diamond } from "lucide-react";

interface IGame {
  cardNumber: CardNumber;
}
export type Suits = "Spades" | "Hearts" | "Diamonds" | "Clubs" | "";

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
  const [newDeck, setNewDeck] = useState(remainingDeck || []);
  const [newBoardCard, setNewBoardCard] = useState(boardCard);
  const [suitSelector, setSuitSelector] = useState(false);
  const [suit, setSuit] = useState<Suits>("");
  const suitPromiseRef = useRef<{ resolve: (value: Suits) => void } | null>(
    null
  );
  const updateSuit = (newSuit: Suits) => {
    // Resolve the existing promise if any (prevents accumulation)
    console.log(suit);
    setSuit(newSuit);
    suitPromiseRef.current?.resolve(newSuit);

    suitPromiseRef.current = null;

    //Create a new promise for future selections
    // suitPromiseRef.current = new Promise((resolve) => {
    //   // Resolve is called when suit selection happens in SuitSelector

    //   console.log(" New Promise: ", suitPromiseRef.current);
    //   console.log(suit);
    // });
  };

  const handleNewBoardCard = (card: CardProps) => {
    if (newBoardCard) {
      const updatedDeck = newDeck.filter((c) => c !== card);
      setNewDeck(updatedDeck);
      setNewDeck([...updatedDeck, newBoardCard]);
    }
    setNewBoardCard(card);
  };

  const handleCardFunction = async (card: CardProps, player: CardProps[]) => {
    switch (card.rank) {
      case "jack":
        setSuitSelector(true);
        handleNewBoardCard(card);
        setPlayer1Turn(false);
        setPlayer2Turn(false);
        const playerOne = player1;
        player === player1
          ? setPlayer1(player1.filter((c) => c !== card))
          : setPlayer2(player2.filter((c) => c !== card));

        await new Promise((resolve) => {
          suitPromiseRef.current = { resolve };
        }).then(() => {
          if (player === playerOne) {
            setPlayer2Turn(true);
          } else {
            setPlayer1Turn(true);
          }
          setSuitSelector(false);
        });

        break;

      case "7":
        if (
          (!suit &&
            (card.suit === newBoardCard?.suit ||
              card.rank === newBoardCard?.rank ||
              newBoardCard?.suit === "joker")) ||
          (suit && card.suit === suit)
        )
          if (newDeck) {
            const drawnCardArr = gameService.pickNCards(2, newDeck);

            // Add the drawn card to the current player's hand
            if (player1Turn) {
              setPlayer2([...(player2 as CardProps[]), ...drawnCardArr]);
              setPlayer1(player1.filter((c) => c !== card));
            } else {
              setPlayer1([...(player1 as CardProps[]), ...drawnCardArr]);
              setPlayer2(player2.filter((c) => c !== card));
            }

            handleNewBoardCard(card);
            setSuit("");
          }
        break;

      case "red":
        if (newDeck) {
          // Check if the red joker is being played on the diamonds or hearts suit or a 7
          if (
            (!suit &&
              (newBoardCard?.suit === "Diamonds" ||
                newBoardCard?.suit === "Hearts" ||
                newBoardCard?.rank === "7" ||
                newBoardCard?.rank === "ace")) ||
            suit === "Diamonds" ||
            suit === "Hearts"
          ) {
            const drawnCardArr = gameService.pickNCards(4, newDeck);

            handleNewBoardCard(card);
            setSuit("");

            // Add the drawn cards to the opponent's hand
            if (player1Turn) {
              setPlayer2([...(player2 as CardProps[]), ...drawnCardArr]);
              setPlayer1(player1.filter((c) => c !== card));
            } else {
              setPlayer1([...(player1 as CardProps[]), ...drawnCardArr]);
              setPlayer2(player2.filter((c) => c !== card));
            }
          }
        }
        break;
      case "black":
        // Check if the black joker is being played on the Spades or Clubs suit or a 7
        if (
          (!suit &&
            (newBoardCard?.suit === "Spades" ||
              newBoardCard?.suit === "Clubs" ||
              newBoardCard?.rank === "7" ||
              newBoardCard?.rank === "ace")) ||
          suit === "Spades" ||
          suit === "Clubs"
        ) {
          handleNewBoardCard(card);
          setSuit("");
          const drawnCardArr = gameService.pickNCards(4, newDeck);

          // Add the drawn cards to the opponent's hand
          if (player1Turn) {
            setPlayer2([...(player2 as CardProps[]), ...drawnCardArr]);
            setPlayer1(player1.filter((c) => c !== card));
          } else {
            setPlayer1([...(player1 as CardProps[]), ...drawnCardArr]);
            setPlayer2(player2.filter((c) => c !== card));
          }
        }

        break;

      case "ace":
        if (
          (!suit &&
            (card.suit === newBoardCard?.suit ||
              card.rank === newBoardCard?.rank ||
              newBoardCard?.suit === "joker")) ||
          card.suit === suit
        ) {
          handleNewBoardCard(card);
          setSuit("");
          player === player1
            ? setPlayer1(player1.filter((c) => c !== card))
            : setPlayer2(player2.filter((c) => c !== card));
        }

        break;

      default:
        if (suit && suit === card.suit) {
          player === player1
            ? setPlayer1(player1.filter((c) => c !== card))
            : setPlayer2(player2.filter((c) => c !== card));
          togglePlayerTurn();
          handleNewBoardCard(card);
          setSuit("");
          setSuitSelector(false);
        } else if (
          !suit &&
          (newBoardCard?.rank === "jack" ||
            (newBoardCard?.suit === "joker" &&
              newBoardCard?.rank === "black" &&
              card.suit === "Clubs") ||
            (newBoardCard?.suit === "joker" &&
              newBoardCard?.rank === "black" &&
              card.suit === "Spades") ||
            (newBoardCard?.suit === "joker" &&
              newBoardCard?.rank === "red" &&
              card.suit === "Hearts") ||
            (newBoardCard?.suit === "joker" &&
              newBoardCard?.rank === "red" &&
              card.suit === "Diamonds") ||
            card.suit === newBoardCard?.suit ||
            card.rank === newBoardCard?.rank)
        ) {
          player === player1
            ? setPlayer1(player1.filter((c) => c !== card))
            : setPlayer2(player2.filter((c) => c !== card));
          togglePlayerTurn();
          handleNewBoardCard(card);
          console.log(newDeck);
        }
        break;
    }
  };
  const togglePlayerTurn = () => {
    if (player1Turn) {
      setPlayer1Turn(false);
      setPlayer2Turn(true);
    } else if (player2Turn) {
      setPlayer2Turn(false);
      setPlayer1Turn(true);
    }
  };
  const playCard1 = (card: CardProps) => {
    if (player1Turn) {
      handleCardFunction(card, player1);
    }
  };
  const playCard2 = (card: CardProps) => {
    if (player2Turn) {
      handleCardFunction(card, player2);
    }
  };
  const handleDeckClick = () => {
    if (newDeck) {
      // Generate a random card from the remaining deck
      const drawnCard = gameService.getRandomCard(newDeck);

      // Add the drawn card to the current player's hand
      if (player1Turn) {
        setPlayer1([...(player1 as CardProps[]), drawnCard as CardProps]);
        setPlayer1Turn(!player1Turn);
        setPlayer2Turn(true);
      } else {
        setPlayer2([...(player2 as CardProps[]), drawnCard as CardProps]);
        setPlayer2Turn(!player2Turn);
        setPlayer1Turn(true);
      }
    }
  };

  return (
    <>
      <PlayerHand
        playerTurn={player1Turn}
        playerHand={player1}
        handleCardClick={playCard1}
      />
      <div className="flex gap-4">
        <Deck onCardClick={handleDeckClick} />
        <div className="flex flex-col gap-2 ml-8">
          <BoardCard card={newBoardCard as CardProps} />
          {suit && (
            <div className="flex bg-muted/40 rounded-md justify-center">
              {suit === "Spades" ? (
                <Spade />
              ) : suit === "Hearts" ? (
                <Heart />
              ) : suit === "Diamonds" ? (
                <Diamond />
              ) : (
                <Club />
              )}
            </div>
          )}
        </div>
        <div className="ml-6">
          {suitSelector && <SuitSelector updateSuit={updateSuit} />}
        </div>
      </div>
      <PlayerHand
        playerTurn={player2Turn}
        playerHand={player2}
        handleCardClick={playCard2}
      />
    </>
  );
};

export default Game;
