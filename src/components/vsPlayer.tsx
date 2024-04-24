import { useState } from "react";
import SelectCardNumber from "./selectCardNumber";
import Game from "./Game";

export type CardNumber = number | null;

interface Props {
  children?: React.ReactNode;
}

const vsPlayer = ({ children }: Props) => {
  const [cardNumber, setCardNumber] = useState<CardNumber>(null);
  const handleSubmit = (data: any) => {
    setCardNumber(data.type);
    console.log(cardNumber);
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
