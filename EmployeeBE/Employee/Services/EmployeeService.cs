using Employee.Model;
using Employee.Model.Authorization;
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

        public async Task<List<UserModelDto>> GetUserDetailsAsync(string userName)
        {
            var userDetails = await _employeeRepository.GetuserDetailsAsync(userName);
            if (userDetails == null || userDetails.Count == 0)
                return new List<UserModelDto>();

            return userDetails
                .Where(u => u != null)
                .Select(u => new UserModelDto
                {
                    UserId = u.UserId,
                    Username = u.Username,
                    Password = u.Password,
                    UserType = u.UserType,
                })
                .ToList();
        }

    public async Task<EmployeeDetails?> AddEmployeeAsync(EmployeeDetails employee)
    {
      if (employee == null) return null;
      var added = await _employeeRepository.AddEmployeeAsync(employee);
      return added;
    }
  }
}
