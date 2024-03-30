import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Crown } from "lucide-react";

const Rules = () => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
          Rules <Crown className="h-4 w-4" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <h4 className="text-sm font-semibold">Check Game Rules</h4>
        <br />
        <p className="text-sm">
          Select how many cards to be distributed to each user. A random card
          will be selected from the deck as the first card for the board. You
          can play a card with either the same number or suit as the card on the
          board. If your current hand cannot match the card on the board then
          select a card from the deck. Winner is the first player to play their
          last card.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Rules;
