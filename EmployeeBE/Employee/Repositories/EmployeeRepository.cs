using Employee.Model;
using Employee.Model.Authorization;
using MenuAPI.Exceptions;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Employee.Repositories
{
  public class EmployeeRepository : IEmployeeRepository
  {
    private readonly string _connectionString;

    public EmployeeRepository(IConfiguration configuration)
    {
      _connectionString = configuration.GetConnectionString("Employee");
    }

    public async Task<List<EmployeeDetails>> GetEmployeeDetailsAsync(int? employeeId)
    {
      List<EmployeeDetails> employeeDetails = new List<EmployeeDetails>();
      try
      {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
          using (SqlCommand cmd = new SqlCommand("sp_GetEmployeeById", connection))
          {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@EmployeeId", (object)employeeId ?? DBNull.Value);

            connection.Open();

            using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
            {
              while (await reader.ReadAsync())
              {
                employeeDetails.Add(new EmployeeDetails
                {
                  EmployeeId = reader.GetInt32(reader.GetOrdinal("EmployeeId")),
                  FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                  LastName = reader.GetString(reader.GetOrdinal("LastName")),
                  Email = reader.GetString(reader.GetOrdinal("Email")),
                  Department = reader.GetString(reader.GetOrdinal("Department")),
                  Image = reader.IsDBNull(reader.GetOrdinal("Image")) ? null : reader.GetString(reader.GetOrdinal("Image"))
                });
              }
            }
          }
        }

        return employeeDetails;
      }
      catch (Exception ex)
      {
        throw new CustomException("Error while fetching employee details from the database.", ex);
      }
    }

    public async Task<List<UserModel>> GetuserDetailsAsync(string userName)
    {
      List<UserModel> userDetail = new List<UserModel>();
      try
      {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
          using (SqlCommand cmd = new SqlCommand("GetUserDetails", connection))
          {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserName", (object)userName ?? DBNull.Value);

            connection.Open();

            using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
            {
              while (await reader.ReadAsync())
              {
                userDetail.Add(new UserModel
                {
                  Username = reader.GetString(reader.GetOrdinal("Username")),
                  UserType = reader.GetString(reader.GetOrdinal("UserType")),
                  Password = reader.GetString(reader.GetOrdinal("Password")),
                  UserId = reader.GetInt32(reader.GetOrdinal("UserId")),
                });
              }
            }
          }
        }

        return userDetail;
      }
      catch (Exception ex)
      {
        throw new CustomException("Error while fetching employee details from the database.", ex);
      }
    }

    public async Task<EmployeeDetails?> AddEmployeeAsync(EmployeeDetails employee)
    {
      if (employee == null) return null;

      try
      {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
          using (SqlCommand cmd = new SqlCommand("sp_AddEmployee", connection))
          {
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@FirstName", (object)employee.FirstName ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@LastName", (object)employee.LastName ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", (object)employee.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Department", (object)employee.Department ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Image", (object)employee.Image ?? DBNull.Value);

            // Support stored proc returning the new id either as OUTPUT param or as scalar/resultset
            var idOutParam = new SqlParameter("@EmployeeId", SqlDbType.Int) { Direction = ParameterDirection.Output };
            cmd.Parameters.Add(idOutParam);

            await connection.OpenAsync();

            // Try ExecuteScalar first (covers stored procs that SELECT or return scalar)
            object? scalar = await cmd.ExecuteScalarAsync();

            int newId = 0;
            if (scalar != null && scalar != DBNull.Value)
            {
              newId = Convert.ToInt32(scalar);
            }
            else if (idOutParam.Value != null && idOutParam.Value != DBNull.Value)
            {
              newId = Convert.ToInt32(idOutParam.Value);
            }
            else
            {
              cmd.Parameters.Clear();
              cmd.CommandType = CommandType.StoredProcedure;
              cmd.CommandText = "sp_AddEmployee";
              cmd.Parameters.AddWithValue("@FirstName", (object)employee.FirstName ?? DBNull.Value);
              cmd.Parameters.AddWithValue("@LastName", (object)employee.LastName ?? DBNull.Value);
              cmd.Parameters.AddWithValue("@Email", (object)employee.Email ?? DBNull.Value);
              cmd.Parameters.AddWithValue("@Department", (object)employee.Department ?? DBNull.Value);
              cmd.Parameters.AddWithValue("@Image", (object)employee.Image ?? DBNull.Value);
              var idOutParam2 = new SqlParameter("@EmployeeId", SqlDbType.Int) { Direction = ParameterDirection.Output };
              cmd.Parameters.Add(idOutParam2);

              await cmd.ExecuteNonQueryAsync();
              if (idOutParam2.Value != null && idOutParam2.Value != DBNull.Value)
              {
                newId = Convert.ToInt32(idOutParam2.Value);
              }
            }

            // If still zero, return null to indicate failure to obtain id
            if (newId <= 0)
            {
              return null;
            }

            employee.EmployeeId = newId;
            return employee;
          }
        }
      }
      catch (Exception ex)
      {
        throw new CustomException("Error while adding employee to the database.", ex);
      }
    }
  }
}
