import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface QueryFilter {
  [key: string]: any;
}

interface SortOptions {
  [key: string]: 1 | -1;
}

class JSONDatabase {
  private getCollectionPath(collection: string): string {
    return path.join(DATA_DIR, `${collection}.json`);
  }

  private readCollection(collection: string): any[] {
    const filePath = this.getCollectionPath(collection);
    try {
      if (!fs.existsSync(filePath)) {
        return [];
      }
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading collection ${collection}:`, error);
      return [];
    }
  }

  private writeCollection(collection: string, data: any[]): void {
    const filePath = this.getCollectionPath(collection);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  private matchesFilter(doc: any, filter: QueryFilter): boolean {
    for (const [key, value] of Object.entries(filter)) {
      if (key === '$or') {
        const conditions = value as QueryFilter[];
        if (!conditions.some(cond => this.matchesFilter(doc, cond))) {
          return false;
        }
      } else if (key === '$and') {
        const conditions = value as QueryFilter[];
        if (!conditions.every(cond => this.matchesFilter(doc, cond))) {
          return false;
        }
      } else if (key === '$all') {
        // Array contains all values
        const targetArray = this.getNestedValue(doc, key.replace('$all', ''));
        if (!Array.isArray(targetArray)) return false;
        const requiredValues = Array.isArray(value) ? value : [value];
        return requiredValues.every(v => targetArray.includes(v));
      } else {
        const docValue = this.getNestedValue(doc, key);
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Handle MongoDB operators
          if (value.$regex) {
            const regex = new RegExp(value.$regex, value.$options || '');
            if (!regex.test(String(docValue))) return false;
          } else if ('$gte' in value) {
            if (docValue < value.$gte) return false;
          } else if ('$lte' in value) {
            if (docValue > value.$lte) return false;
          } else if ('$gt' in value) {
            if (docValue <= value.$gt) return false;
          } else if ('$lt' in value) {
            if (docValue >= value.$lt) return false;
          } else if ('$eq' in value) {
            if (docValue !== value.$eq) return false;
          } else if ('$ne' in value) {
            if (docValue === value.$ne) return false;
          } else if ('$in' in value) {
            if (!value.$in.includes(docValue)) return false;
          } else if ('$nin' in value) {
            if (value.$nin.includes(docValue)) return false;
          }
        } else {
          if (docValue !== value) return false;
        }
      }
    }
    return true;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }

  // @ts-ignore - Used for potential future sorting operations
  private sortDocuments(docs: any[], sort: SortOptions): any[] {
    const sortEntries = Object.entries(sort);
    return docs.sort((a, b) => {
      for (const [key, order] of sortEntries) {
        const aVal = this.getNestedValue(a, key);
        const bVal = this.getNestedValue(b, key);

        let comparison = 0;
        if (aVal < bVal) comparison = -1;
        else if (aVal > bVal) comparison = 1;

        if (comparison !== 0) {
          return order === -1 ? -comparison : comparison;
        }
      }
      return 0;
    });
  }

  async find(collection: string, filter: QueryFilter = {}) {
    const data = this.readCollection(collection);
    return data.filter(doc => this.matchesFilter(doc, filter));
  }

  async findOne(collection: string, filter: QueryFilter) {
    const results = await this.find(collection, filter);
    return results[0] || null;
  }

  async findById(collection: string, id: string) {
    return this.findOne(collection, { _id: id });
  }

  async insertOne(collection: string, document: any) {
    const data = this.readCollection(collection);
    const newDoc = {
      ...document,
      _id: document._id || uuidv4(),
      createdAt: document.createdAt || new Date().toISOString(),
      updatedAt: document.updatedAt || new Date().toISOString(),
    };
    data.push(newDoc);
    this.writeCollection(collection, data);
    return { insertedId: newDoc._id };
  }

  async insertMany(collection: string, documents: any[]) {
    const data = this.readCollection(collection);
    const insertedIds: string[] = [];

    for (const doc of documents) {
      const newDoc = {
        ...doc,
        _id: doc._id || uuidv4(),
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: doc.updatedAt || new Date().toISOString(),
      };
      data.push(newDoc);
      insertedIds.push(newDoc._id);
    }

    this.writeCollection(collection, data);
    return { insertedIds };
  }

  async updateOne(
    collection: string,
    filter: QueryFilter,
    update: any
  ) {
    const data = this.readCollection(collection);
    const index = data.findIndex(doc => this.matchesFilter(doc, filter));

    if (index === -1) return { modifiedCount: 0 };

    const updateOps = update.$set || update;
    for (const [key, value] of Object.entries(updateOps)) {
      this.setNestedValue(data[index], key, value);
    }
    data[index].updatedAt = new Date().toISOString();

    this.writeCollection(collection, data);
    return { modifiedCount: 1 };
  }

  async updateMany(
    collection: string,
    filter: QueryFilter,
    update: any
  ) {
    const data = this.readCollection(collection);
    const updateOps = update.$set || update;
    let modifiedCount = 0;

    for (const doc of data) {
      if (this.matchesFilter(doc, filter)) {
        for (const [key, value] of Object.entries(updateOps)) {
          this.setNestedValue(doc, key, value);
        }
        doc.updatedAt = new Date().toISOString();
        modifiedCount++;
      }
    }

    this.writeCollection(collection, data);
    return { modifiedCount };
  }

  async deleteOne(collection: string, filter: QueryFilter) {
    const data = this.readCollection(collection);
    const index = data.findIndex(doc => this.matchesFilter(doc, filter));

    if (index === -1) return { deletedCount: 0 };

    data.splice(index, 1);
    this.writeCollection(collection, data);
    return { deletedCount: 1 };
  }

  async deleteMany(collection: string, filter: QueryFilter) {
    const data = this.readCollection(collection);
    const originalLength = data.length;
    const filtered = data.filter(doc => !this.matchesFilter(doc, filter));
    const deletedCount = originalLength - filtered.length;

    this.writeCollection(collection, filtered);
    return { deletedCount };
  }

  async countDocuments(collection: string, filter: QueryFilter = {}) {
    const data = this.readCollection(collection);
    return data.filter(doc => this.matchesFilter(doc, filter)).length;
  }

  async distinct(collection: string, field: string, filter: QueryFilter = {}) {
    const data = this.readCollection(collection);
    const filtered = data.filter(doc => this.matchesFilter(doc, filter));
    const values = filtered.map(doc => this.getNestedValue(doc, field));
    return [...new Set(values)];
  }

  // Query builder methods
  async query(collection: string) {
    return new QueryBuilder(this, collection);
  }
}

class QueryBuilder {
  private db: JSONDatabase;
  private collection: string;
  private filter: QueryFilter = {};
  private sortOptions: SortOptions = {};
  private pagination = { skip: 0, limit: 0 };

  constructor(db: JSONDatabase, collection: string) {
    this.db = db;
    this.collection = collection;
  }

  where(filter: QueryFilter) {
    this.filter = { ...this.filter, ...filter };
    return this;
  }

  sort(sort: SortOptions) {
    this.sortOptions = sort;
    return this;
  }

  skip(n: number) {
    this.pagination.skip = n;
    return this;
  }

  limit(n: number) {
    this.pagination.limit = n;
    return this;
  }

  async find() {
    let results = await this.db.find(this.collection, this.filter);
    
    if (Object.keys(this.sortOptions).length > 0) {
      results = this.sortResults(results);
    }

    if (this.pagination.skip > 0) {
      results = results.slice(this.pagination.skip);
    }

    if (this.pagination.limit > 0) {
      results = results.slice(0, this.pagination.limit);
    }

    return results;
  }

  async findOne() {
    const results = await this.find();
    return results[0] || null;
  }

  async count() {
    return this.db.countDocuments(this.collection, this.filter);
  }

  private sortResults(docs: any[]): any[] {
    return docs.sort((a, b) => {
      for (const [key, order] of Object.entries(this.sortOptions)) {
        const aVal = this.getNestedValue(a, key);
        const bVal = this.getNestedValue(b, key);

        let comparison = 0;
        if (aVal < bVal) comparison = -1;
        else if (aVal > bVal) comparison = 1;

        if (comparison !== 0) {
          return order === -1 ? -comparison : comparison;
        }
      }
      return 0;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
}

const jsonDB = new JSONDatabase();

export default jsonDB;
