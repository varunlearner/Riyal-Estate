import { IProperty } from '@/types';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'properties.json');

function readProperties(): IProperty[] {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeProperties(properties: IProperty[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(properties, null, 2));
}

const Property = {
  findAll(): IProperty[] {
    return readProperties();
  },

  findById(id: string): IProperty | null {
    return readProperties().find((p) => p._id === id) || null;
  },

  findFeatured(limit = 6): IProperty[] {
    return readProperties()
      .filter((p) => p.isFeatured && p.status === 'approved')
      .slice(0, limit);
  },

  findByOwner(userId: string): IProperty[] {
    return readProperties().filter((p) => p.owner.userId === userId);
  },

  search(filters: Partial<{
    city: string;
    listingType: string;
    propertyType: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
    status: string;
    q: string;
  }>): IProperty[] {
    let results = readProperties();

    if (filters.status) {
      results = results.filter((p) => p.status === filters.status);
    } else {
      results = results.filter((p) => p.status === 'approved');
    }

    if (filters.city) {
      results = results.filter((p) =>
        p.address.city.toLowerCase() === filters.city!.toLowerCase()
      );
    }

    if (filters.listingType) {
      results = results.filter((p) => p.listingType === filters.listingType);
    }

    if (filters.propertyType) {
      results = results.filter((p) => p.propertyType === filters.propertyType);
    }

    if (filters.minPrice !== undefined) {
      results = results.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.bedrooms !== undefined) {
      results = results.filter((p) => p.bedrooms === filters.bedrooms);
    }

    if (filters.q) {
      const q = filters.q.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.address.locality.toLowerCase().includes(q) ||
          p.address.city.toLowerCase().includes(q)
      );
    }

    return results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  create(data: Omit<IProperty, '_id' | 'createdAt' | 'updatedAt'>): IProperty {
    const properties = readProperties();
    const newProperty: IProperty = {
      ...data,
      _id: crypto.randomUUID(),
      views: 0,
      inquiries: 0,
      shortlists: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as IProperty;
    properties.push(newProperty);
    writeProperties(properties);
    return newProperty;
  },

  update(id: string, data: Partial<IProperty>): IProperty | null {
    const properties = readProperties();
    const index = properties.findIndex((p) => p._id === id);
    if (index === -1) return null;
    properties[index] = { ...properties[index], ...data, updatedAt: new Date().toISOString() };
    writeProperties(properties);
    return properties[index];
  },

  incrementViews(id: string): void {
    const properties = readProperties();
    const index = properties.findIndex((p) => p._id === id);
    if (index !== -1) {
      properties[index].views = (properties[index].views || 0) + 1;
      writeProperties(properties);
    }
  },

  delete(id: string): boolean {
    const properties = readProperties();
    const filtered = properties.filter((p) => p._id !== id);
    if (filtered.length === properties.length) return false;
    writeProperties(filtered);
    return true;
  },
};

export default Property;