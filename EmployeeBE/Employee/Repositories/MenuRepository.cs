using Employee.Model;
using Employee.Repositories;
using MenuAPI.Exceptions;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace MenuAPI.Repositories
{
    public class MenuRepository : IMenuRepository
    {
        private readonly string _connectionString;

        public MenuRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Employee");
        }

        public async Task<List<MenuDetail>> GetMenuDetailsAsync(string? menuId, string? menuName, string? type, string? availability)
        {
            List<MenuDetail> menuList = new List<MenuDetail>();

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("GetMenuDetails", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Availability", (object)availability ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@MenuId", menuId as object ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@MenuName", (object)menuName ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@Type", (object)type ?? DBNull.Value);

                        connection.Open();

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                menuList.Add(new MenuDetail
                                {
                                    MenuId = reader.GetString(reader.GetOrdinal("MenuId")),
                                    MenuName = reader.GetString(reader.GetOrdinal("MenuName")),
                                    Type = reader.GetString(reader.GetOrdinal("Type")),
                                    Availability = reader.GetString(reader.GetOrdinal("Availability"))
                                });
                            }
                        }
                    }
                }

                return menuList;
            }
            catch (Exception ex)
            {
                throw new CustomException("Error while fetching menu details from the database.", ex);
            }
        }
    }
}
