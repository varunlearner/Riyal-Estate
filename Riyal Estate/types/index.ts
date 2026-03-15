// Shared types used across client and server

// User Types
export interface IUser {
  _id: string;
  firebaseUid: string;
  email: string;
  phone?: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'owner' | 'agent' | 'admin';
  isVerified: boolean;
  isActive: boolean;
  savedProperties: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile {
  _id: string;
  firebaseUid: string;
  email: string;
  phone?: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'owner' | 'agent' | 'admin';
  isVerified: boolean;
  savedPropertiesCount: number;
  inquiriesCount: number;
  listingsCount: number;
}

// Property Types
export interface IProperty {
  _id: string;
  title: string;
  description: string;
  propertyType: 'apartment' | 'villa' | 'house' | 'plot' | 'commercial' | 'office';
  listingType: 'sale' | 'rent';
  price: number;
  pricePerSqFt?: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  furnished: 'furnished' | 'semi-furnished' | 'unfurnished';
  possession: 'ready' | 'under-construction';
  possessionDate?: Date;
  floor?: number;
  totalFloors?: number;
  parking?: number;
  age?: string;
  address: {
    street: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  images: string[];
  videoTour?: string;
  owner: {
    userId: string;
    name: string;
    phone: string;
    email: string;
    photo?: string;
  };
  agent?: {
    userId: string;
    name: string;
    phone: string;
    email: string;
    company?: string;
    photo?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'sold' | 'rented';
  isFeatured: boolean;
  featuredUntil?: Date;
  views: number;
  inquiries: number;
  shortlists: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPropertyFormData {
  title: string;
  description: string;
  propertyType: string;
  listingType: string;
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  furnished: string;
  possession: string;
  possessionDate?: string;
  floor?: number;
  totalFloors?: number;
  parking?: number;
  age?: string;
  address: {
    street: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  images: string[];
}

// Lead Types
export interface ILead {
  _id: string;
  propertyId: string;
  propertyTitle: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  message: string;
  status: 'new' | 'contacted' | 'visited' | 'negotiating' | 'closed' | 'rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Saved Property Types
export interface ISavedProperty {
  _id: string;
  userId: string;
  propertyId: string;
  createdAt: Date;
}

// Agent Profile Types
export interface IAgentProfile {
  _id: string;
  userId: string;
  company?: string;
  license?: string;
  experience?: number;
  specializations: string[];
  areas: string[];
  about?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Search Filters
export interface ISearchFilters {
  city?: string;
  locality?: string;
  listingType?: 'sale' | 'rent' | 'all';
  propertyType?: string[];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number[];
  bathrooms?: number[];
  furnished?: string[];
  possession?: string[];
  amenities?: string[];
  minPricePerSqFt?: number;
  maxPricePerSqFt?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth Types
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

// EMI Calculator
export interface EMICalculation {
  principal: number;
  interestRate: number;
  tenure: number;
  emi: number;
  totalInterest: number;
  totalAmount: number;
}

// Compare Properties
export interface PropertyComparison {
  properties: IProperty[];
  differences: {
    [key: string]: boolean;
  };
}

// Dashboard Stats
export interface DashboardStats {
  totalProperties: number;
  activeListings: number;
  totalInquiries: number;
  totalViews: number;
  featuredListings: number;
  pendingApprovals: number;
  recentInquiries: ILead[];
  recentProperties: IProperty[];
}

// Admin Stats
export interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  pendingProperties: number;
  totalLeads: number;
  featuredProperties: number;
  totalRevenue: number;
  usersByRole: {
    user: number;
    owner: number;
    agent: number;
  };
  propertiesByStatus: {
    pending: number;
    approved: number;
    rejected: number;
    sold: number;
    rented: number;
  };
  propertiesByCity: {
    city: string;
    count: number;
  }[];
  monthlyStats: {
    month: string;
    properties: number;
    leads: number;
    users: number;
  }[];
}

// Amenity Options
export const AMENITY_OPTIONS = [
  'Air Conditioning',
  'Power Backup',
  'Lift',
  'Security',
  'Gym',
  'Swimming Pool',
  'Club House',
  'Parking',
  'Garden',
  'Play Area',
  'Intercom',
  'Fire Safety',
  'Rain Water Harvesting',
  'Solar Panels',
  'WiFi',
  'Modular Kitchen',
  'Wardrobes',
  'TV',
  'Refrigerator',
  'Washing Machine',
  'Microwave',
  'Geyser',
  'Dining Table',
  'Sofa',
  'Bed',
  'Curtains',
  'Fans',
  'Lights',
] as const;

// Property Type Options
export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment', icon: 'Building' },
  { value: 'villa', label: 'Villa', icon: 'Home' },
  { value: 'house', label: 'Independent House', icon: 'House' },
  { value: 'plot', label: 'Plot/Land', icon: 'Square' },
  { value: 'commercial', label: 'Commercial Shop', icon: 'Store' },
  { value: 'office', label: 'Office Space', icon: 'Briefcase' },
] as const;

// City Options (Major Indian Cities)
export const INDIAN_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Surat',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Pimpri-Chinchwad',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot',
  'Kalyan-Dombivli',
  'Vasai-Virar',
  'Varanasi',
  'Srinagar',
  'Aurangabad',
  'Dhanbad',
  'Amritsar',
  'Navi Mumbai',
  'Allahabad',
  'Ranchi',
  'Howrah',
  'Coimbatore',
  'Jabalpur',
  'Gwalior',
  'Vijayawada',
  'Jodhpur',
  'Madurai',
  'Raipur',
  'Kota',
  'Guwahati',
  'Chandigarh',
  'Solapur',
  'Hubli-Dharwad',
  'Tiruchirappalli',
  'Bareilly',
  'Mysore',
  'Tiruppur',
  'Gurgaon',
  'Noida',
  'Greater Noida',
  'Thiruvananthapuram',
] as const;

// Furnished Options
export const FURNISHED_OPTIONS = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi-furnished', label: 'Semi-Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
] as const;

// Possession Options
export const POSSESSION_OPTIONS = [
  { value: 'ready', label: 'Ready to Move' },
  { value: 'under-construction', label: 'Under Construction' },
] as const;

// Bedroom Options
export const BEDROOM_OPTIONS = [
  { value: 1, label: '1 BHK' },
  { value: 2, label: '2 BHK' },
  { value: 3, label: '3 BHK' },
  { value: 4, label: '4 BHK' },
  { value: 5, label: '5+ BHK' },
] as const;

// Price Range Options
export const PRICE_RANGES = {
  sale: [
    { min: 0, max: 2000000, label: 'Under ₹20 Lac' },
    { min: 2000000, max: 5000000, label: '₹20 Lac - ₹50 Lac' },
    { min: 5000000, max: 10000000, label: '₹50 Lac - ₹1 Cr' },
    { min: 10000000, max: 20000000, label: '₹1 Cr - ₹2 Cr' },
    { min: 20000000, max: 50000000, label: '₹2 Cr - ₹5 Cr' },
    { min: 50000000, max: Infinity, label: '₹5 Cr+' },
  ],
  rent: [
    { min: 0, max: 10000, label: 'Under ₹10,000' },
    { min: 10000, max: 20000, label: '₹10,000 - ₹20,000' },
    { min: 20000, max: 30000, label: '₹20,000 - ₹30,000' },
    { min: 30000, max: 50000, label: '₹30,000 - ₹50,000' },
    { min: 50000, max: 100000, label: '₹50,000 - ₹1 Lac' },
    { min: 100000, max: Infinity, label: '₹1 Lac+' },
  ],
} as const;

// Area Range Options
export const AREA_RANGES = [
  { min: 0, max: 500, label: 'Under 500 sq.ft' },
  { min: 500, max: 1000, label: '500 - 1000 sq.ft' },
  { min: 1000, max: 1500, label: '1000 - 1500 sq.ft' },
  { min: 1500, max: 2000, label: '1500 - 2000 sq.ft' },
  { min: 2000, max: 3000, label: '2000 - 3000 sq.ft' },
  { min: 3000, max: Infinity, label: '3000+ sq.ft' },
] as const;
