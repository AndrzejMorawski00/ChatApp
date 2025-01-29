import { FriendColumnNames } from "../../types/Friends";
import { UserData } from "../../types/Users";
import FriendItem from "./FriendItem";

interface Props {
    listName: FriendColumnNames;
    friends: { id: number; userData: UserData }[];
}

const FriendList = ({ listName, friends }: Props) => {
    return (
        <div className="flex flex-col items-center gap-2 min-w-[30%]">
            <h2 className="pb-2 text-2xl tracking-wider text-textColor">{listName}</h2>
            <ul className={`flex flex-col w-full gap-2 max-h-[70vh] ${friends.length > 0 ? "overflow-y-auto" : ""}`}>
                {friends.length > 0 ? (
                    friends.map((friend) => <FriendItem key={friend.id} friendship={friend} actions={listName} />)
                ) : (
                    <li className="text-xl text-center text-textColor">No friends available in this list.</li>
                )}
            </ul>
        </div>
    );
};

export default FriendList;
