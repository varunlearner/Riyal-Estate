import { ISavedProperty } from '@/types';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const DB_PATH = path.join(process.cwd(), 'data', 'saved-properties.json');

function readSavedProperties(): ISavedProperty[] {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeSavedProperties(properties: ISavedProperty[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(properties, null, 2));
}

const SavedProperty = {
  findAll(): ISavedProperty[] {
    return readSavedProperties();
  },

  findById(id: string): ISavedProperty | null {
    return readSavedProperties().find((p) => p._id === id) || null;
  },

  findByUser(userId: string): ISavedProperty[] {
    return readSavedProperties().filter((p) => p.userId === userId);
  },

  findByUserAndProperty(userId: string, propertyId: string): ISavedProperty | null {
    return readSavedProperties().find((p) => p.userId === userId && p.propertyId === propertyId) || null;
  },

  countByUser(userId: string): number {
    return readSavedProperties().filter((p) => p.userId === userId).length;
  },

  create(userId: string, propertyId: string): ISavedProperty {
    const saved = readSavedProperties();
    const existing = saved.find((p) => p.userId === userId && p.propertyId === propertyId);
    if (existing) return existing;

    const newSaved: ISavedProperty = {
      _id: randomUUID(),
      userId,
      propertyId,
      createdAt: new Date(),
    };
    saved.push(newSaved as any);
    writeSavedProperties(saved as any);
    return newSaved;
  },

  findOneAndDelete(id: string): boolean {
    const saved = readSavedProperties();
    const filtered = saved.filter((p) => p._id !== id);
    if (filtered.length === saved.length) return false;
    writeSavedProperties(filtered);
    return true;
  },

  deleteByUserAndProperty(userId: string, propertyId: string): boolean {
    const saved = readSavedProperties();
    const filtered = saved.filter((p) => !(p.userId === userId && p.propertyId === propertyId));
    if (filtered.length === saved.length) return false;
    writeSavedProperties(filtered);
    return true;
  },
};

export default SavedProperty;
