-- Migration: create day_ratings table
-- Run with: psql "$DATABASE_URL" -f drizzle/migrations/0001_add_day_ratings.sql

CREATE TABLE IF NOT EXISTS day_ratings (
  day DATE PRIMARY KEY,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
