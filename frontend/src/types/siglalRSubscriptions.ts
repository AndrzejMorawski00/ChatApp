import { FriendshipAPIResponse } from "./Friends";
import { UserData } from "./Users";

export type FriendshipRequestRecieved = {
    friendships: FriendshipAPIResponse;
    users: UserData[];
};

