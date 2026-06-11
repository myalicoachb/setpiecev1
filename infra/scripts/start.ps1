param(
  [ValidateSet("dev", "docker", "prod")]
  [string]$Mode = "dev"
)

switch ($Mode) {
  "dev" {
    Write-Host "Starting development environment..." -ForegroundColor Green
    Set-Location ..
    pnpm dev
  }
  "docker" {
    Write-Host "Starting Docker environment..." -ForegroundColor Green
    docker-compose up --build -d
  }
  "prod" {
    Write-Host "Starting production..." -ForegroundColor Green
    Set-Location ..
    pnpm build
    pnpm start
  }
}
