#!/usr/bin/env node

/**
 * JSON Database Setup Helper
 * 
 * This script helps initialize and manage the JSON database
 * Usage: npx ts-node scripts/setup-json-db.ts [command]
 */

import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

interface Command {
  name: string;
  description: string;
  action: () => Promise<void>;
}

const commands: Command[] = [
  {
    name: 'init',
    description: 'Initialize empty data files',
    action: initializeData,
  },
  {
    name: 'reset',
    description: 'Reset all data to empty arrays',
    action: resetData,
  },
  {
    name: 'status',
    description: 'Show database status and statistics',
    action: showStatus,
  },
  {
    name: 'sample',
    description: 'Add sample data for testing',
    action: addSampleData,
  },
  {
    name: 'clear',
    description: 'Clear all data (backup first!)',
    action: clearData,
  },
];

async function initializeData() {
  console.log('🔧 Initializing JSON database...\n');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✓ Created data directory');
  }

  const collections = [
    'users.json',
    'properties.json',
    'leads.json',
    'saved-properties.json',
    'agent-profiles.json',
  ];

  for (const collection of collections) {
    const filePath = path.join(dataDir, collection);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]', 'utf-8');
      console.log(`✓ Created ${collection}`);
    } else {
      console.log(`⊘ ${collection} already exists`);
    }
  }

  console.log('\n✓ Database initialization complete!');
  console.log('\nNext steps:');
  console.log('1. Update .env.local: USE_JSON_DB=true');
  console.log('2. Run: npm run dev');
}

async function resetData() {
  console.log('🔄 Resetting database to empty state...\n');

  if (!fs.existsSync(dataDir)) {
    console.log('⊘ Data directory does not exist. Run "init" first.');
    return;
  }

  const collections = [
    'users',
    'properties',
    'leads',
    'saved-properties',
    'agent-profiles',
  ];

  for (const collection of collections) {
    const filePath = path.join(dataDir, `${collection}.json`);
    fs.writeFileSync(filePath, '[]', 'utf-8');
    console.log(`✓ Reset ${collection}.json`);
  }

  console.log('\n✓ Database reset complete!');
}

async function clearData() {
  console.log('⚠️  WARNING: This will delete all data!\n');
  console.log('Backing up data before clearing...\n');

  if (!fs.existsSync(dataDir)) {
    console.log('⊘ No data directory found.');
    return;
  }

  const backupDir = path.join(dataDir, `backup-${new Date().getTime()}`);
  fs.mkdirSync(backupDir, { recursive: true });

  const files = fs.readdirSync(dataDir);
  let backupCount = 0;

  for (const file of files) {
    if (file.endsWith('.json') && file !== 'backup') {
      const source = path.join(dataDir, file);
      const dest = path.join(backupDir, file);
      fs.copyFileSync(source, dest);
      console.log(`✓ Backed up ${file}`);
      backupCount++;
    }
  }

  console.log(`\n✓ Backup created at: ${backupDir}`);
  console.log('\nClearing data...\n');

  await resetData();
}

async function showStatus() {
  console.log('📊 Database Status\n');

  if (!fs.existsSync(dataDir)) {
    console.log('⊘ Data directory does not exist');
    return;
  }

  const collections = [
    'users',
    'properties',
    'leads',
    'saved-properties',
    'agent-profiles',
  ];

  let totalRecords = 0;
  const stats = [];

  for (const collection of collections) {
    const filePath = path.join(dataDir, `${collection}.json`);
    
    try {
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const count = Array.isArray(data) ? data.length : 0;
        const size = fs.statSync(filePath).size;
        
        stats.push({
          collection: `${collection}.json`,
          records: count,
          size: `${(size / 1024).toFixed(2)} KB`,
        });
        
        totalRecords += count;
      } else {
        stats.push({
          collection: `${collection}.json`,
          records: 0,
          size: '0 KB',
        });
      }
    } catch (error) {
      console.error(`Error reading ${collection}:`, error);
    }
  }

  console.table(stats);
  console.log(`\n📈 Total Records: ${totalRecords}`);
  console.log(`📁 Data Directory: ${dataDir}`);
}

