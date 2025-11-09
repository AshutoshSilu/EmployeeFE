namespace Employee.Model
{
    public class EmployeeDetailsDto
    {
        public int EmployeeId { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Department { get; set; }
        public string Image { get; set; }
    }
}
