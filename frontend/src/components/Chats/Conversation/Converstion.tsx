import { useParams } from "react-router";
import Message from "../../Messages/Message";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import NewMessageForm from "../NewMessageForm";
import useGetInfiniteMessages from "../../../api/useGetInfiniteMessages.ts/useGetInfiniteMessages";
import useAppContext from "../../../hooks/useAppContextHook";
import useSignalRAction from "../../../api/signalR/signalRActions";
import { SignalRContext } from "../../../providers/SignalRContextProvider";
import { JOIN_GROUP_ACTION, MESSAGE_RECEIVED } from "../../../constants/signalRActions";
import { ChatMessage } from "../../../types/messages";
import { ChatRouteParams } from "../../../types/Chats";

interface Props {}

const Converstation = ({}: Props) => {
    const params = useParams<ChatRouteParams>();
    const chatID = parseInt(params.chatID || "", 10);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const connection = SignalRContext;
    const { handleSignalRAction } = useSignalRAction();
    const { handleCurrActiveChatChange } = useAppContext();
    const { data, fetchNextPage, isFetchingNextPage, isFetchNextPageError, isLoading, isError, hasNextPage } =
        useGetInfiniteMessages(chatID);
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    useEffect(() => {
        handleCurrActiveChatChange(chatID);
        handleSignalRAction(JOIN_GROUP_ACTION, chatID);

        return () => {
            handleCurrActiveChatChange(null);
        };
    }, [location.pathname]);

    useEffect(() => {
        if (data) {
            const newMessages = data.pages.flatMap((page) => page.items);
            setMessages((prevMessages) => {
                const uniqueMessages = [
                    ...prevMessages,
                    ...newMessages.filter(
                        (newMessage) => !prevMessages.some((prevMessage) => prevMessage.id === newMessage.id)
                    ),
                ];
                return uniqueMessages;
            });
        }
    }, [data, ref]);

    connection.useSignalREffect(
        MESSAGE_RECEIVED,
        (newMessage: ChatMessage) => {
            setMessages((prevMessages) => [newMessage, ...prevMessages]);
        },
        []
    );



    if (isLoading) {
        return (
            <div className="flex items-center justify-center mt-4">
                <p className="text-2xl font-montserrat text-mainButtonBackground animate-pulse">Loading...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center mt-4">
                <p className="text-2xl text-red-600 font-montserrat animate-pulse">Error...</p>
            </div>
        );
    }

    const ulContent =
        messages.length > 0 ? (
            <ul className="overflow-y-auto max-h-[60vh] min-w-[400px] flex flex-col gap-2 px-4">
                {messages.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
                {isFetchNextPageError && <li className="text-2xl text-white">Something went wrong...</li>}
                <li ref={ref} className="loading">
                    {isFetchingNextPage ? "Loading..." : ""}
                </li>
            </ul>
        ) : (
            <ul className="overflow-y-auto max-h-[60vh] min-w-[400px] flex flex-col gap-2 px-4">
                <li className="text-xl text-center text-textColor">There aren't any messages</li>
            </ul>
        );

    return (
        <div className="flex flex-col w-full gap-4 px-10 pt-4 pl-4 border-l-2 border-l-white/30">
            <NewMessageForm chatID={chatID} />
            {ulContent}
        </div>
    );
};

export default Converstation;
