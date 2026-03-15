// MongoDB connection disabled - using JSON database instead
// This file is kept for legacy support but not used

import mongoose from 'mongoose';

console.log('📄 Using JSON file database (MongoDB disabled)');

export async function connectDB() {
  return mongoose;
}
