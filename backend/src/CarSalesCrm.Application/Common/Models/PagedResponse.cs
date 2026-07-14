namespace CarSalesCrm.Application.Common.Models;

public class PagedResponse<T>
{
    public IReadOnlyList<T> Items { get; set; } = Array.Empty<T>();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }

    public static PagedResponse<T> Create(IReadOnlyList<T> items, int page, int pageSize, int totalItems)
    {
        var totalPages = pageSize <= 0 ? 0 : (int)Math.Ceiling(totalItems / (double)pageSize);

        return new PagedResponse<T>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };
    }
}
