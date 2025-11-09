using Employee.Model.Authorization;
using Employee.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Employee.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TokenService _tokenService;

        public AuthController(TokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserModel user)
        {
            if (user.Username == "admin" && user.Password == "password")
            {
                var token = _tokenService.GenerateToken(user.Username);
                return Ok(new { token });
            }

            return Unauthorized("Invalid credentials");
        }
    }
}
