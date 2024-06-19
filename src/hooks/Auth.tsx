import { Session, User } from "@supabase/supabase-js";
import { useContext, useState, useEffect, createContext } from "react";
import supabase from "@/config/supabaseClient";
import { SpinnerDotted } from "spinners-react";
import Dashboard from "@/components/Dashboard";
import preloadAssets from "@/services/assetLoader";

// create a context for authentication
const AuthContext = createContext<{
  session: Session | null | undefined;
  user: User | null | undefined;
  accountBalance: number | null | undefined;
  setAccountBalance: (accountBalance: number | null) => void;
  signOut: () => void;
}>({
  session: null,
  user: null,
  accountBalance: null,
  setAccountBalance: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const [session, setSession] = useState<Session | null>();
  const [accountBalance, setAccountBalance] = useState<number | null>(null);

  useEffect(() => {
    const setData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(data.user);

      let { data: profiles, error: fetchError } = await supabase
        .from("profiles")
        .select("account_balance")
        .eq("id", data.user?.id);
      if (fetchError) throw fetchError;

      setAccountBalance(profiles?.[0].account_balance);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user);

        if (event === "SIGNED_IN") {
          setTimeout(async () => {
            // await on other Supabase function here
            let { data: profiles, error: fetchError } = await supabase
              .from("profiles")
              .select("account_balance")
              .eq("id", session?.user.id);
            if (fetchError) throw fetchError;

            setAccountBalance(profiles?.[0].account_balance);
            // this runs right after the callback has finished
          }, 0);
        }
        if (event === "SIGNED_OUT") {
          setAccountBalance(null);
        }
      }
    );

    setData();
    preloadAssets().finally(() => {
      setIsLoading(false);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    accountBalance,
    setAccountBalance,
    signOut: () => supabase.auth.signOut(),
  };

  // use a provider to pass down the value
  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <Dashboard>
          <div className="dialog fixed top-0 left-0 w-full h-full overflow-auto bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center">
            <SpinnerDotted />
          </div>
        </Dashboard>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};
