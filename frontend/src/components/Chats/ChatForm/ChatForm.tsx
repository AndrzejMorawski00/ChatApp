import { useEffect, useState } from "react";
import { ChatData } from "../../../types/Chats";
import { UserData } from "../../../types/Users";
import ChatParticipantList from "./ChatParticipantList";
import useSignalRAction from "../../../api/signalR/signalRActions";
import { useGetFriendshipsQuery } from "../../../store/api/apiSlice";
import { isValidChatForm } from "../../../utils/chatForm/isValidChatForm";
import { CREATE_NEW_CHAT_ACTION, EDIT_CHAT_ACTION } from "../../../constants/signalRActions";

interface Props {
    handleOpenChange: (newValue: boolean) => void;
    currentChat?: ChatData;
}

const ChatForm = ({ handleOpenChange, currentChat }: Props) => {
    const [chatName, setChatName] = useState<string>("");
    const [searchFilter, setSearch] = useState<string>("");
    const [participants, setParticipants] = useState<number[]>([]);
    const { data: friendshipData, error: isErrorFriends, isLoading: isLoadingFriends } = useGetFriendshipsQuery();
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
            <div className="flex items-center justify-center w-full h-full pt-4 pl-4 border-l-2 border-l-white/30">
                <p className="mt-4 text-2xl font-montserrat text-mainButtonBackground animate-pulse">Loading...</p>
            </div>
        );
    }

    if (isErrorFriends || !friendshipData) {
        return (
            <div className="flex items-center justify-center w-full h-full pt-4 pl-4 border-l-2 border-l-white/30">
                <p className="mt-4 text-2xl text-red-600 font-montserrat animate-pulse">Error...</p>
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
                    <label htmlFor="chatName" className="text-xl tracking-wider text-textColor">
                        Chat Name:
                    </label>
                    <input
                        type="text"
                        className="px-3 py-2 text-xl tracking-wider border-b-2 outline-none bg-formInputBackgroundColor text-formInputTextColor"
                        name="chatName"
                        id="chatName"
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="filter" className="text-xl tracking-wider text-textColor">
                        Filter:
                    </label>
                    <input
                        type="text"
                        className="px-3 py-2 text-xl tracking-wider border-b-2 outline-none bg-formInputBackgroundColor text-formInputTextColor"
                        name="filter"
                        id="filter"
                        value={searchFilter}
                        onChange={(e) => handleSearchFilterChange(e.target.value)}
                    />
                    <ChatParticipantList
                        friends={acceptedFriends}
                        participants={participants}
                        handleParticipantsChange={handleParticipantsChange}
                    />
                </div>
            </div>
            <div className="flex justify-center gap-10">
                <input
                    className="px-3 py-1 mt-3 text-4xl duration-300 transform border-2 rounded-md font-montserrat text-textColor bg-mainButtonBackground hover:scale-105"
                    type="submit"
                    value={currentChat ? "Save Changes" : "Create new chat"}
                />
                <button
                    className="px-3 py-1 mt-3 text-4xl duration-300 transform border-2 rounded-md font-montserrat text-textColor bg-mainButtonBackground hover:scale-105"
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
