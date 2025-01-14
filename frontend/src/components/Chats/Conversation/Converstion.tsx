import { useParams } from "react-router";
import Message from "../../Messages/Message";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import NewMessageForm from "../NewMessageForm";
import useGetInfiniteMessages from "../../../api/useGetInfiniteMessages.ts/useGetInfiniteMessages";
import useAppContext from "../../../hooks/useAppContextHook";
import useSignalRAction from "../../../api/signalR/signalRActions";
import { MessageType } from "../../../types/messages";
import { SignalRContext } from "../../../providers/SignalRContextProvider";

// Constants
const JOIN_GROUP_ACTION = "JoinGroup";
const MESSAGE_RECEIVED = "MessageSent";
interface Props {}

export type RouteParams = {
    chatID: string;
};

const Converstation = ({}: Props) => {
    const params = useParams<RouteParams>();
    const chatID = parseInt(params.chatID || "", 10);
    const [messages, setMessages] = useState<MessageType[]>([]);
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
        (newMessage: MessageType) => {
            setMessages((prevMessages) => [newMessage, ...prevMessages]);
        },
        []
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center mt-4">
                <p className="text-2xl font-montserrat text-mainButtonBackground animate-pulse">Loading...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center mt-4">
                <p className="text-2xl font-montserrat text-red-600 animate-pulse">Error...</p>
            </div>
        );
    }

    const ulContent =
        messages.length > 0 ? (
            <ul className="overflow-y-auto max-h-[60vh] min-w-[400px] flex flex-col gap-2">
                {messages.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
                {isFetchNextPageError && <li className="text-white text-2xl">Something went wrong...</li>}
                <li ref={ref} className="loading">
                    {isFetchingNextPage ? "Loading..." : ""}
                </li>
            </ul>
        ) : (
            <ul>
                <li className="text-center text-xl text-textColor">There aren't any messages</li>
            </ul>
        );

    return (
        <div className="flex w-full flex-col px-10 mt-4 gap-4">
            <NewMessageForm chatID={chatID} />
            {ulContent}
        </div>
    );
};

export default Converstation;
