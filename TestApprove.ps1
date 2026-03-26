$ErrorActionPreference = "Stop"

# 1. Login
$loginBody = @{
    email = "tanakorninthawat@gmail.com"
    password = "korn1434"
} | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "http://localhost:5238/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginRes.token
$userId = $loginRes.user.id

Write-Host "Logged in. Token acquired for User ID: $userId"

# 2. Get Pending Orders
$headers = @{ Authorization = "Bearer $token" }
$orders = Invoke-RestMethod -Uri "http://localhost:5238/api/orders?status=pending_approval" -Headers $headers

if ($orders.Count -eq 0) {
    Write-Host "No pending orders found!"
    exit
}

$orderId = $orders[0].id
$poNumber = $orders[0].poNumber
Write-Host "Found pending order: $poNumber ($orderId)"

# 3. Approve Order
$approveBody = @{
    approvedBy = $userId
    approvalNotes = "E2E Test Auto Approve"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5238/api/orders/$orderId/approve" -Method Put -Body $approveBody -ContentType "application/json" -Headers $headers

Write-Host "Order approved successfully!"
