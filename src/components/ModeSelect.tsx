import { useTranslation } from "react-i18next";
import Dashboard from "./Dashboard";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const ModeSelect = () => {
  const { t } = useTranslation();
  return (
    <Dashboard>
      <div className="flex gap-10 flex-col bg-muted/40 p-10 rounded-md">
        <Button className="text-xl p-4" variant="secondary">
          <Link to="multiplayer">{t("multiplayer")}</Link>
        </Button>
        <Button className="text-xl p-4" variant="secondary">
          <Link to="vs-ai">{t("vsAI")}</Link>
        </Button>
        <Button className="text-xl p-4" variant="secondary">
          <Link to="practice">{t("practice")}</Link>
        </Button>
      </div>
    </Dashboard>
  );
};

export default ModeSelect;
