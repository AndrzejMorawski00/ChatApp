import { useInfiniteQuery } from "@tanstack/react-query";
import { FetchInfiniteObject } from "../../types/useGetInfiniteQuery";

const useGetInfiniteObjects = <T>(queryKeys: string[], fetchObject: FetchInfiniteObject<T>) => {
    return useInfiniteQuery({
        queryKey: queryKeys,
        queryFn: ({ pageParam }) => fetchObject(pageParam),
        getNextPageParam: (lastPage) => lastPage?.next || null,
        getPreviousPageParam: (prevPage) => prevPage?.prev || null,
        initialPageParam: 1,
    });
};

export default useGetInfiniteObjects;
