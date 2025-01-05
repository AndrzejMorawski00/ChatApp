import { useContext } from "react";
import { AppContext, AppContextType } from "../providers/AppContextProvider";

 const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);

    if (context === undefined) {
        throw new Error("App Context is undefined");
    }

    return context;
};



export default useAppContext