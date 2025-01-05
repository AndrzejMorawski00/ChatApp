import { FriendshipStatus } from "./enums";
import { UserData } from "./Users";

export type Friendship = {
    id: number;
    senderID: number;
    receiverID: number;
    senderData: UserData;
    receiverData: UserData;
    isSender: boolean;
    status: FriendshipStatus;
};

export type FriendAPIResponse = {
    accepted: Friendship[];
    sent: Friendship[];
    received: Friendship[];
};

export type FriendData = {
    id: number;
    userData: UserData;
};
