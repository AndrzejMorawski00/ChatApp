import { useEffect } from "react";
import useGetRequest from "../useGetRequest/useGetRequest";
import useSignalRConnection from "./useSignalRConnection";
import { ChatObjectType } from "../../types/Chats";

const useChatActions = () => {
    const connection = useSignalRConnection();

    const { data, isLoading, isError, refetch : refetchChats} = useGetRequest<ChatObjectType[]>({
        queryKeys: ["userChats"],
        endpoint: "api/Chat",
        keepData: true,
    });

    useEffect(() => {
        if (connection) {
            const handleChatsRefetch = async () => {
                await refetchChats()
            }
            connection.on("AddedToChat", handleChatsRefetch)
            connection.on("FriendshipAccepted", handleChatsRefetch)
            connection.on("FriendshiCanceled", handleChatsRefetch)
        }
    }, [connection, refetchChats]);

    return {chats : data? data : [], isLoading, isError}
};

export default useChatActions