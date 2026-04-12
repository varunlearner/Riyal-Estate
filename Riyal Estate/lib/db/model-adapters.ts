import Repository from './repository';

/**
 * Model adapters that provide a unified interface for JSON database operations
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
