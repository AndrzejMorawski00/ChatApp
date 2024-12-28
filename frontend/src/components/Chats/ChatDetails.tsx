import { useParams } from "react-router";
import useMessagesActions from "../../api/signalR/useMessagesActions";
import Message from "../Messages/Message";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import NewMessageForm from "./NewMessageForm";
interface Props {}

type RouteParams = {
    chatID: string;
};

const ChatDetails = ({}: Props) => {
    const params = useParams<RouteParams>();

    const chatID = parseInt(params.chatID || "", 10);
    console.log(chatID);
    const { messages, fetchNextPage, isFetchingNextPage, isFetchNextPageError, isLoading, isError, hasNextPage } =
        useMessagesActions(chatID);

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

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
            <NewMessageForm chatID={chatID}/>
        </div>
    );
};

export default ChatDetails;
