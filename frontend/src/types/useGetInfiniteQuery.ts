export type PaginatedResponse<T> = {
    count: number;
    next: number | null;
    prev: number | null;
    items: T[];
};


export type FetchInfiniteObject<T> = (pageParam: number) => Promise<PaginatedResponse<T>>;
