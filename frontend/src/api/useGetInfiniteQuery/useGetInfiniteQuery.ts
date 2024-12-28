import { useInfiniteQuery } from "@tanstack/react-query";
import { FetchInfiniteObject, PaginatedResponse } from "../../types/useGetInfiniteQuery";

// const useGetInfiniteObjects = <T, K>(queryKeys: string[], fetchObject: FetchInfiniteObject<T, K>) => {
//     return useInfiniteQuery({
//         queryKey: queryKeys,
//         queryFn: ({ pageParam } {pageParam : K}) => fetchObject(pageParam),
//         getNextPageParam: (lastPage) => lastPage?.next || null,
//         getPreviousPageParam: (prevPage) => prevPage?.prev || null,
//         initialPageParam: 1,
//     });
// };

const useGetInfiniteObjects = <T, K extends number | object>(
    queryKeys: string[],
    fetchObject: FetchInfiniteObject<T, K>,
    initialPageParam: K
  ) => {
    return useInfiniteQuery<PaginatedResponse<T>, Error, PaginatedResponse<T>, string[], K>({
      queryKey: queryKeys,
      queryFn: ({ pageParam }) => fetchObject(pageParam as K),
      getNextPageParam: (lastPage) => lastPage.next as K | null, // Ensure `next` aligns with type `K`
      getPreviousPageParam: (prevPage) => prevPage.prev as K | null, // Ensure `prev` aligns with type `K`
      initialPageParam, // Use the provided `initialPageParam`
    });
  };
export default useGetInfiniteObjects;
