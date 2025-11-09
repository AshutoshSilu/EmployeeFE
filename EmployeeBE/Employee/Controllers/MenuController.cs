using MenuAPI.Services;
using Microsoft.AspNetCore.Mvc;


namespace MenuAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly MenuService _menuService;

        public MenuController(MenuService menuService)
        {
            _menuService = menuService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMenuDetails([FromQuery] string? menuId, [FromQuery] string? menuName, [FromQuery] string? type, [FromQuery] string? availability)
        {
            try
            {
                var menuDetails = await _menuService.GetMenuDetailsAsync(menuId, menuName, type, availability);

                if (menuDetails == null || menuDetails.Count == 0)
                {
                    return NotFound("No menu items found.");
                }

                return Ok(menuDetails);
            }
            catch (Exception ex)
            {
                // Log the exception here (via ILogger or a logging framework like Serilog)
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
