import { UserData } from "../../types/Users";
import FriendItem from "./FriendItem";
import { FRIEND_COLUMNS } from "./FriendsContainer";

interface Props {
    listName: (typeof FRIEND_COLUMNS)[keyof typeof FRIEND_COLUMNS];
    friends: { id: number; userData: UserData }[];
}

const FriendList = ({ listName, friends }: Props) => {
    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl text-textColor tracking-wider">{listName}</h2>
            <ul className={`flex flex-col gap-2 max-h-[70vh] ${friends.length > 0 ? "overflow-y-auto" : ""}`}>
                {friends.length > 0 ? (
                    friends.map((friend) => <FriendItem key={friend.id} friendship={friend} actions={listName} />)
                ) : (
                    <li className="text-center text-textColor text-l">No friends available in this list.</li>
                )}
            </ul>
        </div>
    );
};

export default FriendList;
