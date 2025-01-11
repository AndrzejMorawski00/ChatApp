import { useLocation, useParams } from "react-router";
import Message from "../Messages/Message";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import NewMessageForm from "./NewMessageForm";
import useGetInfiniteMessages from "../../api/useGetInfiniteMessages.ts/useGetInfiniteMessages";
import useAppContext from "../../hooks/useAppContextHook";
import useSignalRAction from "../../api/signalR/signalRActions";
import { MessageType } from "../../types/messages";

// Constants
const JOIN_GROUP_ACTION = "JoinGroup";

interface Props {}

export type RouteParams = {
    chatID: string;
};

const ChatDetails = ({}: Props) => {
    const params = useParams<RouteParams>();
    const location = useLocation();
    const chatID = parseInt(params.chatID || "", 10);
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

    if (isLoading) {
        <div>
            <p>Loading...</p>
        </div>;
    }

    if (isError) {
        <div>
            <p>Error...</p>
        </div>;
    }

    const messages: MessageType[] = data?.pages.flatMap((page) => page.items) || [];

    const ulContent =
        messages.length > 0 ? (
            <ul>
                {isFetchingNextPage && <li className="text-white text-2xl">Loading...</li>}
                {isFetchNextPageError && <li className="text-white text-2xl">Something went wrong...</li>}
                {messages.map((message) => (
                    <Message key={message.id} message={message} fetchNextRef={ref} />
                ))}
            </ul>
        ) : (
            <ul>
                <li>There aren't any messages</li>
            </ul>
        );

    return (
        <div>
            {ulContent}
            <NewMessageForm chatID={chatID} />
        </div>
    );
};

export default ChatDetails;
