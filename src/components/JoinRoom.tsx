import React, { useContext, useState } from "react";
import gameContext from "@/gameContext";
import gameService from "@/services/gameService";
import socketService from "@/services/socketService";
import Dashboard from "./Dashboard";
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

interface IJoinRoomProps {
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  joinGameRoom: boolean;
  setJoinGameRoom: React.Dispatch<React.SetStateAction<boolean>>;
  tempPlayerName: string;
  setTempPlayerName: React.Dispatch<React.SetStateAction<string>>;
}
const FormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Nickname must be at least 3 characters" })
    .max(10, { message: "Nickname must be at most 10 characters" })
    .refine((value) => value !== null && value !== undefined, {
      message: "Room name is required",
    }),
  roomName: z
    .string()
    .length(6, { message: "Room name must be 6 characters" })
    .refine((value) => value !== null && value !== undefined, {
      message: "Room name is required",
    }),
});

const JoinRoom = ({
  setRoomName,
  joinGameRoom,
  setJoinGameRoom,
  tempPlayerName,
  setTempPlayerName,
}: IJoinRoomProps) => {
  const [isJoining, setJoining] = useState(false);
  const { setInRoom, playerName } = useContext(gameContext);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  //   const handleRoomNameChange = (e: React.ChangeEvent<any>) => {
  //     const value = e.target.value;
  //     setRoom(value);
  //   };

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

    const joined = await gameService
      .joinGameRoom(socket, data.roomName)
      .catch((err) => {
        alert(err);
      });

    if (joined) {
      setTempPlayerName(data.username);
      setInRoom(true);
      setRoomName(data.roomName);
    }
    setJoining(false);
  };

  return (
    <Dashboard>
      <div className="bg-muted/40 p-10 rounded-md">
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
                      {...field}
                      defaultValue={playerName ? playerName : tempPlayerName}
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
                      {...field}
                      autoComplete="off"
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
        </Form>
      </div>
    </Dashboard>
  );
};

export default JoinRoom;
