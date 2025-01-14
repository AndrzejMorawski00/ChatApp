import { useFriendsActions } from "../../api/friends/useFriendsActions";
import FriendList from "./FriendList";

interface Props {}

export const FRIEND_COLUMNS = {
    accepted: "Friends:",
    sent: "Sent:",
    received: "Incoming:",
} as const;

const FriendsContainer = ({}: Props) => {
    const { friendshipData, isLoadingFriends, isErrorFriends } = useFriendsActions();

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
                <p className="text-2xl font-montserrat text-mainButtonBackground animate-pulse mt-4">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex gap-2 w-full items-start justify-around">
            <FriendList
                listName={FRIEND_COLUMNS.received}
                friends={friendshipData.received.map((f) => ({ id: f.id, userData: f.senderData }))}
            />
            <FriendList
                listName={FRIEND_COLUMNS.sent}
                friends={friendshipData.sent.map((f) => ({ id: f.id, userData: f.receiverData }))}
            />

            <FriendList
                listName={FRIEND_COLUMNS.accepted}
                friends={friendshipData.accepted.map((f) =>
                    f.isSender ? { id: f.id, userData: f.receiverData } : { id: f.id, userData: f.senderData }
                )}
            />
        </div>
    );
};

export default FriendsContainer;
