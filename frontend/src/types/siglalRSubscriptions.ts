import { FriendAPIResponse } from "./Friends";
import { UserData } from "./Users";

export type FriendshipRequestRecievedType = {
    friendships: FriendAPIResponse;
    users: UserData[];
};


export type UserAddedToChatType = {
    
}