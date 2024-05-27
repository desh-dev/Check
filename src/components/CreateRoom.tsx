import React, { useContext, useState } from "react";
import gameContext from "@/gameContext";
import gameService from "@/services/gameService";
import socketService from "@/services/socketService";
import { v4 as uuidv4 } from "uuid";
import Dashboard from "./Dashboard";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import BackButton from "./BackButton";

interface IJoinRoomProps {
  roomName: string;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  createRoom: boolean;
  setCreateRoom: React.Dispatch<React.SetStateAction<boolean>>;
  tempPlayerName: string;
  setTempPlayerName: React.Dispatch<React.SetStateAction<string>>;
}

const FormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Nickname must be at least 3 characters" })
    .max(10, { message: "Nickname must be at most 10 characters" })
    .refine((value) => value !== null && value !== undefined, {
      message: "Nickname is required",
    }),
});

const CreateRoom = ({
  setRoomName,
  roomName,
  createRoom,
  setCreateRoom,
  tempPlayerName,
  setTempPlayerName,
}: IJoinRoomProps) => {
  const [isJoining, setJoining] = useState(false);
  const { setInRoom, playerName } = useContext(gameContext);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const joinRoom = async (data: z.infer<typeof FormSchema>) => {
    const socket = socketService.socket;
    if (!data.username || data.username.trim() === "" || !socket) return;
    const randomRoomName = uuidv4().substring(0, 6).toUpperCase();
    setJoining(true);
    setTempPlayerName(data.username);

    const joined = await gameService
      .createGameRoom(socket, randomRoomName)
      .catch((err) => {
        alert(err);
      });

    if (joined) {
      setInRoom(true);
      setRoomName(randomRoomName);
      console.log(roomName);
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
                      placeholder="Name"
                      {...field}
                      defaultValue={playerName ? playerName : tempPlayerName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button variant={"secondary"} type="submit" disabled={isJoining}>
                {isJoining ? "Creating..." : "Create Room"}
              </Button>
              <BackButton state={createRoom} setState={setCreateRoom}>
                Back
              </BackButton>
            </div>
          </form>
        </Form>
      </div>
    </Dashboard>
  );
};

export default CreateRoom;
