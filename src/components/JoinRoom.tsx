import React, { useEffect, useState } from "react";
import gameService from "@/services/gameService";
import socketService from "@/services/socketService";
import { z } from "zod";
import BackButton from "./BackButton";
import { Button } from "./ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import { useAuth } from "@/hooks/Auth";
import { X, Check } from "lucide-react";
import DialogBox from "./DialogBox";

interface IJoinRoomProps {
  joinGameRoom: boolean;
  setJoinGameRoom: React.Dispatch<React.SetStateAction<boolean>>;
  playerName: string;
  setPlayerName: React.Dispatch<React.SetStateAction<string>>;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  stake: number | null;
  setStake: React.Dispatch<React.SetStateAction<number | null>>;
}

const JoinRoom = ({
  joinGameRoom,
  setJoinGameRoom,
  playerName,
  setPlayerName,
  setRoomName,
  stake,
  setStake,
}: IJoinRoomProps) => {
  const FormSchema = z.object({
    username: z
      .string()
      .min(3, { message: "Nickname must be at least 3 characters" })
      .max(10, { message: "Nickname must be at most 10 characters" })
      .refine((value) => value !== null && value !== undefined, {
        message: "Room name is required",
      })
      .default(playerName),
    roomName: z
      .string()
      .length(6, { message: "Room name must be 6 or 8 characters" })
      .or(
        z.string().length(8, { message: "Room name must be 6 or 8 characters" })
      )
      .refine((value) => value !== null && value !== undefined, {
        message: "Room name is required",
      }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [stakedRoom, setStakedRoom] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [isJoining, setJoining] = useState(false);
  const { accountBalance } = useAuth();

  const joinRoom = async (data: z.infer<typeof FormSchema>) => {
    const socket = socketService.socket;
    if (
      !data.username ||
      data.username.trim() === "" ||
      !socket ||
      !data.roomName
    )
      return;
    setJoining(true);
    setErrMsg("");
    console.log("Join Room", stake, accountBalance);

    const joined = await gameService
      .joinGameRoom(socket, data.roomName, data.username)
      .catch((err) => {
        setErrMsg(err);
        setJoining(false);
      });

    if (joined) {
      setPlayerName(data.username);
      setRoomName(data.roomName);
    }
    setJoining(false);
  };
  const confirmStakedRoom = () => {
    socketService.socket?.emit("confirm_join");
    setStakedRoom(false);
  };
  const rejectStakedRoom = () => {
    socketService.socket?.emit("reject_join");
    setStake(null);
    setStakedRoom(false);
  };
  useEffect(() => {
    socketService.socket?.on("staked_room", ({ stake }) => {
      if (stake && accountBalance && accountBalance < stake) {
        setErrMsg("Insufficient balance");
        rejectStakedRoom();
      } else {
        setStakedRoom(true);
        setStake(stake);
      }
    });
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setPlayerName(JSON.parse(storedName));
    }
  }, []);

  return (
    <div className="bg-muted/40 p-10 rounded-md">
      {stakedRoom && (
        <DialogBox isOpen={stakedRoom} title="Staked Room">
          <p className="text-center">
            This room is staked at <b> {stake} FCFA</b>. Would you like to
            continue?
          </p>
          <div className="flex gap-6 p-5 justify-center">
            <Button variant="outline" onClick={rejectStakedRoom}>
              <X />
            </Button>
            <Button variant="secondary" onClick={confirmStakedRoom}>
              <Check />
            </Button>
          </div>
        </DialogBox>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(joinRoom)}
          className="flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Nickname</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nickname"
                    defaultValue={playerName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roomName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Room Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Room Name"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Button variant={"secondary"} type="submit" disabled={isJoining}>
              {isJoining ? "Joining..." : "Join Room"}
            </Button>
            <BackButton state={joinGameRoom} setState={setJoinGameRoom}>
              Back
            </BackButton>
          </div>
        </form>
        {errMsg && <ErrorMessage message={errMsg} />}
      </Form>
    </div>
  );
};

export default JoinRoom;
