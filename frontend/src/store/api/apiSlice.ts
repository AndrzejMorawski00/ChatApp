import { createApi } from "@reduxjs/toolkit/query/react";
import { FriendshipAPIResponse } from "../../types/Friends";
import { UserData } from "../../types/Users";
import { CHAT_API_ENDPOINT, FRIENDS_API_ENDPOINT, USER_API_ENDPOINT } from "../../constants/endpoints";
import { ChatData } from "../../types/Chats";
import axiosBaseQuery from "../../utils/api/storeApi";

const createListQuery =
    (path: string) =>
    (params: { searchParams?: string } = {}) => {
        const url = params.searchParams ? `${path}${params.searchParams}` : path;
        return { url };
    };

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: axiosBaseQuery,
    endpoints: (builder) => ({
        // Users
        getUsers: builder.query<UserData[], { searchParams?: string }>({
            query: (params) => createListQuery(USER_API_ENDPOINT)(params),
        }),

        // Friends
        getFriendships: builder.query<FriendshipAPIResponse, void>({
            query: () => createListQuery(FRIENDS_API_ENDPOINT)(),
        }),

        //Chats
        getChats: builder.query<ChatData[], void>({
            query: () => createListQuery(CHAT_API_ENDPOINT)(),
        }),
    }),
});

export const { useGetUsersQuery, useGetFriendshipsQuery, useGetChatsQuery } = apiSlice;
