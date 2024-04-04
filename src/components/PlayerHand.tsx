import React, { useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface PlayerHandProps {
  cardNumber: number; // Number of cards the player has selected
  maxCards: number; // Maximum number of cards allowed
}

const PlayerHand: React.FC<PlayerHandProps> = ({ cardNumber, maxCards }) => {
  const [isPopulated, setIsPopulated] = useState(false); // Flag for populated state

  const handlePopulate = () => {
    // Simulate card selection process (replace with actual card data fetching)
    setIsPopulated(true);
  };

  return (
    <div className="player-hand">
      {!isPopulated && (
        <div className="skeleton flex flex-1 gap-1 border border-dashed rounded-lg p-4 shadow-lg">
          {/* Render skeleton elements for unpopulated cards */}
          {Array.from({ length: maxCards }, (_, index) => (
            <Card key={index} />
          ))}
          <button
            onClick={handlePopulate}
            disabled={cardNumber >= maxCards}
          ></button>
        </div>
      )}
      {isPopulated && (
        <div className="cards flex flex-1 gap-1 border border-dashed rounded-lg p-4 shadow-lg">
          {/* Render actual card components based on selectedCards */}
          {Array.from({ length: cardNumber }, (_, index) => (
            <Card key={index} /> // Replace with your Card component
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerHand;

// Example Card component (replace with your actual card implementation)
const Card: React.FC = () => {
  return (
    <div className="flex">
      <Skeleton className="h-[40px] w-[35px]" />
    </div>
  );
};
