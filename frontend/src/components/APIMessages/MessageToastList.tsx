import { useSelector } from "react-redux";
import MessageToast from "./MessageToast";
import { RootState } from "../../store/store";
import * as Toast from "@radix-ui/react-toast";

interface Props {}

const MessageToastList = ({}: Props) => {
    const { messages } = useSelector((state: RootState) => state.messages);
    return (
        <Toast.Provider swipeDirection="right">
            {messages.map((message) => (
                <MessageToast key={message.id} message={message} />
            ))}
            <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col gap-2 p-6 max-w-[300px]  z-[2147483647] outline-none" />
        </Toast.Provider>
    );
};

export default MessageToastList;
