using Employee.Model;

namespace Employee.Repositories
{
    public interface IMenuRepository
    {
        Task<List<MenuDetail>> GetMenuDetailsAsync(string? menuId, string? menuName, string? type, string? availability);
    }
}
