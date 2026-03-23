using System.Data;
using ExcelDataReader;
using Microsoft.EntityFrameworkCore;
using ChemWatch.Data;
using ChemWatch.Models;
using Microsoft.Extensions.Logging;

namespace ChemWatch.Services;

public class DataImportService
{
    private readonly AppDbContext _db;
    private readonly ILogger<DataImportService> _logger;

    public DataImportService(AppDbContext db, ILogger<DataImportService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task RunImportAsync(string filePath)
    {
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

        if (!File.Exists(filePath))
        {
            _logger.LogError("File not found: {FilePath}", filePath);
            return;
        }

        using var stream = File.Open(filePath, FileMode.Open, FileAccess.Read);
        using var reader = ExcelReaderFactory.CreateReader(stream);
        var result = reader.AsDataSet(new ExcelDataSetConfiguration()
        {
            ConfigureDataTable = (_) => new ExcelDataTableConfiguration() { UseHeaderRow = true }
        });

        _logger.LogInformation("Excel loaded. Sheets: {Sheets}", string.Join(", ", result.Tables.Cast<DataTable>().Select(t => t.TableName)));

        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            await ImportUsersSheet(result);
            await ImportPOnumberSheet(result);
            await ImportMaterialListSheet(result);
            await ImportPeroxideRulesSheet(result);

            await _db.SaveChangesAsync();
            await transaction.CommitAsync();
            _logger.LogInformation("Import successful. Transaction committed.");
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Import failed, transaction rolled back.");
        }
    }

    private async Task ImportPOnumberSheet(DataSet dataSet)
    {
        var dt = dataSet.Tables.Cast<DataTable>().FirstOrDefault(t => t.TableName.Contains("POnumber"));
        if (dt == null) return;
        
        int added = 0;
        foreach (DataRow row in dt.Rows)
        {
            var poNumber = row["PO number"]?.ToString()?.Trim();
            if (string.IsNullOrEmpty(poNumber)) continue;

            var categoryName = row["Category"]?.ToString()?.Trim();
            var labName = row["Lab"]?.ToString()?.Trim();
            var vendorName = row["Vendor"]?.ToString()?.Trim();

            bool exists = await _db.PoReferences.AnyAsync(p => p.PoNumber == poNumber);
            if (!exists)
            {
                var poRef = new PoReference
                {
                    PoNumber = poNumber,
                    CategoryId = await ResolveCategoryAsync(categoryName),
                    LabId = await ResolveLabAsync(labName),
                    VendorId = await ResolveVendorAsync(vendorName)
                };
                _db.PoReferences.Add(poRef);
                added++;
            }
        }
        _logger.LogInformation("Imported {Count} new PO references.", added);
    }

    private async Task ImportUsersSheet(DataSet dataSet)
    {
        var dt = dataSet.Tables.Cast<DataTable>().FirstOrDefault(t => t.TableName.Contains("UserList", StringComparison.OrdinalIgnoreCase) || t.TableName.Contains("User", StringComparison.OrdinalIgnoreCase));
        if (dt == null) 
        {
            _logger.LogWarning("UserList sheet not found.");
            return;
        }

        int added = 0;
        var defaultPasswordHash = BCrypt.Net.BCrypt.HashPassword("ChemWatch123!");

        // Ensure roles exist
        var roles = await _db.Roles.ToListAsync();
        var adminRole = roles.FirstOrDefault(r => r.Name == "admin");
        var focalPointRole = roles.FirstOrDefault(r => r.Name == "focal_point");
        var userRole = roles.FirstOrDefault(r => r.Name == "user");

        if (userRole == null)
        {
            userRole = new Role { Id = Guid.NewGuid(), Name = "user", DisplayName = "Standard User" };
            _db.Roles.Add(userRole);
            await _db.SaveChangesAsync();
        }

        foreach (DataRow row in dt.Rows)
        {
            var fullName = row["Name"]?.ToString()?.Trim();
            if (string.IsNullOrEmpty(fullName)) continue;

            var email = row["Email"]?.ToString()?.Trim();
            if (string.IsNullOrEmpty(email))
            {
                // Generate email from name
                var parts = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length > 0)
                {
                    var first = parts[0].ToLowerInvariant();
                    var last = parts.Length > 1 ? parts[parts.Length - 1].ToLowerInvariant() : "";
                    email = $"{first}.{last}@chemwatch.local".Replace("..", ".");
                }
                else
                {
                    email = $"user{Guid.NewGuid().ToString().Substring(0, 8)}@chemwatch.local";
                }
            }

            // Check if user exists
            if (await _db.Users.AnyAsync(u => u.Email.ToLower() == email.ToLower()))
                continue;

            var roleStr = row["Role"]?.ToString()?.Trim()?.ToLowerInvariant();
            var assignedRole = userRole;

            if (roleStr == "admin" || roleStr == "administrator")
                assignedRole = adminRole ?? userRole;
            else if (roleStr == "focal point" || roleStr == "focal_point" || roleStr == "approver")
                assignedRole = focalPointRole ?? userRole;

            var scopeType = "specific";
            if (assignedRole.Name == "admin")
                scopeType = "all";

            var user = new User
            {
                Id = Guid.NewGuid(),
                FullName = fullName,
                Email = email,
                PasswordHash = defaultPasswordHash,
                RoleId = assignedRole.Id,
                LocationScopeType = scopeType,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _db.Users.Add(user);
            added++;

            // Locations assignment
            if (scopeType == "specific")
            {
                var locStr = row["Location"]?.ToString()?.Trim();
                if (!string.IsNullOrEmpty(locStr))
                {
                    var locations = locStr.Split(new[] { ',', '&', '/' }, StringSplitOptions.RemoveEmptyEntries);
                    foreach (var l in locations)
                    {
                        var locName = l.Trim();
                        var loc = await _db.Locations.FirstOrDefaultAsync(loc => loc.Name.ToLower() == locName.ToLower() || loc.Code.ToLower() == locName.ToLower());
                        if (loc != null)
                        {
                            _db.UserLocations.Add(new UserLocation
                            {
                                Id = Guid.NewGuid(),
                                UserId = user.Id,
                                LocationId = loc.Id,
                                CreatedAt = DateTime.UtcNow
                            });
                        }
                    }
                }
            }
        }
        _logger.LogInformation("Imported {Count} new Users.", added);
    }

