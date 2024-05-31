import React, { useEffect, useState } from "react";
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
  joinGameRoom: boolean;
  setJoinGameRoom: React.Dispatch<React.SetStateAction<boolean>>;
  playerName: string;
  setPlayerName: React.Dispatch<React.SetStateAction<string>>;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
}

const JoinRoom = ({
  joinGameRoom,
  setJoinGameRoom,
  playerName,
  setPlayerName,
  setRoomName,
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
      .length(6, { message: "Room name must be 6 characters" })
      .refine((value) => value !== null && value !== undefined, {
        message: "Room name is required",
      }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [isJoining, setJoining] = useState(false);

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
      .joinGameRoom(socket, data.roomName, data.username)
      .catch((err) => {
        alert(err);
      });

    if (joined) {
      setPlayerName(data.username);
      setRoomName(data.roomName);
    }
    setJoining(false);
  };
  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setPlayerName(JSON.parse(storedName));
    }
  }, []);

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
        </Form>
      </div>
    </Dashboard>
  );
};

export default JoinRoom;
