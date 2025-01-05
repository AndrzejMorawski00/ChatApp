import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewChatType } from "../../types/Chats";
import { createNewChat } from "../../utils/api/createChat";

// Constants
const NEW_CHAT_ERROR_MESSAGE = "Failed to create a new chat";


const useNewChatMutation = () => {
    const queryClient = useQueryClient();
    const chatQueryKeys = ["userChats"];
    return useMutation({
        mutationFn: (chatData: NewChatType) => createNewChat(chatData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: chatQueryKeys });
        },
        onError: () => {
            throw new Error(NEW_CHAT_ERROR_MESSAGE);
        },
    });
};

export default useNewChatMutation;
