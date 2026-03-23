
import { Shop, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // Dairy
  { id: 'p1', name: 'Milk 1L', category: 'Dairy', inStock: true, quantity: 10, lastUpdated: new Date().toISOString() },
  { id: 'p2', name: 'Eggs (Dozen)', category: 'Dairy', inStock: false, quantity: 0, lastUpdated: new Date().toISOString() },
  { id: 'p3', name: 'Greek Yogurt', category: 'Dairy', inStock: true, quantity: 5, lastUpdated: new Date().toISOString() },
  { id: 'p4', name: 'Cheddar Cheese', category: 'Dairy', inStock: true, quantity: 8, lastUpdated: new Date().toISOString() },
  
  // Bakery
  { id: 'p5', name: 'Whole Wheat Bread', category: 'Bakery', inStock: true, quantity: 12, lastUpdated: new Date().toISOString() },
  { id: 'p6', name: 'Butter Croissants', category: 'Bakery', inStock: true, quantity: 15, lastUpdated: new Date().toISOString() },
  { id: 'p7', name: 'Chocolate Chip Cookies', category: 'Bakery', inStock: true, quantity: 20, lastUpdated: new Date().toISOString() },
  
  // Produce
  { id: 'p8', name: 'Red Apples', category: 'Produce', inStock: true, quantity: 50, lastUpdated: new Date().toISOString() },
  { id: 'p9', name: 'Fresh Bananas', category: 'Produce', inStock: true, quantity: 30, lastUpdated: new Date().toISOString() },
  { id: 'p10', name: 'Organic Spinach', category: 'Produce', inStock: false, quantity: 0, lastUpdated: new Date().toISOString() },
  { id: 'p11', name: 'Roma Tomatoes', category: 'Produce', inStock: true, quantity: 25, lastUpdated: new Date().toISOString() },
  
  // Pantry
  { id: 'p12', name: 'Organic Honey', category: 'Pantry', inStock: true, quantity: 6, lastUpdated: new Date().toISOString() },
  { id: 'p13', name: 'Basmati Rice 5kg', category: 'Pantry', inStock: true, quantity: 10, lastUpdated: new Date().toISOString() },
  { id: 'p14', name: 'Olive Oil 500ml', category: 'Pantry', inStock: true, quantity: 8, lastUpdated: new Date().toISOString() },
  { id: 'p15', name: 'Spaghetti Pasta', category: 'Pantry', inStock: true, quantity: 15, lastUpdated: new Date().toISOString() },
  
  // Household
  { id: 'p16', name: 'Dish Soap', category: 'Household', inStock: true, quantity: 12, lastUpdated: new Date().toISOString() },
  { id: 'p17', name: 'Paper Towels', category: 'Household', inStock: true, quantity: 24, lastUpdated: new Date().toISOString() },
  { id: 'p18', name: 'AA Batteries', category: 'Household', inStock: true, quantity: 40, lastUpdated: new Date().toISOString() },
  
  // Pharmacy
  { id: 'p19', name: 'Pain Relief (24ct)', category: 'Pharmacy', inStock: true, quantity: 15, lastUpdated: new Date().toISOString() },
  { id: 'p20', name: 'First Aid Kit', category: 'Pharmacy', inStock: true, quantity: 5, lastUpdated: new Date().toISOString() },
  
  // Electronics
  { id: 'p21', name: 'USB-C Charging Cable', category: 'Electronics', inStock: true, quantity: 10, lastUpdated: new Date().toISOString() },
  { id: 'p22', name: 'Wireless Earbuds', category: 'Electronics', inStock: false, quantity: 0, lastUpdated: new Date().toISOString() },
];

export const MOCK_SHOPS: Shop[] = [
  {
    id: 's1',
    name: 'Green Grocers',
    address: '123 Market St',
    reliabilityScore: 0.92,
    inventory: [...INITIAL_PRODUCTS.filter(p => ['Dairy', 'Bakery', 'Produce', 'Pantry'].includes(p.category))],
    lastUpdateFrequency: 14,
    pastAccuracy: 0.95,
    customerFeedbackScore: 0.9,
    incentivesEarned: 450,
    complaintsCount: 0
  },
  {
    id: 's2',
    name: 'Quick Stop Mart',
    address: '456 Express Way',
    reliabilityScore: 0.45,
    inventory: [...INITIAL_PRODUCTS.map(p => ({ ...p, inStock: Math.random() > 0.4 }))],
    lastUpdateFrequency: 2,
    pastAccuracy: 0.4,
    customerFeedbackScore: 0.5,
    incentivesEarned: 20,
    complaintsCount: 5
  },
  {
    id: 's3',
    name: 'Reliable Retail',
    address: '789 Trust Lane',
    reliabilityScore: 0.88,
    inventory: [...INITIAL_PRODUCTS.filter(p => !['Electronics'].includes(p.category))],
    lastUpdateFrequency: 10,
    pastAccuracy: 0.85,
    customerFeedbackScore: 0.88,
    incentivesEarned: 310,
    complaintsCount: 1
  }
];
