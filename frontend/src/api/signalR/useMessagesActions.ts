import useGetInfiniteObjects from "../useGetInfiniteQuery/useGetInfiniteQuery";
import useSignalRConnection from "./useSignalRConnection";
import { fetchMessages } from "../../utils/api/fetchMessages";
import { useEffect } from "react";
import { GetMessageType, MessageType } from "../../types/messages";

const useMessagesActions = (chatID: number) => {
    const connection = useSignalRConnection();

    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
        isLoading,
        isError,
        hasNextPage,
        refetch: refetchMessages,
    } = useGetInfiniteObjects<MessageType, GetMessageType>(["messages", chatID.toString()], fetchMessages, {
        chatID: chatID,
        pageNumber: 1,

    });

    useEffect(() => {
        if (connection) {
            const handleMessagesRefetch = async () => {
                await refetchMessages();
            };

            connection.on("MessageSent", handleMessagesRefetch)
        }

    }, [connection, refetchMessages]);

    const messages = data?.items ? data.items : [];

    return {
        messages: messages,
        fetchNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
        isLoading,
        isError,
        hasNextPage,
        refetchMessages,
    };
};

export default useMessagesActions;
