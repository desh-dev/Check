import PlayerHand from "../PlayerHand";
import Deck from "../Deck";
import BoardCard from "../BoardCard";
import { CardProps } from "../Card";
import gameService from "@/services/gameService";
import { CardNumber } from "../Practice";
import React, { useContext, useEffect, useRef, useState } from "react";
import SuitSelector from "../SuitSelector";
import { Club, Spade, Heart, Diamond } from "lucide-react";
import { Button } from "../ui/button";
import gameContext from "@/gameContext";
import DialogBox from "../DialogBox";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface IGamePractice {
  cardNumber: CardNumber;
}
export type Suits = "spades" | "hearts" | "diamonds" | "clubs" | "";

const Game = ({ cardNumber }: IGamePractice) => {
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
  const [gameWon, setGameWon] = useState(false);
  const [newDeck, setNewDeck] = useState(remainingDeck || []);
  const [newBoardCard, setNewBoardCard] = useState(boardCard);
  const [suitSelector, setSuitSelector] = useState(false);
  const [suit, setSuit] = useState<Suits>("");
  const suitPromiseRef = useRef<{ resolve: (value: Suits) => void } | null>(
    null
  );
  const { t } = useTranslation();

  const { setCardNumber } = useContext(gameContext);
  const updateSuit = (newSuit: Suits) => {
    // sets suit when jcommand is played
    // Resolve the existing promise if any (prevents accumulation)
    setSuit(newSuit);
    suitPromiseRef.current?.resolve(newSuit);

    suitPromiseRef.current = null;
  };

  const handleNewBoardCard = (card: CardProps, event: React.MouseEvent) => {
    // removes played card from deck
    // pushes old board card to deck
    // sets played card as new board card
    if (newBoardCard) {
      setNewDeck((prevDeck) => [...prevDeck, newBoardCard]);
    }
    const board = document.querySelector(".board-card");
    const playerHand = document.querySelector(".player-hand");
    const clickedCard = event.currentTarget as HTMLElement;
    const cardClone = clickedCard.cloneNode(true) as HTMLElement;
    cardClone.classList.add("card-move");
    playerHand?.appendChild(cardClone);

    console.log(clickedCard);
    const clickedCardRect = clickedCard.getBoundingClientRect();
    const targetRect = board?.getBoundingClientRect();
    let targetX = 0;
    let targetY = 0; // Get position
    if (targetRect) {
      targetX = targetRect.left - clickedCardRect.left;
      targetY = targetRect.top - clickedCardRect.top;
    }
    cardClone.style.setProperty(
      "--init-target-x",
      `${clickedCardRect?.left}px`
    );
    cardClone.style.setProperty("--init-target-y", `${clickedCardRect?.top}px`);
    // Set custom properties for target position
    cardClone.style.setProperty("--target-x", `${targetX}px`);
    cardClone.style.setProperty("--target-y", `${targetY}px`);
    // Add the .card-move class for animation
    cardClone.classList.add("card-move");

    // Handle animation completion
    setTimeout(() => {
      setNewBoardCard(card);
      cardClone.remove();
    }, 500);
  };

  const handleCardFunction = async (
    card: CardProps,
    player: CardProps[],
    event: React.MouseEvent
  ) => {
    switch (card.rank) {
      case "jack":
        setSuitSelector(true);
        handleNewBoardCard(card, event);
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
              newBoardCard?.suit === "joker" ||
              newBoardCard?.rank === "jack")) ||
          (suit && card.suit === suit)
        )
          if (newDeck) {
            const { drawnCards, remainingDeck } = gameService.pickNCards(
              2,
              newDeck
            );
            setNewDeck(remainingDeck);
            handleNewBoardCard(card, event);
            setSuit("");

            // Add the drawn card to the current player's hand
            if (player1Turn) {
              setPlayer2([...(player2 as CardProps[]), ...drawnCards]);
              setPlayer1(player1.filter((c) => c !== card));
            } else {
              setPlayer1([...(player1 as CardProps[]), ...drawnCards]);
              setPlayer2(player2.filter((c) => c !== card));
            }
          }
        break;

      case "red":
        if (newDeck) {
          // Check if the red joker is being played on the diamonds or hearts suit or a 7
          if (
            (!suit &&
              (newBoardCard?.suit === "diamonds" ||
                newBoardCard?.suit === "hearts" ||
                newBoardCard?.rank === "7" ||
                newBoardCard?.rank === "ace" ||
                newBoardCard?.rank === "jack" ||
                newBoardCard?.suit === "joker")) ||
            suit === "diamonds" ||
            suit === "hearts"
          ) {
            const { drawnCards, remainingDeck } = gameService.pickNCards(
              4,
              newDeck
            );
            setNewDeck(remainingDeck);
            handleNewBoardCard(card, event);
            setSuit("");

            // Add the drawn cards to the opponent's hand
            if (player1Turn) {
              setPlayer2([...(player2 as CardProps[]), ...drawnCards]);
              setPlayer1(player1.filter((c) => c !== card));
            } else {
              setPlayer1([...(player1 as CardProps[]), ...drawnCards]);
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
              newBoardCard?.rank === "ace" ||
              newBoardCard?.suit === "joker" ||
              newBoardCard?.rank === "jack")) ||
          suit === "spades" ||
          suit === "clubs"
        ) {
          const { drawnCards, remainingDeck } = gameService.pickNCards(
            4,
            newDeck
          );
          setNewDeck(remainingDeck);
          handleNewBoardCard(card, event);
          setSuit("");

          // Add the drawn cards to the opponent's hand
          if (player1Turn) {
            setPlayer2([...(player2 as CardProps[]), ...drawnCards]);
            setPlayer1(player1.filter((c) => c !== card));
          } else {
            setPlayer1([...(player1 as CardProps[]), ...drawnCards]);
            setPlayer2(player2.filter((c) => c !== card));
          }
        }

        break;

      case "ace":
        if (
          (!suit &&
            (card.suit === newBoardCard?.suit ||
              card.rank === newBoardCard?.rank ||
              newBoardCard?.suit === "joker" ||
              newBoardCard?.rank === "jack")) ||
          card.suit === suit
        ) {
          handleNewBoardCard(card, event);
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
          handleNewBoardCard(card, event);
          setSuit("");
          setSuitSelector(false);
        } else if (
          !suit &&
          (newBoardCard?.rank === "jack" ||
            (newBoardCard?.suit === "joker" &&
              newBoardCard?.rank === "black" &&
              card.suit === "clubs") ||
            (newBoardCard?.suit === "joker" &&
              newBoardCard?.rank === "black" &&
              card.suit === "spades") ||
            (newBoardCard?.suit === "joker" &&
              newBoardCard?.rank === "red" &&
              card.suit === "hearts") ||
            (newBoardCard?.suit === "joker" &&
              newBoardCard?.rank === "red" &&
              card.suit === "diamonds") ||
            card.suit === newBoardCard?.suit ||
            card.rank === newBoardCard?.rank)
        ) {
          player === player1
            ? setPlayer1(player1.filter((c) => c !== card))
            : setPlayer2(player2.filter((c) => c !== card));
          togglePlayerTurn();
          handleNewBoardCard(card, event);
        }
        break;
    }
    console.log(newDeck, player1, player2, newBoardCard);
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
  const playCard1 = (card: CardProps, event: React.MouseEvent) => {
    if (player1Turn) {
      handleCardFunction(card, player1, event);
    }
  };
  const playCard2 = (card: CardProps, event: React.MouseEvent) => {
    if (player2Turn) {
      handleCardFunction(card, player2, event);
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
      console.log(newDeck);
    }
  };

  const handleGameWin = () => {
    if (player1.length === 0) {
      alert("Player 1 Wins");
      setGameWon(true);
    }
    if (player2.length === 0) {
      alert("Player 2 Wins");
      setGameWon(true);
    }
  };

  useEffect(() => {
    handleGameWin();
  }, [player1, player2]);

  //MARK: JSX

  return (
    <>
      <div className="w-full flex justify-start pl-2 pb-0">
        <Button
          className="p-0 w-12 h-10"
          variant="destructive"
          onClick={() => {
            setCardNumber(null);
          }}
        >
          <Link to="/practice">{t("back")}</Link>
        </Button>
      </div>

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
              {suit === "spades" ? (
                <Spade />
              ) : suit === "hearts" ? (
                <Heart />
              ) : suit === "diamonds" ? (
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
      {gameWon && (
        <DialogBox isOpen={gameWon}>
          <div className="flex gap-5 flex-col pt-10 pb-10 rounded-md">
            <Button
              className="text-xl m-4"
              variant="secondary"
              onClick={() => {
                setCardNumber(null);
              }}
            >
              <Link to={"/"}>{t("back_to_menu")}</Link>
            </Button>
            <Button
              className="text-xl m-4"
              variant="secondary"
              onClick={() => setCardNumber(null)}
            >
              {t("play_again")}
            </Button>
          </div>
        </DialogBox>
      )}
    </>
  );
};

export default Game;
