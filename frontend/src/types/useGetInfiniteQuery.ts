export type PaginatedResponse<T> = {
    count: number;
    next: number | null;
    prev: number | null;
    items: T[];
};


export type FetchInfiniteObject<T, K> = (pageParam: K) => Promise<PaginatedResponse<T>>;
