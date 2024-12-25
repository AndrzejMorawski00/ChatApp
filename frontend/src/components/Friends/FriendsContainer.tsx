import { FriendAPIResponse,} from "../../types/Friends";
import FriendList from "./FriendList";

interface Props {
    friends: FriendAPIResponse;
    isLoading: boolean;
    isError: boolean;

}

export const FRIEND_COLUMNS = {
    accepted: "Friends:",
    sent: "My Requests:",
    received: 'Friendship Requests:',
} as const;

const FriendsContainer = ({ friends, isLoading, isError }: Props) => {
    if (isLoading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (isError) {
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
                    friends={friends.received}
                />
                <FriendList
                    listName={FRIEND_COLUMNS.sent}
                    friends={friends.sent}
                />
            </div>
            <FriendList
                listName={FRIEND_COLUMNS.accepted}
                friends={friends.accepted}
            />
        </div>
    );
};

export default FriendsContainer;
