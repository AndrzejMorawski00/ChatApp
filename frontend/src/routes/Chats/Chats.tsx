import { Outlet } from "react-router";
import ChatContainer from "../../components/Chats/ChatContainer";

const Chats = () => {
    // const [userName, setUserName] = useState<string>("User");
    // const [message, setMessage] = useState<string>("");
    // const { data, sendMessage, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useMessages();

    // const messages = data?.pages.flatMap((page) => page.items) || [];

    // const handleSendMessage = async () => {
    //     if (message.trim()) {
    //         const newMessage: NewMessage = {
    //             userName,
    //             content: message,
    //             cid: 1,
    //         };
    //         await sendMessage(newMessage);
    //         setMessage("");
    //     }
    // };
    {/* <h2>Chat App</h2>
            <div>
                <p>Current Username: {userName}</p>
                <button onClick={() => setUserName("Thing")}>Thing</button>
                <button onClick={() => setUserName("Funny")}>Funny</button>
            </div>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message"
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : isError ? (
                <p>Error</p>
            ) : (
                <ul>
                    {isFetchingNextPage && <p>Loading data...</p>}
                    {hasNextPage && <button onClick={() => fetchNextPage()}>Fetch prev Messages</button>}
                    {messages.map((msg, idx) => (
                        <li key={idx}>
                            {idx + 1}. {msg.userName}: {msg.content}
                        </li>
                    ))}
                </ul>
            )} */}

    return (
        <div className="flex gap-1">
            <div className="w-25">
            <Outlet />
            </div>
            <ChatContainer />
            
        </div>
    );
};

export default Chats;
