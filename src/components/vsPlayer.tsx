import { useState } from "react";
import SelectCardNumber from "./selectCardNumber";
import BoardCard from "./BoardCard";
export type CardNumber = number | null;

const vsPlayer = () => {
  const [cardNumber, setCardNumber] = useState<CardNumber>(null);
  const handleSubmit = (data: any) => {
    setCardNumber(data.type);
    console.log(cardNumber);
  };

  return (
    <>
      {!cardNumber && (
        <div className="bg-muted/40 p-10 rounded-md">
          <SelectCardNumber onSubmit={handleSubmit} />
        </div>
      )}
      <BoardCard />
    </>
  );
};

export default vsPlayer;
