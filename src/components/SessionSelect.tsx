import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props {
  setCreateRoom: React.Dispatch<React.SetStateAction<boolean>>;
  setJoinRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

const SessionSelect = ({ setCreateRoom, setJoinRoom }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex gap-10 flex-col bg-muted/40 p-10 rounded-md">
        <Button
          className="text-xl p-4"
          variant={"secondary"}
          onClick={() => setCreateRoom(true)}
        >
          {t("create_room")}
        </Button>
        <Button
          className="text-xl p-4"
          variant={"secondary"}
          onClick={() => setJoinRoom(true)}
        >
          {t("join_room")}
        </Button>
        <Button className="text-xl p-4">
          <Link to={"/multiplayer"}>{t("back")}</Link>{" "}
        </Button>
      </div>
    </>
  );
};

export default SessionSelect;
