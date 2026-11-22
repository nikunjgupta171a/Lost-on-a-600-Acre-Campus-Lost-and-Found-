export type Category =
  | 'Wallet'
  | 'ID Card'
  | 'Bag'
  | 'Laptop'
  | 'Bottle'
  | 'Electronics'
  | 'Accessories'
  | 'Other';

export type ItemStatus = 'available' | 'claimed' | 'returned' | 'pending';
export type ClaimStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected';

export interface Item {
  id: string;
  name: string;
  category: Category;
  location: string;
  dateFound: string; // ISO
  description: string;
  image: string;
  status: ItemStatus;
  finderName: string;
  finderContact: string;
  verified: boolean;
  deposited: boolean; // submitted to security desk
  hiddenDetails: string;
}

export interface LostReport {
  id: string;
  name: string;
  category: Category;
  lastSeenLocation: string;
  dateLost: string;
  description: string;
  image?: string;
  contact: string;
  submittedAt: string;
  matches?: string[];
}

export interface Claim {
  id: string;
  itemId: string;
  claimId: string;
  color: string;
  contents: string;
  uniqueMarks: string;
  status: ClaimStatus;
  submittedAt: string;
  claimantName: string;
  claimantContact: string;
}

export interface User {
  name: string;
  email: string;
  studentId: string;
  role: 'student' | 'admin';
  avatar: string;
  department: string;
}

export const CATEGORIES: Category[] = [
  'Wallet',
  'ID Card',
  'Bag',
  'Laptop',
  'Bottle',
  'Electronics',
  'Accessories',
  'Other',
];

export const LOCATIONS = [
  'Library, 2nd Floor',
  'Mess B',
  'Block 32',
  'Block 34',
  'Classroom 33-201',
  'Academic Block',
  'Hostel Block 12',
  'Student Centre',
  'Parking Area A',
  'Main Gate',
  'Security Desk',
  'Sports Complex',
];
