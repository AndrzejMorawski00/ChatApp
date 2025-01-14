import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserData } from "../../../types/Users";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";

interface Props {
    friends: UserData[];
    participants: number[];
    handleParticipantsChange: (action: "remove" | "add", userID: number) => void;
}

const ChatParticipantList = ({ friends, participants, handleParticipantsChange }: Props) => {
    return (
        <ul className="overflow-y-auto flex flex-col gap-2 min-h-[30vh]">
            {friends.map((f) => (
                <li key={f.id} className="flex justify-between gap-2">
                    <div className="flex gap-2">
                        <p className="text-xl text-textColor">{f.firstName}</p>
                        <p className="text-xl text-textColor">{f.lastName}</p>
                    </div>
                    <div>
                        {participants.includes(f.id) ? (
                            <button
                                type="button"
                                onClick={() => handleParticipantsChange("remove", f.id)}
                                className="text-2xl transition duration-300 transform text-iconColor hover:text-iconColorHover hover:scale-105"
                            >
                                <FontAwesomeIcon icon={faX} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => handleParticipantsChange("add", f.id)}
                                className="text-2xl transition duration-300 transform text-iconColor hover:text-iconColorHover hover:scale-105"
                            >
                                <FontAwesomeIcon icon={faCheck} />
                            </button>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ChatParticipantList;
