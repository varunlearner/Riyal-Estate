import { IAgentProfile } from '@/types';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const DB_PATH = path.join(process.cwd(), 'data', 'agent-profiles.json');

function readAgentProfiles(): IAgentProfile[] {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeAgentProfiles(profiles: IAgentProfile[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(profiles, null, 2));
}

const AgentProfile = {
  findAll(): IAgentProfile[] {
    return readAgentProfiles();
  },

  findById(id: string): IAgentProfile | null {
    return readAgentProfiles().find((a) => a._id === id) || null;
  },

  findByUserId(userId: string): IAgentProfile | null {
    return readAgentProfiles().find((a) => a.userId === userId) || null;
  },

  findVerified(): IAgentProfile[] {
    return readAgentProfiles().filter((a) => a.verified);
  },

  create(data: Omit<IAgentProfile, '_id' | 'createdAt' | 'updatedAt'>): IAgentProfile {
    const existing = this.findByUserId(data.userId);
    if (existing) return existing;

    const profiles = readAgentProfiles();
    const newProfile: IAgentProfile = {
      ...data,
      _id: randomUUID(),
      verified: false,
      specializations: data.specializations || [],
      areas: data.areas || [],
      ratings: { average: 0, count: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    profiles.push(newProfile as any);
    writeAgentProfiles(profiles as any);
    return newProfile;
  },

  update(id: string, data: Partial<IAgentProfile>): IAgentProfile | null {
    const profiles = readAgentProfiles();
    const index = profiles.findIndex((a) => a._id === id);
    if (index === -1) return null;
    profiles[index] = { 
      ...profiles[index], 
      ...data, 
      updatedAt: new Date() 
    };
    writeAgentProfiles(profiles as any);
    return profiles[index];
  },

  delete(id: string): boolean {
    const profiles = readAgentProfiles();
    const filtered = profiles.filter((a) => a._id !== id);
    if (filtered.length === profiles.length) return false;
    writeAgentProfiles(filtered);
    return true;
  },
};

export default AgentProfile;