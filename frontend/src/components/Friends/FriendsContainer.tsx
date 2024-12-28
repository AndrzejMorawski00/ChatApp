import { useFriendActions } from "../../api/signalR/useFriendActions";
import FriendList from "./FriendList";

interface Props {

}

export const FRIEND_COLUMNS = {
    accepted: "Friends:",
    sent: "My Requests:",
    received: 'Friendship Requests:',
} as const;

const FriendsContainer = ({}: Props) => {

    const { friendsData, isLoadingFriends, isErrorFriends } = useFriendActions();
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
                    friends={friendsData.received}
                />
                <FriendList
                    listName={FRIEND_COLUMNS.sent}
                    friends={friendsData.sent}
                />
            </div>
            <FriendList
                listName={FRIEND_COLUMNS.accepted}
                friends={friendsData.accepted}
            />
        </div>
    );
};

export default FriendsContainer;