    private async Task ImportMaterialListSheet(DataSet dataSet)
    {
        var dt = dataSet.Tables.Cast<DataTable>().FirstOrDefault(t => t.TableName.Contains("MaterialList"));
        if (dt == null) return;

        int itemsAdded = 0;
        int settingsAdded = 0;

        foreach (DataRow row in dt.Rows)
        {
            var partNo = row["Part no."]?.ToString()?.Trim();
            var itemName = row["Item"]?.ToString()?.Trim();
            if (string.IsNullOrEmpty(itemName)) continue;

            var vendorName = row["Vendor"]?.ToString()?.Trim();
            var categoryName = row["Category"]?.ToString()?.Trim();
            
            // Resolve basic refs
            var vendorId = await ResolveVendorAsync(vendorName);
            var categoryId = await ResolveCategoryAsync(categoryName);

            var item = await _db.Items.FirstOrDefaultAsync(i => i.ItemName == itemName && i.PartNo == partNo);
            if (item == null)
            {
                item = new Item
                {
                    ItemName = itemName,
                    ItemShortName = row["Item - short name"]?.ToString()?.Trim() ?? itemName,
                    PartNo = partNo ?? string.Empty,
                    Type = row["Type"]?.ToString()?.Trim() ?? string.Empty,
                    Size = row["Size"]?.ToString()?.Trim() ?? string.Empty,
                    Unit = row["Unit"]?.ToString()?.Trim() ?? "ea",
                    CategoryId = categoryId,
                    DefaultVendorId = vendorId,
                    IsActive = true,
                    RequiresPeroxideMonitoring = row["Regulatory"]?.ToString()?.Contains("Peroxide") ?? false,
                    PeroxideClass = ExtractPeroxideClass(row["Regulatory"]?.ToString()),
                    IsOrderable = true,
                    RequiresCheckin = true,
                    AllowsCheckout = true,
                    TracksExpiry = true
                };
                _db.Items.Add(item);
                await _db.SaveChangesAsync(); // save to get ID for lab settings
                itemsAdded++;
            }

            // Map location lab settings
            var primaryLabName = row["Lab"]?.ToString()?.Trim();
            var labId = await ResolveLabAsync(primaryLabName);
            if (labId != null)
            {
                // AIE Min Stock
                settingsAdded += await EnsureItemLabSetting(item.Id, await ResolveLabScopeAsync("AIE", primaryLabName), ParseDecimal(row["AIE\nMin Stock"]));
                // MTP Min Stock
                settingsAdded += await EnsureItemLabSetting(item.Id, await ResolveLabScopeAsync("MTP", primaryLabName), ParseDecimal(row["MTP\nMin Stock"]));
                // CT Min Stock
                settingsAdded += await EnsureItemLabSetting(item.Id, await ResolveLabScopeAsync("CT", primaryLabName), ParseDecimal(row["CT\nMin Stock"]));
                // ATC
                settingsAdded += await EnsureItemLabSetting(item.Id, await ResolveLabScopeAsync("ATC", primaryLabName), ParseDecimal(row["ATC\nMin Stock"]));
            }
        }
        _logger.LogInformation("Imported {ItemsAdded} items and {SettingsAdded} lab settings.", itemsAdded, settingsAdded);
    }

