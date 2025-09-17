#!/bin/bash

echo "🚀 Setting up Widzew CRM..."

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker Desktop first."
    echo "   Visit: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker found"

# Start services
echo "🐳 Starting PostgreSQL and Mailpit..."
docker compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Run migrations
echo "📊 Running database migrations..."
npm run db:migrate

# Seed database
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Access points:"
echo "   • Application: http://localhost:3000"
echo "   • Admin Panel: http://localhost:3000/admin"
echo "   • Mailpit (Email): http://localhost:8025"
echo "   • Prisma Studio: npm run db:studio"
echo ""
echo "👤 Test accounts:"
echo "   • Admin: admin@widzew.com / admin123"
echo "   • BOK: bok1@widzew.com / bok123"
echo "   • Marketing: marketing1@widzew.com / marketing123"
echo ""
echo "🚀 Start development server:"
echo "   npm run dev"
