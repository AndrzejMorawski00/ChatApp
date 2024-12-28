import { useState } from "react";
import { useFriendActions } from "../../../api/signalR/useFriendActions";

interface Props {}

const NewChatForm = ({}: Props) => {
    const [chatName, setChatName] = useState<string>("");
    const [participants, setParticipants] = useState<Number[]>([]);
    const { friendsData, isLoadingFriends, isErrorFriends } = useFriendActions();

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

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
    }

    return (
        <form action="" onSubmit={(e) => {handleFormSubmit(e)}}>
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
            <ul>
                {friendsData.accepted.map((friend) => (
                    <li>
                        <div>
                            <p>{friend.friendData.firstName}</p> <p>{friend.friendData.lastName}</p>
                        </div>
                        <div>
                            {participants.includes(friend.friendData.Id) ? (
                                <button onClick={() => handleParticipantsChange("remove", friend.friendData.Id)}>
                                    Remove
                                </button>
                            ) : (
                                <button onClick={() => handleParticipantsChange("add", friend.friendData.Id)}>
                                    Add
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </form>
    );
};

export default NewChatForm;