    private async Task ImportPeroxideRulesSheet(DataSet dataSet)
    {
        var dt = dataSet.Tables.Cast<DataTable>().FirstOrDefault(t => t.TableName.Contains("Peroxide_Related"));
        if (dt == null) return;
        
        int count = 0;
        foreach (DataRow row in dt.Rows)
        {
            var pTypeStr = row["Type"]?.ToString()?.Trim();
            var pType = ExtractPeroxideClass(pTypeStr);
            if (string.IsNullOrEmpty(pType)) continue;

            bool exists = await _db.PeroxideConfigRules.AnyAsync(r => r.PeroxideClass == pType);
            if (!exists)
            {
                var rule = new PeroxideConfigRule
                {
                    PeroxideClass = pType,
                    TestBeforeUse = row["Inspection / test"]?.ToString()?.Contains("Peroxide (result)") == true,
                    // Basic heuristic, ideally this is properly validated
                };
                _db.PeroxideConfigRules.Add(rule);
                count++;
            }
        }
        _logger.LogInformation("Imported {Count} Peroxide Rules.", count);
    }

    // Helpers
    private async Task<Guid> ResolveCategoryAsync(string? categoryName)
    {
        if (string.IsNullOrEmpty(categoryName)) categoryName = "Uncategorized";
        var existing = await _db.ItemCategories.FirstOrDefaultAsync(c => c.Name == categoryName || c.Code == categoryName);
        if (existing != null) return existing.Id;
        
        var newCat = new ItemCategory { Name = categoryName, Code = categoryName.Substring(0, Math.Min(categoryName.Length, 15)).ToUpper(), IsActive = true };
        _db.ItemCategories.Add(newCat);
        await _db.SaveChangesAsync();
        return newCat.Id;
    }

    private async Task<Guid?> ResolveVendorAsync(string? vendorName)
    {
        if (string.IsNullOrEmpty(vendorName)) return null;
        var existing = await _db.Vendors.FirstOrDefaultAsync(v => v.Name == vendorName || v.Code == vendorName);
        if (existing != null) return existing.Id;

        var newVendor = new Vendor { Name = vendorName, Code = vendorName.Substring(0, Math.Min(vendorName.Length, 15)).ToUpper(), IsActive = true };
        _db.Vendors.Add(newVendor);
        await _db.SaveChangesAsync();
        return newVendor.Id;
    }

    private async Task<Guid?> ResolveLabAsync(string? labName)
    {
        if (string.IsNullOrEmpty(labName)) return null;
        if (labName.Equals("Shared", StringComparison.OrdinalIgnoreCase)) return null; // Needs location context
        var lab = await _db.Labs.FirstOrDefaultAsync(l => l.Name.ToLower() == labName.ToLower() || l.Code.ToLower() == labName.ToLower());
        return lab?.Id;
    }

    private async Task<Guid?> ResolveLabScopeAsync(string locationCode, string? primaryLabName)
    {
        // Try mapping the location + primary lab name or fallback to "Shared" lab for that location
        var loc = await _db.Locations.FirstOrDefaultAsync(l => l.Code == locationCode);
        if (loc == null) return null;

        if (!string.IsNullOrEmpty(primaryLabName) && primaryLabName.Equals("Shared", StringComparison.OrdinalIgnoreCase) == false)
        {
            var exactLab = await _db.Labs.FirstOrDefaultAsync(l => l.LocationId == loc.Id && (l.Name == primaryLabName || l.Code == primaryLabName));
            if (exactLab != null) return exactLab.Id;
        }

        var sharedLab = await _db.Labs.FirstOrDefaultAsync(l => l.LocationId == loc.Id && l.Name == "Shared");
        return sharedLab?.Id;
    }

    private async Task<int> EnsureItemLabSetting(Guid itemId, Guid? labId, decimal? minStock)
    {
        if (labId == null || !minStock.HasValue) return 0;
        
        bool exists = await _db.ItemLabSettings.AnyAsync(s => s.ItemId == itemId && s.LabId == labId.Value);
        if (!exists)
        {
            _db.ItemLabSettings.Add(new ItemLabSetting
            {
                ItemId = itemId,
                LabId = labId.Value,
                MinStock = minStock.Value,
                ReorderQuantity = minStock * 1.5m, // Safe default
                IsStocked = true
            });
            return 1;
        }
        return 0;
    }

    private decimal? ParseDecimal(object? val)
    {
        if (val == null) return null;
        if (decimal.TryParse(val.ToString(), out decimal res)) return res;
        return null;
    }

    private string? ExtractPeroxideClass(string? regulatoryStr)
    {
        if (string.IsNullOrEmpty(regulatoryStr)) return null;
        var r = regulatoryStr.Trim();
        if (r.StartsWith("Peroxide_", StringComparison.OrdinalIgnoreCase))
        {
            var val = r.Substring("Peroxide_".Length).Trim();
            if (val.Length > 10) val = val.Substring(0, 10);
            return val;
        }
        return null; // non-peroxide regulatory values are ignored for this column
    }
}
