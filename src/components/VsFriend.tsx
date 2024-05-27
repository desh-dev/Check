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
  const [tempPlayerName, setTempPlayerName] = useState("");

  const connectSocket = async () => {
    await socketService.connect(ENDPOINT, connectionOptions).catch((err) => {
      console.log("Error: ", err);
    });
  };

  useEffect(() => {
    connectSocket();
    socketService.socket?.on("room_created", ({ player, userId }) => {
      setCurrentUser(player);
      console.log(player, userId);
    });
    socketService.socket?.on("room_joined", ({ player, userId }) => {
      setCurrentUser(player);
      console.log(player, userId);
    });
    socketService.socket?.on("room_full", () => {
      setRoomFull(true);
    });

    // socketService.socket?.on("userData", ({ userId }) => {
    //   setUsers([...users, userId]);
    //   console.log(users, currentUser);
    //   //when second player joins game
    // });
    // socketService.socket?.on("newUserData", ({ userId }) => {
    //   setUsers(users.filter((user) => user !== userId));
    //   console.log(users, currentUser);
    // });
    return () => {
      //shut down connnection instance
      socketService.socket?.disconnect();
    };
  }, []);

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
          setRoomName={setRoomName}
          roomName={roomName}
          createRoom={createRoom}
          setCreateRoom={setCreateRoom}
          tempPlayerName={tempPlayerName}
          setTempPlayerName={setTempPlayerName}
        />
      )}
      {!roomName && joinRoom && (
        <JoinRoom
          setRoomName={setRoomName}
          joinGameRoom={joinRoom}
          setJoinGameRoom={setJoinRoom}
          tempPlayerName={tempPlayerName}
          setTempPlayerName={setTempPlayerName}
        />
      )}
      {roomName && !roomFull && <ShareRoom roomName={roomName} />}
      {roomFull && <Game roomName={roomName} currentUser={currentUser} />}
    </>
  );
};

export default VsFriend;
