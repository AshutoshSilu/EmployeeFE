using Employee.Model;

namespace Employee.Repositories
{
    public interface IEmployeeRepository
    {
        Task<List<EmployeeDetails>> GetEmployeeDetailsAsync(int? employeeId);
        Task<EmployeeDetails?> AddEmployeeAsync(EmployeeDetails employee);
    }
}
