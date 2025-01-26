#!/bin/bash

echo "🚀 Starting the application..."

# Navigate to the backend folder and start the server
cd backend
echo "📡 Installing backend dependencies..."
npm install
echo "🔄 Running database migrations..."
npx sequelize-cli db:migrate
echo "🌱 Seeding the database..."
npx sequelize-cli db:seed:all
echo "🚀 Starting backend..."
nohup npm start &

# Navigate to the frontend folder and start the client
cd ../frontend
echo "📦 Installing frontend dependencies..."
npm install
echo "🌍 Starting frontend..."
nohup npm start &

echo "✅ Application started successfully!"