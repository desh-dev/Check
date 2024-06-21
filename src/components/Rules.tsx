import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Crown } from "lucide-react";
import { useTranslation } from "react-i18next";

const Rules = () => {
  const { t } = useTranslation();
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="mx-[-0.65rem] flex items-center gap-4 px-3 py-2 text-muted-foreground hover:text-foreground">
          {t("rules")} <Crown className="h-4 w-4" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <h4 className="text-sm font-semibold">{t("check_rules")}</h4>
        <br />
        <p className="text-sm">{t("rules_description")}</p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Rules;
