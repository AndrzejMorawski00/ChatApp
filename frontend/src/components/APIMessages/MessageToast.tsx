import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";
import { ApiStatusMessage } from "../../types/ApiMessages";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { getApiMessageBackgroundColor } from "../../utils/messages/getApiMessageBackgroundColor";

interface Props {
    message: ApiStatusMessage;
}

const MessageToast = ({ message }: Props) => {
    const [open, setOpen] = useState<boolean>(true);

    const handleOpenChange = (newOpen: boolean): void => {
        setOpen(newOpen);
    };

    const messageBackgroundColor = getApiMessageBackgroundColor(message.messageType);
    const iconColor =
        messageBackgroundColor === "bg-white" ? "text-alternateApiMessageIconColor" : "text-defaultApiMessageIconColor";

    return (
        <Toast.Root
            className={twMerge("items-center p-2 rounded-md shadow-lg animate-toast-slide-in", messageBackgroundColor)}
            open={open}
            onOpenChange={(newOpen: boolean) => handleOpenChange(newOpen)}
        >
            <div className="flex items-center justify-between gap-1 divide-x-[1px] divide-white/80">
                <Toast.Description className="ml-2 text-sm text-textColor">{message.message}</Toast.Description>
                <Toast.Action asChild className="" altText="Close">
                    <button className={twMerge("p-2 font-bold", iconColor)} onClick={() => handleOpenChange(false)}>
                        <FontAwesomeIcon icon={faX} className="duration-300 transform hover:scale-110" />
                    </button>
                </Toast.Action>
            </div>
        </Toast.Root>
    );
};

export default MessageToast;
