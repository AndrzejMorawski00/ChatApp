import { handleAcceptFriend, handleAddFriend, handleRemoveFriend } from "../../api/signalR/signalRService";

export const sendFriendRequest = async (friendEmail: string) => {
    try {
        console.log(`Friend Email: ${friendEmail}`);
        await handleAddFriend(friendEmail);
    } catch (error) {
        console.error("Error sending friendship request", error);
    }
};

export const acceptFriendRequest = async (friendshipId: number) => {
    try {
        await handleAcceptFriend(friendshipId);
    } catch (error) {
        console.error("Error accepting friendship request", error);
    }
};

export const removeFriendRequest = async (friendshipId: number) => {
    try {
        await handleRemoveFriend(friendshipId);
    } catch (error) {
        console.error("Error cancelling request", error);
    }
};
