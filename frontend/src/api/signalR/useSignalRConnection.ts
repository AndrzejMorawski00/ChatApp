import { useEffect } from "react";
import { startConnection, stopConnection } from "../../redux/signalR/signalRConnectionSlice";
import { AppDispatch, StoreState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";

const useSignalRConnection = () => {
    const dispatch = useDispatch<AppDispatch>();
    const connection = useSelector((state : StoreState) => state.signalRConnection.connection);

    useEffect(() => {
        dispatch(startConnection());

        return () => {
            dispatch(stopConnection());
        };
    }, [dispatch]);

    return connection;
};

export default useSignalRConnection;
