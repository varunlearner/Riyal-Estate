import jsonDB from './json-db';

// JSON Database Only - MongoDB code removed
type QueryFilter = Record<string, any>;
type SortOptions = Record<string, 1 | -1>;

interface FindOptions {
  sort?: SortOptions;
  skip?: number;
  limit?: number;
  lean?: boolean;
}

/**
 * Repository pattern using JSON database only
 */
class Repository {
  private collection: string;

  constructor(collectionName: string) {
    this.collection = collectionName;
  }

  async find(filter: QueryFilter = {}, options: FindOptions = {}) {
    // Use JSON database
    let results = await jsonDB.find(this.collection, filter);

    if (options.sort) {
      const sortEntries = Object.entries(options.sort);
      results = results.sort((a, b) => {
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

    if (options.skip) results = results.slice(options.skip);
    if (options.limit) results = results.slice(0, options.limit);

    return results;
  }

  async findOne(filter: QueryFilter) {
    return jsonDB.findOne(this.collection, filter);
  }

  async findById(id: string) {
    return jsonDB.findById(this.collection, id);
  }

  async countDocuments(filter: QueryFilter = {}) {
    return jsonDB.countDocuments(this.collection, filter);
  }

  async insertOne(document: any) {
    return jsonDB.insertOne(this.collection, document);
  }

  async insertMany(documents: any[]) {
    return jsonDB.insertMany(this.collection, documents);
  }

  async updateOne(filter: QueryFilter, update: any) {
    return jsonDB.updateOne(this.collection, filter, update);
  }

  async updateMany(filter: QueryFilter, update: any) {
    return jsonDB.updateMany(this.collection, filter, update);
  }

  async deleteOne(filter: QueryFilter) {
    return jsonDB.deleteOne(this.collection, filter);
  }

  async deleteMany(filter: QueryFilter) {
    return jsonDB.deleteMany(this.collection, filter);
  }

  async distinct(field: string, filter: QueryFilter = {}) {
    return jsonDB.distinct(this.collection, field, filter);
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
}

export default Repository;
