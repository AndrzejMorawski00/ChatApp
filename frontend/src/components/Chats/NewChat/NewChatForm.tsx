import { useState } from "react";
import { useFriendsActions } from "../../../api/friends/useFriendsActions";
import { UserData } from "../../../types/Users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { isValidChatForm } from "../../../utils/chatForm/isValidChatForm";
import useNewChatMutation from "../../../api/chats/useNewChatMutation";

const MAX_DISPLAY_FRIENDS = 5;

interface Props {
    handleOpenChange: (newValue: boolean) => void;
}

const NewChatForm = ({ handleOpenChange }: Props) => {
    const [chatName, setChatName] = useState<string>("");
    const [searchFilter, setSearch] = useState<string>("");
    const [participants, setParticipants] = useState<number[]>([]);
    const { friendshipData, isLoadingFriends, isErrorFriends } = useFriendsActions();
    const newChatMutation = useNewChatMutation();

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
        if (isValidChatForm(chatName, participants)) {
            await newChatMutation.mutateAsync({ chatName: chatName, participantsID: participants });
        }
        handleOpenChange(false);
    };

    let acceptedFriends: UserData[] = friendshipData.accepted
        .map((f) => (f.isSender ? f.receiverData : f.senderData))
        .filter((f) => searchFilter === "" || f.firstName.includes(searchFilter) || f.lastName.includes(searchFilter));

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
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <form
            action=""
            onSubmit={(e) => {
                handleFormSubmit(e);
            }}
            className="flex gap-2"
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
                <ul>
                    {acceptedFriends.slice(0, MAX_DISPLAY_FRIENDS).map((f) => (
                        <li key={f.id} className="flex gap-2">
                            <div className="flex gap-2">
                                <p>{f.firstName}</p> <p>{f.lastName}</p>
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
            <input type="submit" value="Create new chat" />
            <button type="button" onClick={() => handleOpenChange(false)}>
                Cancel
            </button>
        </form>
    );
};

export default NewChatForm;
