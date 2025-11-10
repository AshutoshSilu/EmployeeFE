namespace Employee.Model.Authorization
{
  public class UserModelDto
  {
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public int? UserId { get; set; }
    public string? UserType { get; set; }
  }
}
