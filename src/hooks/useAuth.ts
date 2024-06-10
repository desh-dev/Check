import gameContext from "@/gameContext";
import { useContext, useDebugValue } from "react";


const useAuth = () => {
    const { auth } = useContext(gameContext);
    useDebugValue(auth, auth => auth?.email ? "Logged In" : "Logged Out")
    return useContext(gameContext);
}

export default useAuth;