async function addSampleData() {
  console.log('📝 Adding sample data...\n');

  const sampleUsers = [
    {
      _id: 'user-1',
      firebaseUid: 'firebase-1',
      email: 'owner@example.com',
      displayName: 'John Owner',
      role: 'owner',
      isVerified: true,
      isActive: true,
      savedProperties: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'user-2',
      firebaseUid: 'firebase-2',
      email: 'buyer@example.com',
      displayName: 'Jane Buyer',
      role: 'user',
      isVerified: true,
      isActive: true,
      savedProperties: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const sampleProperties = [
    {
      _id: 'prop-1',
      title: 'Modern 3BHK Apartment',
      description: 'Spacious modern apartment in prime location',
      propertyType: 'apartment',
      listingType: 'sale',
      price: 5000000,
      pricePerSqFt: 5000,
      area: 1000,
      bedrooms: 3,
      bathrooms: 2,
      furnished: 'semi-furnished',
      possession: 'ready',
      address: {
        street: '123 Main St',
        locality: 'Downtown',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
      },
      location: { lat: 40.7128, lng: -74.006 },
      amenities: ['gym', 'pool', 'parking'],
      images: [],
      owner: {
        userId: 'user-1',
        name: 'John Owner',
        email: 'owner@example.com',
      },
      status: 'approved',
      isFeatured: true,
      views: 150,
      inquiries: 5,
      shortlists: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'prop-2',
      title: 'Luxury Villa with Garden',
      description: 'Beautiful villa with spacious garden',
      propertyType: 'villa',
      listingType: 'rent',
      price: 150000,
      pricePerSqFt: 150,
      area: 5000,
      bedrooms: 4,
      bathrooms: 3,
      furnished: 'furnished',
      possession: 'ready',
      address: {
        street: '456 Oak Ave',
        locality: 'Suburbs',
        city: 'Los Angeles',
        state: 'CA',
        pincode: '90001',
      },
      location: { lat: 34.0522, lng: -118.2437 },
      amenities: ['garden', 'pool', 'gym', 'security'],
      images: [],
      owner: {
        userId: 'user-1',
        name: 'John Owner',
        email: 'owner@example.com',
      },
      status: 'approved',
      isFeatured: false,
      views: 80,
      inquiries: 3,
      shortlists: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  try {
    const usersPath = path.join(dataDir, 'users.json');
    fs.writeFileSync(usersPath, JSON.stringify(sampleUsers, null, 2));
    console.log(`✓ Added ${sampleUsers.length} sample users`);

    const propertiesPath = path.join(dataDir, 'properties.json');
    fs.writeFileSync(propertiesPath, JSON.stringify(sampleProperties, null, 2));
    console.log(`✓ Added ${sampleProperties.length} sample properties`);

    console.log('\n✓ Sample data added successfully!');
    console.log('\nYou can now:');
    console.log('1. Run the application: npm run dev');
    console.log('2. Query the data using model adapters');
    console.log('3. Check data files in /data directory');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}

async function main() {
  const command = process.argv[2] || 'help';

  if (command === 'help' || command === '--help' || command === '-h') {
    console.log('JSON Database Setup Helper\n');
    console.log('Usage: npx ts-node scripts/setup-json-db.ts [command]\n');
    console.log('Commands:');
    commands.forEach(cmd => {
      console.log(`  ${cmd.name.padEnd(15)} - ${cmd.description}`);
    });
    console.log('\nExamples:');
    console.log('  npx ts-node scripts/setup-json-db.ts init');
    console.log('  npx ts-node scripts/setup-json-db.ts status');
    console.log('  npx ts-node scripts/setup-json-db.ts sample');
    return;
  }

  const cmd = commands.find(c => c.name === command);
  if (!cmd) {
    console.error(`Unknown command: ${command}`);
    console.log('Run with --help to see available commands');
    process.exit(1);
  }

  try {
    await cmd.action();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
