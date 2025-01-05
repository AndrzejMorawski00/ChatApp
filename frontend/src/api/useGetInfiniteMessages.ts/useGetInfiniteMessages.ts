import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMessages } from "../../utils/api/fetchMessages";

const useGetInfiniteMessages = (chatID: number) => {
    const queryKeys: string[] = ["messages", chatID.toString()];

    const { data, fetchNextPage, isFetchingNextPage, isFetchNextPageError, isLoading, isError, hasNextPage } =
        useInfiniteQuery({
            queryKey: queryKeys,
            queryFn: ({ pageParam }) => fetchMessages({ pageNumber: pageParam.pageNumber, chatID: chatID }),
            getNextPageParam: (lastPage) => (lastPage.next ? { pageNumber: lastPage.next } : null),
            getPreviousPageParam: (lastPage) => (lastPage.prev ? { pageNumber: lastPage.prev } : null),
            initialPageParam: { pageNumber: 1 },
        });

    return { data, fetchNextPage, isFetchingNextPage, isFetchNextPageError, isLoading, isError, hasNextPage };
};

export default useGetInfiniteMessages;
