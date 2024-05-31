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
import { v4 as uuidv4 } from "uuid";
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
  // const location = useLocation();
  // const data = new URLSearchParams(location.search);

  const deck = gameService.generateFullDeck();

  const { playerHands, boardCard, remainingDeck } = gameService.distributeCards(
    deck,
    2,
    7
  );
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
  const suitPromiseRef = useRef<{ resolve: (value: Suits) => void } | null>(
    null
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
        player1Turn,
        player2Turn,
        boardCard,
        newDeck,
        suit,
      }) => {
        setGameWon(gameWon),
          (updatedGameState.gameWon = gameWon),
          setPlayer1Turn(player1Turn),
          (updatedGameState.player1Turn = player1Turn),
          setPlayer2Turn(player2Turn),
          (updatedGameState.player2Turn = player2Turn),
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
        shuffleCardsSound.play();
      }
    );

    socketService.socket?.on(
      "update_game_state",
      ({
        gameWon,
        winner,
        player1,
        player2,
        player1Turn,
        player2Turn,
        boardCard,
        newDeck,
        suit,
      }) => {
        setGameWon(gameWon);
        setWinner(winner);
        setPlayer1Turn(player1Turn);
        setPlayer2Turn(player2Turn);
        setPlayer1(player1);
        setPlayer2(player2);
        setNewBoardCard(boardCard);
        setNewDeck(newDeck);
        setSuit(suit);
      }
    );
    socketService.socket?.on("room_left", () => {
      setGameLeft(true);
      setPlayer1Turn(false);
      setPlayer2Turn(false);
    });
  }, []);

  const updateSuit = (newSuit: Suits) => {
    // sets suit when jcommand is played
    // Resolve the existing promise if any (prevents accumulation)
    setSuit(newSuit);
    suitPromiseRef.current?.resolve(newSuit);

    suitPromiseRef.current = null;
  };

  const handleNewBoardCard = (card: CardProps) => {
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
    setNewBoardCard(card);
    updatedGameState.boardCard = card;
  };

  const handleCardFunction = async (card: CardProps, player: CardProps[]) => {
    switch (card.rank) {
      case "jack":
        setSuitSelector(true);
        handleNewBoardCard(card);
        setPlayer1Turn(false);
        setPlayer2Turn(false);
        const playerOne = player1;
        if (player === player1) {
          setPlayer1(updatedGameState.player1.filter((c) => c !== card));
          updatedGameState.player1 = updatedGameState.player1.filter(
            (c) => c !== card
          );
        } else {
          setPlayer2(updatedGameState.player2.filter((c) => c !== card));
          updatedGameState.player2 = updatedGameState.player2.filter(
            (c) => c !== card
          );
        }
        let selectedSuit: Suits | null = null;
        const timer = setTimeout(() => {
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
        }, (timeLimit - 1) * 1000);

        await new Promise((resolve) => {
          suitPromiseRef.current = {
            resolve: (selectedSuit: Suits | null) => {
              clearTimeout(timer);
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
          !isSoundMuted ? playCardSound.play() : null;
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
            updatedGameState.newDeck = remainingDeck;
            handleNewBoardCard(card);
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
            handleNewBoardCard(card);
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
          handleNewBoardCard(card);
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
          handleNewBoardCard(card);
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
          handleNewBoardCard(card);
          setSuit("");
          updatedGameState.suit = "";
          setSuitSelector(false);
          gameService.updateGame(
            socketService.socket as Socket,
            updatedGameState
          );
          !isSoundMuted ? playCardSound.play() : null;
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
          handleNewBoardCard(card);
          gameService.updateGame(
            socketService.socket as Socket,
            updatedGameState
          );
          !isSoundMuted ? playCardSound.play() : null;
        }
        break;
    }
    console.log(updatedGameState);
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
      setPlayer1Turn(false);
      updatedGameState.player1Turn = false;
      setPlayer2Turn(true);
      updatedGameState.player2Turn = true;

      gameService.updateGame(socketService.socket as Socket, updatedGameState);
      !isSoundMuted ? playCardSound.play() : null;
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
      setPlayer2Turn(false);
      updatedGameState.player2Turn = false;
      setPlayer1Turn(true);
      updatedGameState.player1Turn = true;
      gameService.updateGame(socketService.socket as Socket, updatedGameState);
      !isSoundMuted ? playCardSound.play() : null;
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
    if (player1.length === 0) {
      alert("Player 1 Wins");
      setGameWon(true);
      setPlayer2Turn(false);
    }
    if (player2.length === 0) {
      alert("Player 2 Wins");
      setGameWon(true);
      setPlayer1Turn(false);
    }
  };

  useEffect(() => {
    handleGameWin();
  }, [player1, player2]);

  const cardArray1: CardProps[] = Array.from(
    { length: player1.length },
    () => ({ suit: "card", rank: "cover", id: uuidv4() })
  );
  const cardArray2: CardProps[] = Array.from(
    { length: player2.length },
    () => ({ suit: "card", rank: "cover", id: uuidv4() })
  );
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
        <div className="flex flex-col w-75% gap-1 justify-center">
          {currentUser === "player1" ? (
            <PlayerHand playerTurn={false} playerHand={cardArray2} />
          ) : (
            <PlayerHand playerTurn={false} playerHand={cardArray1} />
          )}
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
        <div className="flex flex-col w-75% gap-1 justify-center">
          <div className="flex w-full justify-center">
            <p className="text-white text-sm font-semibold">{playerName}</p>
          </div>
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
        {gameWon && (
          <DialogBox isOpen={gameWon}>
            <div className="flex gap-5 flex-col pt-10 pb-10 rounded-md">
              <Button variant="secondary" onClick={() => {}}>
                Back to Main Menu
              </Button>
              <Button variant="secondary">Play Again</Button>
            </div>
          </DialogBox>
        )}
        {gameLeft && (
          <DialogBox isOpen={gameLeft} title="You Win!">
            <div className="w-full flex flex-col gap-5 justify-center p-4 rounded-md">
              <p>Opponent Left Game</p>
              <Link to={"/"} className="w-full flex justify-center">
                <Button variant="ghost">
                  <Home />
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
