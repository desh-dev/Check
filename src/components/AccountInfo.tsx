import { useAuth } from "@/hooks/Auth";
const AccountInfo = () => {
  const { accountBalance } = useAuth();
  return (
    <div>
      {/* <h2 className="font-bold text-2xl mb-2">
        {user?.user_metadata.first_name + " " + user?.user_metadata.last_name}
      </h2> */}
      <h2 className="font-bold text-lg mb-2">{accountBalance} FCFA</h2>
    </div>
  );
};

export default AccountInfo;
