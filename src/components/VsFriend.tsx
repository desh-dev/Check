import { useEffect, useState } from "react";
import CreateRoom from "./CreateRoom";
import ShareRoom from "./ShareRoom";
import Game from "./multiplayer/Game";
import socketService from "@/services/socketService";
import SessionSelect from "./SessionSelect";
import JoinRoom from "./JoinRoom";

const VsFriend = () => {
  const ENDPOINT = "http://localhost:9000";

  const connectionOptions = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
  };

  const [roomName, setRoomName] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [roomFull, setRoomFull] = useState(false);
  const [createRoom, setCreateRoom] = useState(false);
  const [joinRoom, setJoinRoom] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState("");

  const connectSocket = async () => {
    await socketService.connect(ENDPOINT, connectionOptions).catch((err) => {
      console.log("Error: ", err);
    });
  };

  useEffect(() => {
    connectSocket();
    socketService.socket?.on("room_created", ({ player }) => {
      setCurrentUser(player);
      console.log(player);
    });
    socketService.socket?.on("room_joined", ({ player, opponent1 }) => {
      setOpponentName(opponent1);
      setCurrentUser(player);
      console.log(player);
    });
    socketService.socket?.on("room_full", () => {
      setRoomFull(true);
      socketService.socket?.on("opponent", ({ opponent2 }) => {
        console.log(opponent2);
        setOpponentName(opponent2);
      });
    });
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setPlayerName(JSON.parse(storedName));
    }

    return () => {
      //shut down connnection instance
      socketService.socket?.disconnect();
    };
  }, []);
  useEffect(() => {
    if (playerName)
      localStorage.setItem("playerName", JSON.stringify(playerName));
  }, [playerName]);

  return (
    <>
      {!createRoom && !joinRoom && !roomName && !roomFull && (
        <SessionSelect
          setCreateRoom={setCreateRoom}
          setJoinRoom={setJoinRoom}
        />
      )}
      {!roomName && createRoom && (
        <CreateRoom
          playerName={playerName}
          setPlayerName={setPlayerName}
          setRoomName={setRoomName}
          createRoom={createRoom}
          setCreateRoom={setCreateRoom}
        />
      )}
      {!roomName && joinRoom && (
        <JoinRoom
          playerName={playerName}
          setPlayerName={setPlayerName}
          setRoomName={setRoomName}
          joinGameRoom={joinRoom}
          setJoinGameRoom={setJoinRoom}
        />
      )}
      {roomName && !roomFull && <ShareRoom roomName={roomName} />}
      {roomFull && (
        <Game
          roomName={roomName}
          currentUser={currentUser}
          playerName={playerName}
          opponentName={opponentName}
        />
      )}
    </>
  );
};

export default VsFriend;
