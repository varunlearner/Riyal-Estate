// Using JSON Database - Models are just TypeScript interfaces
// See /types for interface definitions

// This file is kept for reference but not used
export const SavedPropertySchema = (
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    propertyId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate saves
SavedPropertySchema.index({ userId: 1, propertyId: 1 }, { unique: true });

// JSON Database is used instead - no MongoDB models needed
