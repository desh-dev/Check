import { Button } from "./ui/button";
import { Suits } from "./practice/Game";

interface Props {
  updateSuit: (newSuit: Suits) => void;
}

const SuitSelector = ({ updateSuit }: Props) => {
  const handleSuitSelection = (newSuit: Suits) => {
    updateSuit(newSuit);
  };

  return (
    <div className="flex gap-1 flex-col bg-muted/40  rounded-md">
      <Button
        className="p-1 rounded-none p-0 text-xm h-6"
        variant={"ghost"}
        onClick={() => handleSuitSelection("diamonds")}
      >
        Diamonds
      </Button>
      <Button
        className="p-2 rounded-none p-0 text-xm h-6"
        variant={"ghost"}
        onClick={() => handleSuitSelection("hearts")}
      >
        Hearts
      </Button>
      <Button
        className="p-2 rounded-none p-0 text-xm h-6"
        variant={"ghost"}
        onClick={() => handleSuitSelection("spades")}
      >
        Spades
      </Button>

      <Button
        className="p-2 rounded-none p-0 text-xm h-6"
        variant={"ghost"}
        onClick={() => handleSuitSelection("clubs")}
      >
        Clubs
      </Button>
    </div>
  );
};

export default SuitSelector;
