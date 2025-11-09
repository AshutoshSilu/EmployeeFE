namespace Employee.Model
{
    public class MenuDetailDto
    {
        public string MenuId { get; set; }
        public required string MenuName { get; set; }
        public required string Type { get; set; }
        public required string Availability { get; set; }
    }
}
