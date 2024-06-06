import gameService from "@/services/gameService";
import { useEffect, useRef, useState } from "react";
import { Suits } from "../practice/Game";
import { CardProps } from "../Card";
import socketService from "@/services/socketService";
import {
  Spade,
  Heart,
  Diamond,
  Club,
  X,
  Check,
  Home,
  Volume,
  VolumeX,
} from "lucide-react";
import BoardCard from "../BoardCard";
import Deck from "../Deck";
import DialogBox from "../DialogBox";
import PlayerHand from "../PlayerHand";
import SuitSelector from "../SuitSelector";
import { Button } from "../ui/button";
import Dashboard from "../Dashboard";
import { Socket } from "socket.io-client";
import { Link } from "react-router-dom";
import Chat from "../Chat";
import Timer from "../Timer";
import playCard from "../../assets/sounds/playCard.mp3";
import shuffleCards from "../../assets/sounds/shuffleCards.wav";

interface IGameMultiplayer {
  roomName: string;
  currentUser: string;
  playerName: string;
  opponentName: string;
}
const Game = ({
  roomName,
  currentUser,
  playerName,
  opponentName,
}: IGameMultiplayer) => {
  //MARK: - Variables
  let deck = gameService.generateFullDeck();
  const { playerHands, boardCard, remainingDeck } = gameService.distributeCards(
    deck,
    2,
    7
  );

  let timer: NodeJS.Timeout | null = null;
  const timeLimit = 25;
  const [gameWon, setGameWon] = useState(false);
  const [winner, setWinner] = useState("");
  const [remainingTime, setRemainingTime] = useState(timeLimit);
  const [player1Turn, setPlayer1Turn] = useState(true);
  const [player2Turn, setPlayer2Turn] = useState(false);
  const [player1, setPlayer1] = useState(playerHands[0]);
  const [player2, setPlayer2] = useState(playerHands[1]);
  const [newBoardCard, setNewBoardCard] = useState(boardCard);
  const [newDeck, setNewDeck] = useState(remainingDeck || []);
  const [suitSelector, setSuitSelector] = useState(false);
  const [suit, setSuit] = useState<Suits>("");
  const [leaveGame, setLeaveGame] = useState(false);
  const [gameLeft, setGameLeft] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [playAgain, setPlayAgain] = useState(false);
  const suitPromiseRef = useRef<{ resolve: (value: Suits) => void } | null>(
    null
  );
  const timerPromiseRef = useRef<{ resolve: (value: boolean) => void } | null>(
    null
  );
  const cardArray1: CardProps[] = Array.from(
    { length: player1.length },
    () => ({ suit: "card", rank: "cover", id: "cover" })
  );
  const cardArray2: CardProps[] = Array.from(
    { length: player2.length },
    () => ({ suit: "card", rank: "cover", id: "cover" })
  );
  const playCardSound = new Audio(playCard);
  const shuffleCardsSound = new Audio(shuffleCards);

  let updatedGameState = {
    gameWon: gameWon,
    player1Turn: player1Turn,
    player2Turn: player2Turn,
    player1: [...player1],
    player2: [...player2],
    boardCard: newBoardCard,
    newDeck: [...newDeck],
    suit: suit,
  };

  //MARK: useEffect
  useEffect(() => {
    //send initial state to server
    socketService.socket?.emit("init_game_state", {
      gameWon: gameWon,
      player1Turn: player1Turn,
      player2Turn: player2Turn,
      player1: [...player1],
      player2: [...player2],
      boardCard: newBoardCard,
      newDeck: [...newDeck],
      suit: suit,
    });
  }, []);

  useEffect(() => {
    socketService.socket?.on(
      "init_game_state",
      ({
        gameWon,
        player1,
        player2,
        // player1Turn,
        // player2Turn,
        boardCard,
        newDeck,
        suit,
      }) => {
        setGameWon(gameWon),
          (updatedGameState.gameWon = gameWon),
          setPlayer1Turn(true),
          (updatedGameState.player1Turn = true),
          setPlayer2Turn(false),
          (updatedGameState.player2Turn = false),
          setPlayer1(player1),
          (updatedGameState.player1 = player1),
          setPlayer2(player2),
          (updatedGameState.player2 = player2),
          setNewBoardCard(boardCard),
          (updatedGameState.boardCard = boardCard),
          setNewDeck(newDeck),
          (updatedGameState.newDeck = newDeck),
          setSuit(suit),
          (updatedGameState.suit = suit);
        setPlayAgain(false);
        shuffleCardsSound.play();
      }
    );

    socketService.socket?.on(
      "update_game_state",
      ({
        gameWon,
        player1,
        player2,
        player1Turn,
        player2Turn,
        boardCard,
        newDeck,
        suit,
      }) => {
        setGameWon(gameWon);
        setPlayer1Turn(player1Turn);
        setPlayer2Turn(player2Turn);
        setPlayer1(player1);
        setPlayer2(player2);
        setNewBoardCard(boardCard);
        setNewDeck(newDeck);
        setSuit(suit);
      }
    );
    socketService.socket?.on("game_won", ({ winner }) => {
      setGameWon(true);
      setWinner(winner);
      setPlayer1Turn(false);
      setPlayer2Turn(false);
    });
    socketService.socket?.on("room_left", () => {
      setGameLeft(true);
      setPlayer1Turn(false);
      setPlayer2Turn(false);
    });
  }, []);
  useEffect(() => {
    handleGameWin();
  }, [player1, player2]);

  //MARK: HandleCard
  const handleCardFunction = async (
    card: CardProps,
    player: CardProps[],
    event: React.MouseEvent
  ) => {
    switch (card.rank) {
      case "jack":
        const playerOne = player1;
        handleNewBoardCard(card, event);
        setPlayer1Turn(false);
        setPlayer2Turn(false);
        resolveTimer();
        if (player === player1) {
          setPlayer1(updatedGameState.player1.filter((c) => c !== card));
          updatedGameState.player1 = updatedGameState.player1.filter(
            (c) => c !== card
          );
          if (player1.length === 1) {
            gameService.updateGame(
              socketService.socket as Socket,
              updatedGameState
            );
            return;
          }
        } else {
          setPlayer2(updatedGameState.player2.filter((c) => c !== card));
          updatedGameState.player2 = updatedGameState.player2.filter(
            (c) => c !== card
          );
          if (player2.length === 1) {
            gameService.updateGame(
              socketService.socket as Socket,
              updatedGameState
            );
            return;
          }
        }
        setSuitSelector(true);
        !isSoundMuted ? playCardSound.play() : null;
        let selectedSuit: Suits | null = null;
        timer = setTimeout(() => {
          if (selectedSuit === null) {
            selectedSuit = "";
          }
          if (player === playerOne) {
            setPlayer2Turn(true);
            updatedGameState.player2Turn = true;
            updatedGameState.player1Turn = false;
          } else {
            setPlayer1Turn(true);
            updatedGameState.player1Turn = true;
            updatedGameState.player2Turn = false;
          }
          setSuitSelector(false);
          suitPromiseRef.current?.resolve("");
          gameService.updateGame(
            socketService.socket as Socket,
            updatedGameState
          );
        }, timeLimit * 1000 - 500);

        await new Promise((resolve) => {
          suitPromiseRef.current = {
            resolve: (selectedSuit: Suits | null) => {
              clearTimeout(timer as NodeJS.Timeout);
              resolve(selectedSuit);
            },
          };
        }).then((selectedSuit) => {
          if (player === playerOne) {
            setPlayer2Turn(true);
            updatedGameState.player2Turn = true;
            updatedGameState.player1Turn = false;
          } else {
            setPlayer1Turn(true);
            updatedGameState.player1Turn = true;
            updatedGameState.player2Turn = false;
          }
          setSuitSelector(false);
          updatedGameState.suit = selectedSuit as Suits;
          gameService.updateGame(
            socketService.socket as Socket,
            updatedGameState
          );
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
            resolveTimer();
            setNewDeck(remainingDeck);
            updatedGameState.newDeck = remainingDeck;
            handleNewBoardCard(card, event);
            setSuit("");
            updatedGameState.suit = "";

            // Add the drawn cards to the opponent's hand
            if (player1Turn) {
              setPlayer2([...(player2 as CardProps[]), ...drawnCards]);
              updatedGameState.player2 = [
                ...(updatedGameState.player2 as CardProps[]),
                ...drawnCards,
              ];
              setPlayer1(player1.filter((c) => c !== card));
              updatedGameState.player1 = updatedGameState.player1.filter(
                (c) => c !== card
              );
            } else {
              setPlayer1([...(player1 as CardProps[]), ...drawnCards]);
              updatedGameState.player1 = [
                ...(updatedGameState.player1 as CardProps[]),
                ...drawnCards,
              ];
              setPlayer2(player2.filter((c) => c !== card));
              updatedGameState.player2 = updatedGameState.player2.filter(
                (c) => c !== card
              );
            }
            gameService.updateGame(
              socketService.socket as Socket,
              updatedGameState
            );
            !isSoundMuted ? playCardSound.play() : null;

            timer = setTimeout(() => {
              const drawnCard = gameService.getRandomCard(
                updatedGameState.newDeck
              );
              updatedGameState.newDeck = updatedGameState.newDeck.filter(
                (c) => c !== drawnCard
              );
              setNewDeck(updatedGameState.newDeck);
              if (player1Turn) {
                setPlayer1([
                  ...updatedGameState.player1,
                  drawnCard as CardProps,
                ]);
                updatedGameState.player1 = [
                  ...updatedGameState.player1,
                  drawnCard as CardProps,
                ];
              } else {
                setPlayer2([
                  ...updatedGameState.player2,
                  drawnCard as CardProps,
                ]);
                updatedGameState.player2 = [
                  ...updatedGameState.player2,
                  drawnCard as CardProps,
                ];
              }
              togglePlayerTurn();
              gameService.updateGame(
                socketService.socket as Socket,
                updatedGameState
              );
              !isSoundMuted ? playCardSound.play() : null;
            }, (remainingTime - 1) * 1000);
            await new Promise((resolve) => {
              timerPromiseRef.current = {
                resolve: () => {
                  clearTimeout(timer as NodeJS.Timeout);
                  resolve(true);
                },
              };
            });
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
                newBoardCard?.rank === "ace" ||
                newBoardCard?.suit === "joker" ||
                newBoardCard?.rank === "jack")) ||
            suit === "Diamonds" ||
            suit === "Hearts"
          ) {
            const { drawnCards, remainingDeck } = gameService.pickNCards(
              4,
              updatedGameState.newDeck
            );
            setNewDeck(remainingDeck);
            updatedGameState.newDeck = remainingDeck;
            handleNewBoardCard(card, event);
            setSuit("");
            updatedGameState.suit = "";

            // Add the drawn cards to the opponent's hand
            if (player1Turn) {
              setPlayer2([...(player2 as CardProps[]), ...drawnCards]);
              updatedGameState.player2 = [
                ...(updatedGameState.player2 as CardProps[]),
                ...drawnCards,
              ];
              setPlayer1(player1.filter((c) => c !== card));
              updatedGameState.player1 = updatedGameState.player1.filter(
                (c) => c !== card
              );
            } else {
              setPlayer1([...(player1 as CardProps[]), ...drawnCards]);
              updatedGameState.player1 = [
                ...(updatedGameState.player1 as CardProps[]),
                ...drawnCards,
              ];
              setPlayer2(player2.filter((c) => c !== card));
              updatedGameState.player2 = updatedGameState.player2.filter(
                (c) => c !== card
              );
            }
            gameService.updateGame(
              socketService.socket as Socket,
              updatedGameState
            );
            !isSoundMuted ? playCardSound.play() : null;

            resolveTimer();
            timer = setTimeout(() => {
              const drawnCard = gameService.getRandomCard(
                updatedGameState.newDeck
              );
              updatedGameState.newDeck = updatedGameState.newDeck.filter(
                (c) => c !== drawnCard
              );
              setNewDeck(updatedGameState.newDeck);
              if (player1Turn) {
                setPlayer1([
                  ...updatedGameState.player1,
                  drawnCard as CardProps,
                ]);
                updatedGameState.player1 = [
                  ...updatedGameState.player1,
                  drawnCard as CardProps,
                ];
              } else {
                setPlayer2([
                  ...updatedGameState.player2,
                  drawnCard as CardProps,
                ]);
                updatedGameState.player2 = [
                  ...updatedGameState.player2,
                  drawnCard as CardProps,
                ];
              }
              togglePlayerTurn();
              gameService.updateGame(
                socketService.socket as Socket,
                updatedGameState
              );
              !isSoundMuted ? playCardSound.play() : null;
            }, (remainingTime - 1) * 1000);
            await new Promise((resolve) => {
              timerPromiseRef.current = {
                resolve: () => {
                  clearTimeout(timer as NodeJS.Timeout);
                  resolve(true);
                },
              };
            });
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
          suit === "Spades" ||
          suit === "Clubs"
        ) {
          const { drawnCards, remainingDeck } = gameService.pickNCards(
            4,
            updatedGameState.newDeck
          );
          setNewDeck(remainingDeck);
          updatedGameState.newDeck = remainingDeck;
          handleNewBoardCard(card, event);
          setSuit("");
          updatedGameState.suit = "";

          // Add the drawn cards to the opponent's hand
          if (player1Turn) {
            setPlayer2([...(player2 as CardProps[]), ...drawnCards]);
            updatedGameState.player2 = [
              ...(updatedGameState.player2 as CardProps[]),
              ...drawnCards,
            ];
            setPlayer1(player1.filter((c) => c !== card));
            updatedGameState.player1 = updatedGameState.player1.filter(
              (c) => c !== card
            );
          } else {
            setPlayer1([...(player1 as CardProps[]), ...drawnCards]);
            updatedGameState.player1 = [
              ...(updatedGameState.player1 as CardProps[]),
              ...drawnCards,
            ];
            setPlayer2(player2.filter((c) => c !== card));
            updatedGameState.player2 = updatedGameState.player2.filter(
              (c) => c !== card
            );
          }
          gameService.updateGame(
            socketService.socket as Socket,
            updatedGameState
          );
          !isSoundMuted ? playCardSound.play() : null;

          resolveTimer();
          timer = setTimeout(() => {
            const drawnCard = gameService.getRandomCard(
              updatedGameState.newDeck
            );
            updatedGameState.newDeck = updatedGameState.newDeck.filter(
              (c) => c !== drawnCard
            );
            setNewDeck(updatedGameState.newDeck);
            if (player1Turn) {
              setPlayer1([...updatedGameState.player1, drawnCard as CardProps]);
              updatedGameState.player1 = [
                ...updatedGameState.player1,
                drawnCard as CardProps,
              ];
            } else {
              setPlayer2([...updatedGameState.player2, drawnCard as CardProps]);
              updatedGameState.player2 = [
                ...updatedGameState.player2,
                drawnCard as CardProps,
              ];
            }
            togglePlayerTurn();
            gameService.updateGame(
              socketService.socket as Socket,
              updatedGameState
            );
            !isSoundMuted ? playCardSound.play() : null;
          }, (remainingTime - 1) * 1000);
          await new Promise((resolve) => {
            timerPromiseRef.current = {
              resolve: () => {
                clearTimeout(timer as NodeJS.Timeout);
                resolve(true);
              },
            };
          });
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
          updatedGameState.suit = "";

          if (player === player1) {
            setPlayer1(player1.filter((c) => c !== card));
            updatedGameState.player1 = updatedGameState.player1.filter(
              (c) => c !== card
            );
          } else {
            setPlayer2(player2.filter((c) => c !== card));
            updatedGameState.player2 = updatedGameState.player2.filter(
              (c) => c !== card
            );
          }
          gameService.updateGame(
            socketService.socket as Socket,
            updatedGameState
          );
          !isSoundMuted ? playCardSound.play() : null;

          resolveTimer();
          timer = setTimeout(() => {
            const drawnCard = gameService.getRandomCard(
              updatedGameState.newDeck
            );
            updatedGameState.newDeck = updatedGameState.newDeck.filter(
              (c) => c !== drawnCard
            );
            setNewDeck(updatedGameState.newDeck);
            if (player1Turn) {
              setPlayer1([...updatedGameState.player1, drawnCard as CardProps]);
              updatedGameState.player1 = [
                ...updatedGameState.player1,
                drawnCard as CardProps,
              ];
            } else {
              setPlayer2([...updatedGameState.player2, drawnCard as CardProps]);
              updatedGameState.player2 = [
                ...updatedGameState.player2,
                drawnCard as CardProps,
              ];
            }
            togglePlayerTurn();
            gameService.updateGame(
              socketService.socket as Socket,
              updatedGameState
            );
            !isSoundMuted ? playCardSound.play() : null;
          }, (remainingTime - 1) * 1000);
          await new Promise((resolve) => {
            timerPromiseRef.current = {
              resolve: () => {
                clearTimeout(timer as NodeJS.Timeout);
                resolve(true);
              },
            };
          });
        }
        break;

      default:
        if (suit && suit === card.suit) {
          if (player === player1) {
            setPlayer1(player1.filter((c) => c !== card));
            updatedGameState.player1 = updatedGameState.player1.filter(
              (c) => c !== card
            );
          } else {
            setPlayer2(player2.filter((c) => c !== card));
            updatedGameState.player2 = updatedGameState.player2.filter(
              (c) => c !== card
            );
          }
          togglePlayerTurn();
          updatedGameState.player1Turn = !player1Turn;
          updatedGameState.player2Turn = !player2Turn;
          handleNewBoardCard(card, event);
          setSuit("");
          updatedGameState.suit = "";
          gameService.updateGame(
            socketService.socket as Socket,
            updatedGameState
          );
          !isSoundMuted ? playCardSound.play() : null;
          resolveTimer();
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
          if (player === player1) {
            setPlayer1(player1.filter((c) => c !== card));
            updatedGameState.player1 = updatedGameState.player1.filter(
              (c) => c !== card
            );
          } else {
            setPlayer2(player2.filter((c) => c !== card));
            updatedGameState.player2 = updatedGameState.player2.filter(
              (c) => c !== card
            );
          }
          togglePlayerTurn();
          updatedGameState.player1Turn = !player1Turn;
          updatedGameState.player2Turn = !player2Turn;
          handleNewBoardCard(card, event);
          gameService.updateGame(
            socketService.socket as Socket,
            updatedGameState
          );
          !isSoundMuted ? playCardSound.play() : null;
          resolveTimer();
        }
        break;
    }
    console.log(updatedGameState);
  };
  //MARK: Functions
  const updateSuit = (newSuit: Suits) => {
    // sets suit when jcommand is played
    // Resolve the existing promise if any (prevents accumulation)
    setSuit(newSuit);
    suitPromiseRef.current?.resolve(newSuit);
    suitPromiseRef.current = null;
  };
  const resolveTimer = () => {
    timerPromiseRef.current?.resolve(true);
    timerPromiseRef.current = null;
  };
  const handleNewBoardCard = (card: CardProps, event: React.MouseEvent) => {
    // removes played card from deck
    // pushes old board card to deck
    // sets played card as new board card
    if (newBoardCard) {
      setNewDeck((prevDeck) => [...prevDeck, newBoardCard]);
      updatedGameState.newDeck = [
        ...updatedGameState.newDeck,
        updatedGameState.boardCard as CardProps,
      ];
    }
    updatedGameState.boardCard = card;
    const board = document.querySelector(".board-card");
    const clickedCard = event.currentTarget as HTMLElement;
    const cardClone = clickedCard.cloneNode(true) as HTMLElement;
    cardClone.classList.add("card-move");
    board?.appendChild(cardClone);

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
  const togglePlayerTurn = () => {
    if (player1Turn) {
      setPlayer1Turn(false);
      updatedGameState.player1Turn = false;
      setPlayer2Turn(true);
      updatedGameState.player2Turn = true;
    } else if (player2Turn) {
      setPlayer2Turn(false);
      updatedGameState.player2Turn = false;
      setPlayer1Turn(true);
      updatedGameState.player1Turn = true;
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
  const handleDeckClick1 = () => {
    // Generate a random card from the remaining deck
    // Add the drawn card to the current player's hand
    if (newDeck && player1Turn) {
      const drawnCard = gameService.getRandomCard(updatedGameState.newDeck);
      updatedGameState.newDeck = updatedGameState.newDeck.filter(
        (c) => c !== drawnCard
      );
      setNewDeck(updatedGameState.newDeck);
      setPlayer1([...updatedGameState.player1, drawnCard as CardProps]);
      updatedGameState.player1 = [
        ...updatedGameState.player1,
        drawnCard as CardProps,
      ];
      setSuitSelector(false);
      togglePlayerTurn();

      gameService.updateGame(socketService.socket as Socket, updatedGameState);
      !isSoundMuted ? playCardSound.play() : null;
      resolveTimer();
    }
  };
  const handleDeckClick2 = () => {
    // Generate a random card from the remaining deck
    // Add the drawn card to the current player's hand
    if (newDeck && player2Turn) {
      const drawnCard = gameService.getRandomCard(updatedGameState.newDeck);
      updatedGameState.newDeck = updatedGameState.newDeck.filter(
        (c) => c !== drawnCard
      );
      setNewDeck(updatedGameState.newDeck);
      setPlayer2([...updatedGameState.player2, drawnCard as CardProps]);
      updatedGameState.player2 = [
        ...updatedGameState.player2,
        drawnCard as CardProps,
      ];
      setSuitSelector(false);
      togglePlayerTurn();
      gameService.updateGame(socketService.socket as Socket, updatedGameState);
      !isSoundMuted ? playCardSound.play() : null;
      resolveTimer();
    }
  };
  const leaveGameFunction = () => {
    setLeaveGame(true);
    console.log(leaveGame);
  };
  const handleLeaveGame = () => {
    socketService.socket?.emit("leave_room", { roomName });
  };

  const handleGameWin = () => {
    if (player1.length === 0 || player2.length === 0) {
      setGameWon(true);
      setPlayer2Turn(false);
      setPlayer1Turn(false);
      console.log(player1.length, currentUser);
      player1.length === 0 && currentUser === "player1"
        ? setWinner("You Win!")
        : player2.length === 0 && currentUser === "player2"
        ? setWinner("You Win!")
        : setWinner("You Lose!");
    }
  };
  const reset = () => {
    deck = gameService.generateFullDeck();
    const { playerHands, boardCard, remainingDeck } =
      gameService.distributeCards(deck, 2, 7);
    setPlayer1(playerHands[0]);
    updatedGameState.player1 = playerHands[0];
    setPlayer2(playerHands[1]);
    updatedGameState.player2 = playerHands[1];
    setNewDeck(remainingDeck || []);
    updatedGameState.newDeck = remainingDeck || [];
    setNewBoardCard(boardCard);
    updatedGameState.boardCard = boardCard;
    setPlayer1Turn(false);
    updatedGameState.player1Turn = false;
    setPlayer2Turn(false);
    updatedGameState.player2Turn = false;
    setGameWon(false);
    updatedGameState.gameWon = false;
    setLeaveGame(false);
    setGameLeft(false);
    setWinner("");
    setRemainingTime(timeLimit);
    setSuitSelector(false);
    setSuit("");
    suitPromiseRef.current = null;
    timerPromiseRef.current = null;
  };
  const playAgainFunction = async () => {
    reset();
    setPlayAgain(true);
    gameService.playAgain(socketService.socket as Socket, updatedGameState);
  };

  //MARK: - JSX
  return (
    <>
      <Dashboard>
        <div className="flex w-full pl-2 pr-2 justify-between">
          <Button onClick={leaveGameFunction} variant="destructive">
            Quit
          </Button>
          <Button
            variant="outline"
            className="flex justify-center items-center w-8 h-8 p-1"
            onClick={() => setIsSoundMuted(!isSoundMuted)}
          >
            {!isSoundMuted ? (
              <Volume className="w-full h-full" />
            ) : (
              <VolumeX className="w-full h-full" />
            )}
          </Button>
        </div>
        {leaveGame && (
          <DialogBox isOpen={leaveGame} title="Are you sure?">
            <div className="flex gap-6 p-5 justify-center">
              <Button
                variant="secondary"
                onClick={() => {
                  setLeaveGame(false);
                }}
              >
                <X />
              </Button>
              <Link to={"/"}>
                <Button variant="outline" onClick={handleLeaveGame}>
                  <Check />
                </Button>
              </Link>
            </div>
          </DialogBox>
        )}
        <div className="flex flex-col gap-1 justify-center">
          <div className="flex w-full justify-center">
            {currentUser === "player1" ? (
              <PlayerHand playerTurn={false} playerHand={cardArray2} />
            ) : (
              <PlayerHand playerTurn={false} playerHand={cardArray1} />
            )}
          </div>
          <div className="flex w-full justify-center">
            <p className="text-white text-sm font-semibold">{opponentName}</p>
          </div>
        </div>
        <div className="flex gap-4">
          {currentUser === "player1" ? (
            <Deck onCardClick={handleDeckClick1} />
          ) : (
            <Deck onCardClick={handleDeckClick2} />
          )}
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
        <div className="flex flex-col gap-1 justify-center">
          <div className="flex w-full justify-center">
            <p className="text-white text-sm font-semibold">{playerName}</p>
          </div>
          <div className="flex w-full justify-center">
            {currentUser === "player1" ? (
              <PlayerHand
                playerTurn={player1Turn}
                playerHand={player1}
                handleCardClick={playCard1}
              />
            ) : (
              <PlayerHand
                playerTurn={player2Turn}
                playerHand={player2}
                handleCardClick={playCard2}
              />
            )}
          </div>
        </div>
        {gameWon && !gameLeft && (
          <DialogBox isOpen={gameWon} title={winner}>
            <div className="flex gap-5 flex-col pt-10 pb-10 rounded-md">
              <Button variant="secondary">
                <Link to="/multiplayer">Back to Main Menu</Link>
              </Button>
              <Button variant="secondary" onClick={playAgainFunction}>
                Play Again
              </Button>
            </div>
          </DialogBox>
        )}
        {gameLeft && (
          <DialogBox isOpen={gameLeft} title={!gameWon ? "You Win!" : ""}>
            <div className="w-full flex flex-col gap-5 justify-center p-4 rounded-md">
              <p>Opponent Left {gameWon ? "Room" : "Game"}</p>
              <Link to={"/"} className="w-full flex justify-center">
                <Button variant="ghost">
                  <Home />
                </Button>
              </Link>
            </div>
          </DialogBox>
        )}
        {playAgain && !gameLeft && (
          <DialogBox isOpen={playAgain}>
            <div className="w-full flex flex-col gap-5 justify-center p-4 rounded-md">
              <p className="font-semibold">Waiting for Opponent...</p>
              <Link to={"/"} className="w-full flex justify-center">
                <Button variant="ghost">
                  <X />
                </Button>
              </Link>
            </div>
          </DialogBox>
        )}
        <Chat />
        <div className="fixed bottom-4 p-0 left-2 md:bottom-2 md:left-[100px] lg:bottom-2 lg:left-[210px]">
          {(currentUser === "player1" && player1Turn) || suitSelector ? (
            <Timer
              timeLimit={timeLimit}
              playerTurn={player1Turn}
              suitSelector={suitSelector}
              remainingTime={remainingTime}
              setRemainingTime={setRemainingTime}
              handleTimeOut={handleDeckClick1}
            />
          ) : (currentUser === "player2" && player2Turn) || suitSelector ? (
            <Timer
              timeLimit={timeLimit}
              playerTurn={player2Turn}
              suitSelector={suitSelector}
              remainingTime={remainingTime}
              setRemainingTime={setRemainingTime}
              handleTimeOut={handleDeckClick2}
            />
          ) : null}
        </div>
      </Dashboard>
    </>
  );
};

export default Game;
