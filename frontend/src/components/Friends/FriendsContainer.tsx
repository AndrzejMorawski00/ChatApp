import { useFriendsActions } from "../../api/friends/useFriendsActions";
import FriendList from "./FriendList";

interface Props {}

export const FRIEND_COLUMNS = {
    accepted: "Friends:",
    sent: "My Requests:",
    received: "Friendship Requests:",
} as const;

const FriendsContainer = ({}: Props) => {
    const { friendshipData, isLoadingFriends, isErrorFriends } = useFriendsActions();

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
                <p>Error...</p>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <div className="flex flex-col gap-2">
                <FriendList
                    listName={FRIEND_COLUMNS.received}
                    friends={friendshipData.received.map((f) => ({ id: f.id, userData: f.senderData }))}
                />
                <FriendList
                    listName={FRIEND_COLUMNS.sent}
                    friends={friendshipData.sent.map((f) => ({ id: f.id, userData: f.receiverData }))}
                />
            </div>
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
