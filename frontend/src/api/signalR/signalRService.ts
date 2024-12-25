import { HubConnection } from "@microsoft/signalr";

let connection: HubConnection | null = null;

export const setConnection = (hubConnection: HubConnection) => {
    connection = hubConnection;
};

export const getConnection = (): HubConnection | null => {
    return connection;
};

export const handleAddFriend = async (friendEmail: string) => {
    if (!connection) {
        throw new Error("SignalR connection not established");
    }
    try {
        console.log(`Friend ID: ${friendEmail}`);
        await connection.invoke("AddFriend", friendEmail);
    } catch (error) {
        console.error("Error sending friendship request", error);
    }
};

export const handleAcceptFriend = async (friendshipId: number) => {
    if (!connection) {
        throw new Error("SignalR connection not established");
    }
    try {
        await connection.invoke("AcceptFriend", friendshipId);
    } catch (error) {
        console.error("Error accepting friendship request", error);
    }
};

export const handleRemoveFriend = async (friendshipId: number) => {
    if (!connection) {
        throw new Error("SignalR connection not established");
    }
    try {
        await connection.invoke("RemoveFriend", friendshipId);
    } catch (error) {
        console.error("Error cancelling request", error);
    }
};