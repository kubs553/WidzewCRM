#!/bin/bash

echo "🔄 Resetting database and running full seed..."

# Reset database
echo "🗑️ Resetting database..."
npx prisma migrate reset --force

# Run full seed
echo "🌱 Running full seed..."
npx tsx prisma/seed.ts

echo "✅ Database reset and seeded successfully!"
echo ""
echo "📋 Test accounts:"
echo "Admin: admin@widzew.com / admin123"
echo "BOK: bok1@widzew.com / bok123"
echo "Marketing: marketing1@widzew.com / marketing123"
echo "Sales: sales1@widzew.com / sales123"
echo ""
echo "🚀 You can now start the app with: npm run dev"
