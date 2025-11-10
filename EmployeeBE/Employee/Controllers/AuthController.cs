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
        private readonly EmployeeService _employeeService;

        public AuthController(TokenService tokenService, EmployeeService employeeService)
        {
            _tokenService = tokenService;
            _employeeService = employeeService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserModel user)
        {
            var userDetailsList = await _employeeService.GetUserDetailsAsync(user.Username);
            var userDetails = userDetailsList?.FirstOrDefault();

            if (userDetails != null && user.Username == userDetails.Username && user.Password == userDetails.Password)
            {
                var token = _tokenService.GenerateToken(user.Username);
                return Ok(new { token });
            }

            return Unauthorized("Invalid credentials");
        }
    }
}
