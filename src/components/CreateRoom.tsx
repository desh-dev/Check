import React, { useEffect, useState } from "react";
import gameService from "@/services/gameService";
import socketService from "@/services/socketService";
import { v4 as uuidv4 } from "uuid";
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
import ErrorMessage from "./ErrorMessage";
import { Checkbox } from "./ui/checkbox";
import { useAuth } from "@/hooks/Auth";

interface IJoinRoomProps {
  playerName: string;
  setStake: React.Dispatch<React.SetStateAction<number | null>>;
  createRoom: boolean;
  withStake: boolean;
  setWithStake: React.Dispatch<React.SetStateAction<boolean>>;
  setCreateRoom: React.Dispatch<React.SetStateAction<boolean>>;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  setPlayerName: React.Dispatch<React.SetStateAction<string>>;
}

const CreateRoom = ({
  playerName,
  setStake,
  createRoom,
  withStake,
  setWithStake,
  setCreateRoom,
  setRoomName,
  setPlayerName,
}: IJoinRoomProps) => {
  const [formData, setFormData] = useState<{ stake: number | string }>({
    stake: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsedNumber = parseFloat(event.target.value);
    setFormData({ ...formData, stake: parsedNumber });
  };
  const FormSchema = z.object({
    username: z
      .string()
      .min(3, { message: "Nickname must be at least 3 characters" })
      .max(10, { message: "Nickname must be at most 10 characters" })
      .refine((value) => value !== null && value !== undefined, {
        message: "Nickname is required",
      })
      .default(playerName),
    stake: z
      .number()
      .min(2, { message: "Stake must be above 9 FCFA" })
      .nullish(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [errMsg, setErrMsg] = useState("");
  const [isJoining, setJoining] = useState(false);
  const { user, accountBalance } = useAuth();

  const joinRoom = async (data: z.infer<typeof FormSchema>) => {
    let randomRoomName = "";
    const socket = socketService.socket;
    const result = FormSchema.safeParse(formData);
    console.log(errMsg);
    setJoining(true);
    setErrMsg("");
    if (!data.username || data.username.trim() === "" || !socket) return;
    if (result?.data?.stake && result?.data?.stake < 50) {
      setErrMsg("Stake must be at least 50 FCFA");
      setJoining(false);
    }
    if (result?.data?.stake && result?.data?.stake < 50) return;

    if (
      result?.data?.stake &&
      accountBalance &&
      result?.data?.stake > accountBalance
    ) {
      setErrMsg("Insufficient balance");
      setJoining(false);
      return;
    }

    if (result?.data?.stake && result?.data?.stake >= 50) {
      randomRoomName = "XAF0" + uuidv4().substring(0, 4).toUpperCase();
      setStake(result?.data?.stake);
    } else {
      randomRoomName = uuidv4().substring(0, 8).toUpperCase();
    }

    const joined = await gameService
      .createGameRoom(
        socket,
        randomRoomName,
        data.username,
        result?.data?.stake
      )
      .catch((err) => {
        setErrMsg(err);
        setJoining(false);
      });

    if (joined) {
      setPlayerName(data.username);
      setRoomName(randomRoomName);
    }
    setJoining(false);
  };
  const toggleStake = () => {
    setWithStake(!withStake);
    !user
      ? setErrMsg("Login to play with stake")
      : accountBalance && accountBalance < 50
      ? setErrMsg("Insufficient balance")
      : null;
  };

  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setPlayerName(JSON.parse(storedName));
    }
  }, []);

  return (
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
                    defaultValue={playerName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Checkbox
              id="terms"
              checked={
                withStake &&
                user != null &&
                user != undefined &&
                accountBalance != null &&
                accountBalance != undefined &&
                accountBalance > 50
              }
              onClick={() => {
                toggleStake();
                console.log(withStake);
              }}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Play with stake
            </label>
          </div>
          <FormField
            control={form.control}
            name="stake"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    id="stake"
                    type="number"
                    value={formData.stake}
                    onChange={handleChange}
                    placeholder="Place stake"
                    autoComplete="off"
                    disabled={
                      !withStake ||
                      (accountBalance && accountBalance < 50) ||
                      !user
                    }
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
        {errMsg && <ErrorMessage message={errMsg} />}
      </Form>
    </div>
  );
};

export default CreateRoom;
