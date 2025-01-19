namespace ChatAppASPNET
{
    public class PaginatedResponse<T>
    {
        public int Count { get; set; }
        public int? Next { get; set; }

        public int? Prev { get; set; }

        public List<T> Items { get; set; }
        public PaginatedResponse(List<T> items, int count, int pageNumber, int pageSize)
        {
            Items = items;
            Count = count;
            Next = (pageNumber * pageSize < count) ? pageNumber + 1 : null;
            Prev = (pageNumber > 1) ? pageNumber - 1 : null;

        }
    }
}
