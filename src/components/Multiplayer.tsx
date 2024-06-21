import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

const Multiplayer = () => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-10 flex-col bg-muted/40 p-10 rounded-md">
      <Button className="text-xl m-0" variant={"secondary"}>
        <Link to={"multiplayer/jambo"}>Jambo</Link>
      </Button>
      <Button className="text-xl m-0" variant={"secondary"}>
        <Link to={"/multiplayer/vs-friend"}>{t("vsFriend")}</Link>
      </Button>
      <Button className="text-xl p-4" variant={"default"}>
        <Link to={"/"}>{t("back")}</Link>
      </Button>
    </div>
  );
};

export default Multiplayer;
