import { Message, NewMessage } from "../../types/messages";
import useGetInfiniteObjects from "../useGetInfiniteQuery/useGetInfiniteQuery";
import { useEffect } from "react";
import { fetchMessages } from "../../utils/api/fetchMessages";
import useSignalRConnection from "./useSignalRConnection";


export const useMessages = () => {
    const connection = useSignalRConnection();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch: refetchMessages,
    } = useGetInfiniteObjects<Message>(["messages"], fetchMessages);

    useEffect(() => {
        if (connection) {
            const handleReceiveMessage = (newMessage: Message) => {
                console.log("Real-time message received:", newMessage);
                refetchMessages();
            };

            connection.on("ReceiveMessage", handleReceiveMessage);

            return () => {
                connection.off("ReceiveMessage", handleReceiveMessage);
            };
        }
    }, [connection, refetchMessages]);

    const sendMessage = async (newMessage: NewMessage) => {
        if (connection) {
            try {
                await connection.invoke("SendMessage", newMessage);
                console.log("Message sent:", newMessage);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    return {
        data,
        sendMessage,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    };
};
