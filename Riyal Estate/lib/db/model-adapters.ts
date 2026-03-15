import Repository from './repository';
import { User, Property, Lead, SavedProperty } from '@/models/models';

// Using JSON database only
const USE_JSON_DB = true;

/**
 * Model adapters that provide a unified interface for both MongoDB and JSON databases
 * These adapters wrap the Mongoose models and fall back to JSON database operations
 */

export class UserAdapter {
  private repo: Repository;

  constructor() {
    this.repo = new Repository('users');
  }

  find(filter?: any, options?: any) {
    return this.repo.find(filter || {}, options);
  }

  findOne(filter: any) {
    return this.repo.findOne(filter);
  }

  findById(id: string) {
    return this.repo.findById(id);
  }

  countDocuments(filter?: any) {
    return this.repo.countDocuments(filter || {});
  }

  create(data: any) {
    if (!USE_JSON_DB) {
      return User.create(data);
    }
    return this.repo.insertOne(data);
  }

  insertMany(data: any[]) {
    return this.repo.insertMany(data);
  }

  updateOne(filter: any, update: any) {
    return this.repo.updateOne(filter, update);
  }

  updateMany(filter: any, update: any) {
    return this.repo.updateMany(filter, update);
  }

  deleteOne(filter: any) {
    return this.repo.deleteOne(filter);
  }

  deleteMany(filter: any) {
    return this.repo.deleteMany(filter);
  }

  distinct(field: string, filter?: any) {
    return this.repo.distinct(field, filter || {});
  }
}

export class PropertyAdapter {
  private repo: Repository;

  constructor() {
    this.repo = new Repository('properties');
  }

  find(filter?: any, options?: any) {
    return this.repo.find(filter || {}, options);
  }

  findOne(filter: any) {
    return this.repo.findOne(filter);
  }

  findById(id: string) {
    return this.repo.findById(id);
  }

  countDocuments(filter?: any) {
    return this.repo.countDocuments(filter || {});
  }

  create(data: any) {
    if (!USE_JSON_DB) {
      return Property.create(data);
    }
    return this.repo.insertOne(data);
  }

  insertMany(data: any[]) {
    return this.repo.insertMany(data);
  }

  updateOne(filter: any, update: any) {
    return this.repo.updateOne(filter, update);
  }

  updateMany(filter: any, update: any) {
    return this.repo.updateMany(filter, update);
  }

  deleteOne(filter: any) {
    return this.repo.deleteOne(filter);
  }

  deleteMany(filter: any) {
    return this.repo.deleteMany(filter);
  }

  distinct(field: string, filter?: any) {
    return this.repo.distinct(field, filter || {});
  }
}

export class LeadAdapter {
  private repo: Repository;

  constructor() {
    this.repo = new Repository('leads');
  }

  find(filter?: any, options?: any) {
    return this.repo.find(filter || {}, options);
  }

  findOne(filter: any) {
    return this.repo.findOne(filter);
  }

  findById(id: string) {
    return this.repo.findById(id);
  }

  countDocuments(filter?: any) {
    return this.repo.countDocuments(filter || {});
  }

  create(data: any) {
    if (!USE_JSON_DB) {
      return Lead.create(data);
    }
    return this.repo.insertOne(data);
  }

  insertMany(data: any[]) {
    return this.repo.insertMany(data);
  }

  updateOne(filter: any, update: any) {
    return this.repo.updateOne(filter, update);
  }

  updateMany(filter: any, update: any) {
    return this.repo.updateMany(filter, update);
  }

  deleteOne(filter: any) {
    return this.repo.deleteOne(filter);
  }

  deleteMany(filter: any) {
    return this.repo.deleteMany(filter);
  }

  distinct(field: string, filter?: any) {
    return this.repo.distinct(field, filter || {});
  }
}

export class SavedPropertyAdapter {
  private repo: Repository;

  constructor() {
    this.repo = new Repository('saved-properties');
  }

  find(filter?: any, options?: any) {
    return this.repo.find(filter || {}, options);
  }

  findOne(filter: any) {
    return this.repo.findOne(filter);
  }

  findById(id: string) {
    return this.repo.findById(id);
  }

  countDocuments(filter?: any) {
    return this.repo.countDocuments(filter || {});
  }

  create(data: any) {
    if (!USE_JSON_DB) {
      return SavedProperty.create(data);
    }
    return this.repo.insertOne(data);
  }

  insertMany(data: any[]) {
    return this.repo.insertMany(data);
  }

  updateOne(filter: any, update: any) {
    return this.repo.updateOne(filter, update);
  }

  updateMany(filter: any, update: any) {
    return this.repo.updateMany(filter, update);
  }

  deleteOne(filter: any) {
    return this.repo.deleteOne(filter);
  }

  deleteMany(filter: any) {
    return this.repo.deleteMany(filter);
  }

  distinct(field: string, filter?: any) {
    return this.repo.distinct(field, filter || {});
  }
}

// Export singleton instances
export const userAdapter = new UserAdapter();
export const propertyAdapter = new PropertyAdapter();
export const leadAdapter = new LeadAdapter();
export const savedPropertyAdapter = new SavedPropertyAdapter();
