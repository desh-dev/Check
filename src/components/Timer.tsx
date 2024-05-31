import { useEffect } from "react";

interface ITimerProps {
  timeLimit: number;
  playerTurn: boolean;
  suitSelector: boolean;
  remainingTime: number;
  setRemainingTime: React.Dispatch<React.SetStateAction<number>>;
  handleTimeOut: () => void;
}

const Timer = ({
  timeLimit,
  playerTurn,
  suitSelector,
  remainingTime,
  setRemainingTime,
  handleTimeOut,
}: ITimerProps) => {
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;
    if (!playerTurn && !suitSelector) {
      setRemainingTime(timeLimit);
      return;
    }

    intervalId = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000); // Update remaining time every second

    if (playerTurn) {
      timeoutId = setTimeout(() => {
        handleTimeOut();
      }, timeLimit * 1000);
    }
    return () => {
      clearInterval(intervalId);
      clearInterval(timeoutId);
      setRemainingTime(timeLimit);
    };
  }, [playerTurn, suitSelector]);

  return (
    <div className="w-8 border flex justify-center border-gray-500 bg-gray-500 p-1 rounded-full">
      <p className="flex justify-center w-full text-white">{remainingTime}</p>
    </div>
  );
};

export default Timer;
