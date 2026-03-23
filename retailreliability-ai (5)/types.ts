
export enum AppRole {
  IDEA_PLAN = 'IDEA_PLAN',
  SHOP_OWNER = 'SHOP_OWNER',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  COMPLAINTS = 'COMPLAINTS',
  DEMO = 'DEMO'
}

export interface Product {
  id: string;
  name: string;
  category: string;
  inStock: boolean;
  quantity: number;
  lastUpdated: string;
}

export interface UpdateLog {
  id: string;
  itemName: string;
  status: 'In Stock' | 'Out of Stock' | 'Sale';
  prevQty?: number;
  newQty?: number;
  timestamp: string;
}

export interface Complaint {
  id: string;
  shopId: string;
  shopName: string;
  productName: string;
  issueType: 'Not in stock' | 'Wrong info' | 'Late update' | 'Poor service';
  comment: string;
  timestamp: string;
  status: 'Pending' | 'Verified' | 'Resolved' | 'Rejected';
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  reliabilityScore: number;
  inventory: Product[];
  lastUpdateFrequency: number; // updates per week
  pastAccuracy: number; // 0-1
  customerFeedbackScore: number; // 0-1
  incentivesEarned: number;
  complaintsCount: number;
}

export interface PredictionResult {
  score: number;
  reasoning: string;
  incentiveTier: 'High' | 'Medium' | 'Low' | 'None';
}
