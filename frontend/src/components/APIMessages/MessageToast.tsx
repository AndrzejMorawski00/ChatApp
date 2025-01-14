import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";
import { MessageType } from "../../providers/AppContextProvider";

interface Props {
    message: MessageType;
}

const MessageToast = ({ message }: Props) => {
    const [open, setOpen] = useState<boolean>(true);

    const handleOpenChange = (newOpen: boolean): void => {
        setOpen(newOpen);
    };

    return (
        <Toast.Root
            className="bg-white rounded-md shadow-lg p-2 items-center animate-toast-slide-in"
            open={open}
            onOpenChange={(newOpen: boolean) => handleOpenChange(newOpen)}
        >
            <Toast.Title
                className={`${
                    message.messageType === "info" ? "text-blue-700" : "text-red-600"
                } "text-xl font-medium text-gray-900 mb-1  capitalize`}
            >
                {message.messageType}
            </Toast.Title>
            <Toast.Description className="text-gray-700 text-sm ml-2">{message.message}</Toast.Description>
            <Toast.Action asChild className="" altText="Close">
                <button
                    className="text-red-500 hover:text-red-700 font-bold transform duration-300 hover:scale-105"
                    onClick={() => handleOpenChange(false)}
                >
                    Close
                </button>
            </Toast.Action>
        </Toast.Root>
    );
};

export default MessageToast;
