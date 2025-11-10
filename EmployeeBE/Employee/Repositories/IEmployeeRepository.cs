using Employee.Model;
using Employee.Model.Authorization;

namespace Employee.Repositories
{
  public interface IEmployeeRepository
  {
    Task<List<EmployeeDetails>> GetEmployeeDetailsAsync(int? employeeId);
    Task<EmployeeDetails?> AddEmployeeAsync(EmployeeDetails employee);
    Task<List<UserModel?>> GetuserDetailsAsync(string userName);
  }
}
