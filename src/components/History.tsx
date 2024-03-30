import { Clock } from "lucide-react";

const History = () => {
  return (
    <button className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
      History <Clock className="h-4 w-4" />
    </button>
  );
};

export default History;
