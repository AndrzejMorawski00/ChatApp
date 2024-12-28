// import { SimpleMessage} from "../../types/messages";
// import useGetInfiniteObjects from "../useGetInfiniteQuery/useGetInfiniteQuery";
// import { useEffect } from "react";
// import { fetchSimpleMessages } from "../../utils/api/fetchMessages";
// import useSignalRConnection from "./useSignalRConnection";


// export const useMessages = () => {
//     const connection = useSignalRConnection();

//     const {
//         data,
//         fetchNextPage,
//         hasNextPage,
//         isFetchingNextPage,
//         isLoading,
//         isError,
//         refetch: refetchMessages,
//     } = useGetInfiniteObjects<SimpleMessage>(["messages"], fetchSimpleMessages);

//     useEffect(() => {
//         if (connection) {
//             const handleReceiveMessage = (newMessage: SimpleMessage) => {
//                 console.log("Real-time message received:", newMessage);
//                 refetchMessages();
//             };

//             connection.on("ReceiveMessage", handleReceiveMessage);

//             return () => {
//                 connection.off("ReceiveMessage", handleReceiveMessage);
//             };
//         }
//     }, [connection, refetchMessages]);

//     return {
//         data,
//         fetchNextPage,
//         hasNextPage,
//         isFetchingNextPage,
//         isLoading,
//         isError,
//     };
// };
