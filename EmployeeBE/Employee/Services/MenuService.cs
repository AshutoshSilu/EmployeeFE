using Employee.Model;
using Employee.Repositories;

namespace MenuAPI.Services
{
    public class MenuService
    {
        private readonly IMenuRepository _menuRepository;

        public MenuService(IMenuRepository menuRepository)
        {
            _menuRepository = menuRepository;
        }

        public async Task<List<MenuDetailDto>> GetMenuDetailsAsync(string? menuId, string? menuName, string? type, string? availability)
        {
            var menuDetails = await _menuRepository.GetMenuDetailsAsync(menuId, menuName, type, availability);
            return menuDetails.Select(m => new MenuDetailDto
            {
                MenuId = m.MenuId,
                MenuName = m.MenuName,
                Type = m.Type,
                Availability = m.Availability
            }).ToList();
        }
    }
}
