import { UserData } from "./Users";

export type Friendship = {
    id: number;
    senderID: number;
    friendData: UserData;
    status: FriendshipStatus;
};

export type FriendAPIResponse = {
    accepted: Friendship[],
    sent: Friendship[],
    received: Friendship[],
}


export enum FriendshipStatus
{
   Pending = 0,
   Accepted = 1
}


export type HandleAddFriend = (friendEmail: string) => Promise<void>;

export type HandleAcceptFriend = (friendshipId: number) => Promise<void>;

export type HandleRemoveFriend = (friendshipId : number) => Promise<void>