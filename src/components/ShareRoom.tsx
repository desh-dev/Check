import { Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

interface Props {
  roomName: string;
}
const ShareRoom = ({ roomName }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleCopy = () => {
    navigator.clipboard.writeText(roomName);
  };
  return (
    <div className="flex flex-col gap-5 justify center bg-muted/40 p-10 rounded-md">
      <h1 className="text-2xl font-bold">{t("share_room")}</h1>
      <div className="flex gap-2">
        <p className="flex justify-center w-full text-l p-1 font-semibold border-2 border-black rounded">
          {roomName}
        </p>
        <Copy
          className="h-8 w-8 bg-white p-1 rounded cursor-pointer hover:bg-gray-300"
          onClick={handleCopy}
        />
      </div>
      <Button
        variant="destructive"
        onClick={() => {
          navigate("/multiplayer");
        }}
      >
        {t("close_room")}
      </Button>
    </div>
  );
};

export default ShareRoom;
