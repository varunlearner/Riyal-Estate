import { ILead } from '@/types';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'leads.json');

function readLeads(): ILead[] {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeLeads(leads: ILead[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(leads, null, 2));
}

const Lead = {
  findAll(): ILead[] {
    return readLeads();
  },

  findById(id: string): ILead | null {
    return readLeads().find((l) => l._id === id) || null;
  },

  findByBuyer(buyerId: string): ILead[] {
    return readLeads()
      .filter((l) => l.buyerId === buyerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  findBySeller(sellerId: string): ILead[] {
    return readLeads()
      .filter((l) => l.sellerId === sellerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  findByProperty(propertyId: string): ILead[] {
    return readLeads().filter((l) => l.propertyId === propertyId);
  },

  create(data: Omit<ILead, '_id' | 'createdAt' | 'updatedAt'>): ILead {
    const leads = readLeads();
    const newLead: ILead = {
      ...data,
      _id: crypto.randomUUID(),
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ILead;
    leads.push(newLead);
    writeLeads(leads);
    return newLead;
  },

  update(id: string, data: Partial<ILead>): ILead | null {
    const leads = readLeads();
    const index = leads.findIndex((l) => l._id === id);
    if (index === -1) return null;
    leads[index] = { ...leads[index], ...data, updatedAt: new Date().toISOString() };
    writeLeads(leads);
    return leads[index];
  },

  delete(id: string): boolean {
    const leads = readLeads();
    const filtered = leads.filter((l) => l._id !== id);
    if (filtered.length === leads.length) return false;
    writeLeads(filtered);
    return true;
  },
};

export default Lead;