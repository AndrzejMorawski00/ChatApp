import { NewApiStatusMessage } from "./ApiMessages";
import { FriendshipAPIResponse } from "./Friends";
import { UserData } from "./Users";

export type FriendshipRequestRecieved = {
    friendships: FriendshipAPIResponse;
    users: UserData[];
};


export type SignalRAPIResponseMessage<T> = {
    message? : NewApiStatusMessage,
    payload? : T
}