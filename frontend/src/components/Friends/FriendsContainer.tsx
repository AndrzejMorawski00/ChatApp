import { useFriendsActions } from "../../api/friends/useFriendsActions";
import { FRIEND_COLUMNS } from "../../constants/Friends";
import FriendList from "./FriendList";

interface Props {}

const FriendsContainer = ({}: Props) => {
    const { friendshipData, isLoadingFriends, isErrorFriends } = useFriendsActions();

    if (isLoadingFriends) {
        return (
            <div className="flex items-center justify-center w-full h-full pt-4 pl-4 border-l-2 border-l-white/30">
                <p className="mt-4 text-2xl font-montserrat text-mainButtonBackground animate-pulse">Loading...</p>
            </div>
        );
    }

    if (isErrorFriends) {
        return (
            <div className="flex items-center justify-center w-full h-full pt-4 pl-4 border-l-2 border-l-white/30">
                <p className="mt-4 text-2xl font-montserrat text-mainButtonBackground animate-pulse">Error...</p>
            </div>
        );
    }

    return (
        <div className="flex items-start justify-around w-full gap-2">
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
