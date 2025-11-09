using Employee.Model;
using Employee.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Employee.Services
{
    public class EmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<List<EmployeeDetailsDto>> GetEmployeeDetailsAsync(int? employeeId)
        {
            var employeeDetails = await _employeeRepository.GetEmployeeDetailsAsync(employeeId);
            return employeeDetails.Select(e => new EmployeeDetailsDto
            {
               EmployeeId = e.EmployeeId,
               FirstName = e.FirstName,
               LastName = e.LastName,
               Email = e.Email,
               Department = e.Department,
               Image = e.Image,
            }).ToList();
        }

        public async Task<EmployeeDetails?> AddEmployeeAsync(EmployeeDetails employee)
        {
            if (employee == null) return null;
            var added = await _employeeRepository.AddEmployeeAsync(employee);
            return added;
        }
    }
}