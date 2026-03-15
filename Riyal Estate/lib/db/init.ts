/**
 * Database Initialization
 * For JSON database, no initialization needed - auto-initialized
 * This is a stub for backward compatibility with existing routes
 */

async function initDB(): Promise<void> {
  // JSON database auto-initializes
  // No MongoDB connection needed
  console.log('Database ready (JSON)');
}

export default initDB;
