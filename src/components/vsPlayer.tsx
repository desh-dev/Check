import { useContext } from "react";
import SelectCardNumber from "./selectCardNumber";
import Game from "./practice/Game";
import gameContext from "@/gameContext";

export type CardNumber = number | null;

interface Props {
  children?: React.ReactNode;
}

const vsPlayer = ({ children }: Props) => {
  const { cardNumber, setCardNumber } = useContext(gameContext);
  const handleSubmit = (data: any) => {
    setCardNumber(data.type);
  };

  return (
    <>
      {!cardNumber && (
        <div className="bg-muted/40 p-10 rounded-md justify-between">
          <SelectCardNumber onSubmit={handleSubmit} children={children} />
        </div>
      )}
      {cardNumber && <Game cardNumber={cardNumber} />}
    </>
  );
};

export default vsPlayer;
