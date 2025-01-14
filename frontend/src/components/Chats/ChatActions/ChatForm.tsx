import { useEffect, useState } from "react";
import { useFriendsActions } from "../../../api/friends/useFriendsActions";
import { UserData } from "../../../types/Users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { isValidChatForm } from "../../../utils/chatForm/isValidChatForm";
import useSignalRAction from "../../../api/signalR/signalRActions";
import { ChatObjectType } from "../../../types/Chats";

const CREATE_NEW_CHAT_ACTION = "CreateNewChat";
const EDIT_CHAT_ACTION = "EditChat";
interface Props {
    handleOpenChange: (newValue: boolean) => void;
    currentChat?: ChatObjectType;
}

const ChatForm = ({ handleOpenChange, currentChat }: Props) => {
    const [chatName, setChatName] = useState<string>("");
    const [searchFilter, setSearch] = useState<string>("");
    const [participants, setParticipants] = useState<number[]>([]);
    const { friendshipData, isLoadingFriends, isErrorFriends } = useFriendsActions();
    const { handleSignalRAction } = useSignalRAction();

    const handleParticipantsChange = (action: "add" | "remove", userID: number): void => {
        switch (action) {
            case "add":
                setParticipants((prevParticipants) => [...prevParticipants, userID]);
                return;
            case "remove":
                setParticipants((prevParticipants) => prevParticipants.filter((p) => p != userID));
                return;
            default:
                return;
        }
    };

    const handleSearchFilterChange = (newValue: string): void => {
        setSearch(newValue);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (isValidChatForm(chatName, participants) && !currentChat) {
            handleSignalRAction(CREATE_NEW_CHAT_ACTION, { chatName: chatName, ParticipantsID: participants });
        } else if (isValidChatForm(chatName, participants) && currentChat) {
            handleSignalRAction(EDIT_CHAT_ACTION, {
                chatID: currentChat.id,
                chatName: chatName,
                ParticipantsID: participants,
            });
        }
        handleOpenChange(false);
    };

    useEffect(() => {
        const participants = currentChat ? currentChat.chatParticipants : [];
        setChatName(currentChat ? currentChat.chatName : ""), setParticipants(participants.map((p) => p.id));
    }, [currentChat]);

    if (isLoadingFriends) {
        return (
            <div className="w-full h-full flex items-center justify-center border-l-2 border-l-white/30 pl-4 pt-4">
                <p className="text-2xl font-montserrat text-mainButtonBackground animate-pulse mt-4">Loading...</p>
            </div>
        );
    }

    if (isErrorFriends) {
        return (
            <div className="w-full h-full flex items-center justify-center border-l-2 border-l-white/30 pl-4 pt-4">
                <p className="text-2xl font-montserrat text-red-600  animate-pulse mt-4">Error...</p>
            </div>
        );
    }

    const acceptedFriends: UserData[] = friendshipData.accepted
        .map((f) => (f.isSender ? f.receiverData : f.senderData))
        .filter((f) => searchFilter === "" || f.firstName.includes(searchFilter) || f.lastName.includes(searchFilter));

    return (
        <form
            action=""
            onSubmit={(e) => {
                handleFormSubmit(e);
            }}
            className="flex flex-col items-center justify-start gap-4 min-h-[70vh]"
        >
            <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="chatName" className="text-xl text-textColor tracking-wider">
                        Chat Name:
                    </label>
                    <input
                        type="text"
                        className="px-3 py-2 text-xl outline-none border-b-2 bg-formInputBackgroundColor text-formInputTextColor tracking-wider"
                        name="chatName"
                        id="chatName"
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="filter" className="text-xl text-textColor tracking-wider">
                        Filter:
                    </label>
                    <input
                        type="text"
                        className="px-3 py-2 text-xl outline-none border-b-2 bg-formInputBackgroundColor text-formInputTextColor tracking-wider"
                        name="filter"
                        id="filter"
                        value={searchFilter}
                        onChange={(e) => handleSearchFilterChange(e.target.value)}
                    />
                    <ul className="overflow-y-auto flex flex-col gap-2 min-h-[30vh]">
                        {acceptedFriends.map((f) => (
                            <li key={f.id} className="flex gap-2 justify-between">
                                <div className="flex gap-2">
                                    <p className="text-xl text-textColor">{f.firstName}</p>
                                    <p className="text-xl text-textColor">{f.lastName}</p>
                                </div>
                                <div>
                                    {participants.includes(f.id) ? (
                                        <button
                                            type="button"
                                            onClick={() => handleParticipantsChange("remove", f.id)}
                                            className="text-2xl text-iconColor hover:text-iconColorHover transform transition duration-300 hover:scale-105"
                                        >
                                            <FontAwesomeIcon icon={faX} />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleParticipantsChange("add", f.id)}
                                            className="text-2xl text-iconColor hover:text-iconColorHover transform transition duration-300 hover:scale-105"
                                        >
                                            <FontAwesomeIcon icon={faCheck} />
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="flex justify-center gap-10">
                <input
                    className="font-montserrat text-textColor bg-mainButtonBackground text-4xl px-3 mt-3 py-1 border-2 rounded-md transform duration-300 hover:scale-105"
                    type="submit"
                    value={currentChat ? "Save Changes" : "Create new chat"}
                />
                <button
                    className="font-montserrat text-textColor bg-mainButtonBackground text-4xl px-3 mt-3 py-1 border-2 rounded-md transform duration-300 hover:scale-105"
                    type="button"
                    onClick={() => handleOpenChange(false)}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ChatForm;
