using Employee.Model;
using Employee.Services;
using MenuAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Employee.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private EmployeeService _employeeService;
        public EmployeeController(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetEmployeeDetails([FromQuery] int? employeeId)
        {
            try
            {
                var employeeDetails = await _employeeService.GetEmployeeDetailsAsync(employeeId);

                if (employeeDetails == null || employeeDetails.Count == 0)
                {
                    return NotFound("No menu items found.");
                }

                return Ok(employeeDetails);
            }
            catch (Exception ex)
            { 
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployeeDetails([FromBody] EmployeeDetails employee)
        {
            try
            {
                // Check if the employee data is valid
                if (employee == null)
                {
                    return BadRequest("Employee details cannot be null.");
                }

                if (string.IsNullOrEmpty(employee.FirstName) || string.IsNullOrEmpty(employee.Email))
                {
                    return BadRequest("Employee name and email are required.");
                }

                // Add the employee to the database via a service
                var addedEmployee = await _employeeService.AddEmployeeAsync(employee);

                if (addedEmployee == null)
                {
                    return StatusCode(500, "An error occurred while saving the employee details.");
                }

                // Return a 201 Created response with the added employee details.
                // Use the correct key matching the GetEmployeeDetails parameter name so the URL is generated correctly.
                return CreatedAtAction(nameof(GetEmployeeDetails), new { employeeId = addedEmployee.EmployeeId }, addedEmployee);
            }
            catch (Exception ex)
            {
                // Log the exception (for debugging, not shown here)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
