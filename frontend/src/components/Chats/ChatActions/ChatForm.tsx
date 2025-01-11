import { useEffect, useState } from "react";
import { useFriendsActions } from "../../../api/friends/useFriendsActions";
import { UserData } from "../../../types/Users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { isValidChatForm } from "../../../utils/chatForm/isValidChatForm";
import useSignalRAction from "../../../api/signalR/signalRActions";
import { ChatObjectType } from "../../../types/Chats";

const MAX_DISPLAY_FRIENDS = 5;
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
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (isErrorFriends) {
        return (
            <div>
                <p>Error..</p>
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
            className="flex gap-2 h-[50vh]"
        >
            <div>
                <label htmlFor="chatName">Chat Name:</label>
                <input
                    type="text"
                    name="chatName"
                    id="chatName"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    name=""
                    id=""
                    value={searchFilter}
                    onChange={(e) => handleSearchFilterChange(e.target.value)}
                />
                <ul className="h-fit max-h-20 overflow-y-scroll">
                    {acceptedFriends.slice(0, MAX_DISPLAY_FRIENDS).map((f) => (
                        <li key={f.id} className="flex gap-2">
                            <div className="flex gap-2">
                                <p className="text-3xl">{f.firstName} {f.lastName}</p>
                            </div>
                            <div>
                                {participants.includes(f.id) ? (
                                    <button type="button" onClick={() => handleParticipantsChange("remove", f.id)}>
                                        <FontAwesomeIcon icon={faX} />
                                    </button>
                                ) : (
                                    <button type="button" onClick={() => handleParticipantsChange("add", f.id)}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <input type="submit" value={currentChat ? "Save Changes" : "Create new chat"} />
            <button type="button" onClick={() => handleOpenChange(false)}>
                Cancel
            </button>
        </form>
    );
};

export default ChatForm;
