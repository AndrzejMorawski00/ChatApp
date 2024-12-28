import { HubConnection } from "@microsoft/signalr";
import { NewSimpleMessage } from "../../types/messages";

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

export const handleCreateChat = async (chatData : any) => {
    if (!connection) {
        throw new Error("SignalR connection not established");
    }

    try {
        await connection.invoke("ChatCreated", chatData);
    } catch (error) {
        console.error("Error creating new chat")
    }
}



export const handleSendSimpleMessage = async (newMessage: NewSimpleMessage) => {
    if (connection) {
        try {
            await connection.invoke("SendMessage", newMessage);
            console.log("Message sent:", newMessage);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
};

// export const handleSendMessage = async (newMessage: _) => {
//     if (connection) {
//         try {
//             await connection.invoke("SendMessage", newMessage);
//             console.log("Message sent:", newMessage);
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }
//     }
// };


export const handleSignalRAction = async <T>( actionName : string, data : T) : Promise<void> => {
    if (connection) {
        try {
            await connection.invoke(actionName, data);
            console.log("Acction finished");
        } catch (error) {
            console.error("Error occured: ", error);
        }
    }
    console.error("Connection is closed");
}