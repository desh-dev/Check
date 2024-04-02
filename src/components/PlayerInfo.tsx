import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "../api/axios";
import { useState } from "react";

interface Props {
  onSelectCardNumber: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PlayerInfo: React.FC<Props> = ({ onSelectCardNumber }) => {
  const [player1, setPlayer1] = useState("player1");
  const [player2, setPlayer2] = useState("player2");
  const [err, setErrMsg] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      console.log(player1, player2);
      const response = await axios.post(
        "/games",
        JSON.stringify({ player1, player2 }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">Start Game</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Check Game</DialogTitle>
          <DialogDescription>
            Enter player names and number of cards for each player
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="player1" className="text-right">
              Player1
            </Label>
            <Input
              required
              type="string"
              id="player1"
              className="col-span-3"
              autoComplete="off"
              onChange={(e) => setPlayer1(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="player2" className="text-right">
              Player2
            </Label>
            <Input
              required
              type="text"
              id="player2"
              className="col-span-3"
              autoComplete="off"
              onChange={(e) => setPlayer2(e.target.value)}
            />

            <label className="font-medium leading-snug" htmlFor="selection">
              Number of cards
            </label>
            <select
              name="selection"
              id="selection"
              onChange={onSelectCardNumber}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>
        </div>
        <DialogFooter className="justify-center items-center">
          <Button type="submit" onClick={handleSubmit}>
            Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerInfo;
