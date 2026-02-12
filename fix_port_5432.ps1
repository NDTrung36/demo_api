# ============================================================
#  fix_port_5432.ps1 - Kill Switch for Port 5432 Conflicts
# ============================================================
#  Usage:  .\fix_port_5432.ps1          (run as Administrator)
# ============================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Port 5432 Kill-Switch and Docker Reset" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Find and kill any process on port 5432
Write-Host "[1/3] Checking for processes on port 5432..." -ForegroundColor Yellow

$connections = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue |
Where-Object { $_.State -eq 'Listen' }

if ($connections) {
    $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($pid in $pids) {
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($proc) { $procName = $proc.ProcessName } else { $procName = "Unknown" }
        Write-Host "  Found: PID $pid ($procName) listening on 5432" -ForegroundColor Red
        Write-Host "  Killing PID $pid..." -ForegroundColor Red
        taskkill /F /PID $pid 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  PID $pid killed successfully." -ForegroundColor Green
        }
        else {
            Write-Host "  Failed to kill PID $pid. Try running as Administrator." -ForegroundColor Red
        }
    }
}
else {
    Write-Host "  No process found listening on port 5432. OK." -ForegroundColor Green
}

Start-Sleep -Seconds 1

# Step 2: Docker compose down with volume wipe
Write-Host ""
Write-Host "[2/3] Tearing down Docker containers and wiping volumes..." -ForegroundColor Yellow

docker compose down -v 2>&1 | ForEach-Object { Write-Host "  $_" }
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Docker containers stopped and volumes removed." -ForegroundColor Green
}
else {
    Write-Host "  docker compose down failed (is Docker running?)." -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 2

# Step 3: Docker compose up
Write-Host ""
Write-Host "[3/3] Starting fresh Docker containers..." -ForegroundColor Yellow

docker compose up -d 2>&1 | ForEach-Object { Write-Host "  $_" }
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Docker containers started." -ForegroundColor Green
}
else {
    Write-Host "  docker compose up failed." -ForegroundColor Red
    exit 1
}

# Wait for PostgreSQL to become ready
Write-Host ""
Write-Host "Waiting for PostgreSQL to become ready..." -ForegroundColor Yellow

$maxAttempts = 15
$attempt = 0
$ready = $false

while ($attempt -lt $maxAttempts) {
    $attempt++
    Start-Sleep -Seconds 2
    $health = docker inspect --format '{{.State.Health.Status}}' flight_booking_db 2>$null
    if ($health -eq "healthy") {
        $ready = $true
        break
    }
    Write-Host "  Attempt $attempt of $maxAttempts - status: $health" -ForegroundColor DarkGray
}

Write-Host ""
if ($ready) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS! PostgreSQL is ready.         " -ForegroundColor Green
    Write-Host "  DB:   flight_booking                  " -ForegroundColor Green
    Write-Host "  User: flightadmin                     " -ForegroundColor Green
    Write-Host "  Port: 5432                            " -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run:" -ForegroundColor White
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  .\mvnw spring-boot:run" -ForegroundColor White
}
else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  WARNING: PostgreSQL did not become    " -ForegroundColor Red
    Write-Host "  healthy within the timeout.           " -ForegroundColor Red
    Write-Host "  Run: docker logs flight_booking_db    " -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    exit 1
}
