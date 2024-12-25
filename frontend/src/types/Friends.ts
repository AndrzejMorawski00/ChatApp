import { UserData } from "./Users";

export type Friend = {
    id: number;
    userId: number;
    friendData: UserData;
    status: FrienshipStatus;
};

export type FrienshipStatus = "pending" | "accepted";

export type HandleAddFriend = (friendEmail: string) => Promise<void>;

export type HandleAcceptFriend = (friendshipId: number) => Promise<void>;

export type HandleRemoveFriend = (friendshipId : number) => Promise<void>