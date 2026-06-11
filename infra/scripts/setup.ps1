Write-Host "🚀 Setting up Set Piece Platform..." -ForegroundColor Green

Write-Host "📦 Installing dependencies..."
Set-Location ..
pnpm install

Write-Host "🗄️  Generating Prisma client..."
Set-Location packages\db
npx prisma generate

Write-Host "🗄️  Running migrations..."
npx prisma migrate dev --name init

Write-Host "🌱 Seeding database..."
npx tsx seed.ts

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host "Run 'pnpm dev' to start all services" -ForegroundColor Yellow
