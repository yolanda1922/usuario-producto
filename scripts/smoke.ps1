$ErrorActionPreference = "Stop"

$base = "http://localhost:3000/api/v1"
$rand = Get-Random

$userBody = @{ nombre = "Err$rand"; email = "err$rand@ejemplo.com"; password = "password123" } | ConvertTo-Json
$reg = Invoke-RestMethod -Method Post -Uri "$base/usuarios/register" -ContentType "application/json" -Body $userBody
$loginBody = @{ email = $reg.usuario.email; password = "password123" } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri "$base/usuarios/login" -ContentType "application/json" -Body $loginBody
$headers = @{ Authorization = "Bearer $($login.token)" }
$badId = "699999999999999999999999"

Write-Output "401 usuarios sin token"
try {
    Invoke-RestMethod -Uri "$base/usuarios" -ErrorAction Stop
} catch {
    Write-Output $_.Exception.Response.StatusCode.value__
    Write-Output $_.ErrorDetails.Message
}

Write-Output "404 usuario id invalido"
try {
    Invoke-RestMethod -Uri "$base/usuarios/perfil/$badId" -Headers $headers -ErrorAction Stop
} catch {
    Write-Output $_.Exception.Response.StatusCode.value__
    Write-Output $_.ErrorDetails.Message
}

Write-Output "404 producto id invalido"
try {
    Invoke-RestMethod -Method Put -Uri "$base/productos/$badId" -ContentType "application/json" -Body (@{ nombre = "X"; precio = 1 } | ConvertTo-Json) -ErrorAction Stop
} catch {
    Write-Output $_.Exception.Response.StatusCode.value__
    Write-Output $_.ErrorDetails.Message
}

Write-Output "actualizar password"
$updateBody = @{ password = "newpass123" } | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "$base/usuarios/$($login.usuario.id)" -Headers $headers -ContentType "application/json" -Body $updateBody

Write-Output "login con password vieja"
$loginOld = @{ email = $reg.usuario.email; password = "password123" } | ConvertTo-Json
try {
    Invoke-RestMethod -Method Post -Uri "$base/usuarios/login" -ContentType "application/json" -Body $loginOld -ErrorAction Stop
} catch {
    Write-Output $_.Exception.Response.StatusCode.value__
    Write-Output $_.ErrorDetails.Message
}

Write-Output "login con password nueva"
$loginNew = @{ email = $reg.usuario.email; password = "newpass123" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$base/usuarios/login" -ContentType "application/json" -Body $loginNew

Write-Output "validacion email duplicado"
try {
    Invoke-RestMethod -Method Post -Uri "$base/usuarios/register" -ContentType "application/json" -Body $userBody -ErrorAction Stop
} catch {
    Write-Output $_.Exception.Response.StatusCode.value__
    Write-Output $_.ErrorDetails.Message
}

Write-Output "validacion campos faltantes"
$missingBody = @{ email = "missing$rand@ejemplo.com" } | ConvertTo-Json
try {
    Invoke-RestMethod -Method Post -Uri "$base/usuarios/register" -ContentType "application/json" -Body $missingBody -ErrorAction Stop
} catch {
    Write-Output $_.Exception.Response.StatusCode.value__
    Write-Output $_.ErrorDetails.Message
}
