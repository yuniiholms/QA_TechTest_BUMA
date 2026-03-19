/**
 * Centralized test data fixtures
 * Following best practice: Single source of truth for test data
 */

export interface TenantResponse {
  tenantId: string;
  tenantName: string;
  authProvider: string;
  authConfig: {
    clientId: string;
    redirectUri: string;
  };
}

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
  permissions: string[];
}

export interface Location {
  id: string;
  name: string;
}

export interface Sublocation {
  id: string;
  name: string;
  locationId: string;
}

export interface Area {
  id: string;
  name: string;
  sublocationId: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
}

export interface HazardReport {
  hazardId: string;
  reportNumber: string;
  location: string;
  area: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

// ============================================
// MOCK DATA
// ============================================

export const MockTenant: TenantResponse = {
  tenantId: 'tenant-123',
  tenantName: 'Mining Corp',
  authProvider: 'microsoft',
  authConfig: {
    clientId: 'mock-client-id',
    redirectUri: 'https://wemine-office.example.com/callback'
  }
};

export const MockUser: UserProfile = {
  userId: 'emp-1',
  email: 'john.doe@miningcorp.com',
  name: 'John Doe',
  role: 'inspector',
  tenantId: 'tenant-123',
  permissions: ['view_inspections', 'create_inspections', 'view_hazards', 'create_hazards']
};

export const MockLocations: Location[] = [
  { id: 'loc-1', name: 'Mining Site A' },
  { id: 'loc-2', name: 'Mining Site B' },
  { id: 'loc-3', name: 'Processing Plant' }
];

export const MockSublocations: Record<string, Sublocation[]> = {
  'loc-1': [
    { id: 'subloc-1a', name: 'Crusher Area', locationId: 'loc-1' },
    { id: 'subloc-1b', name: 'Conveyor Belt', locationId: 'loc-1' }
  ],
  'loc-2': [
    { id: 'subloc-2a', name: 'Excavation Zone', locationId: 'loc-2' },
    { id: 'subloc-2b', name: 'Loading Bay', locationId: 'loc-2' }
  ]
};

export const MockAreas: Record<string, Area[]> = {
  'subloc-1a': [
    { id: 'area-1a1', name: 'Primary Crusher', sublocationId: 'subloc-1a' },
    { id: 'area-1a2', name: 'Secondary Crusher', sublocationId: 'subloc-1a' }
  ],
  'subloc-1b': [
    { id: 'area-1b1', name: 'Main Belt', sublocationId: 'subloc-1b' }
  ]
};

export const MockEmployees: Employee[] = [
  { id: 'emp-1', name: 'John Doe', department: 'Operations' },
  { id: 'emp-2', name: 'Jane Smith', department: 'Safety' },
  { id: 'emp-3', name: 'Bob Wilson', department: 'Maintenance' },
  { id: 'emp-4', name: 'Alice Brown', department: 'Operations' }
];

export const MockHazards: HazardReport[] = [
  {
    hazardId: 'haz-001',
    reportNumber: 'HAZ-2026-0001',
    location: 'Mining Site A',
    area: 'Primary Crusher',
    status: 'open',
    createdAt: '2026-03-19T10:00:00Z'
  },
  {
    hazardId: 'haz-002',
    reportNumber: 'HAZ-2026-0002',
    location: 'Mining Site B',
    area: 'Loading Bay',
    status: 'resolved',
    createdAt: '2026-03-18T15:00:00Z'
  }
];

// ============================================
// TEST DATA GENERATORS
// ============================================

export const TestDataGenerator = {
  generateHazardReport: (overrides?: Partial<HazardReport>): HazardReport => ({
    hazardId: `haz-${Date.now()}`,
    reportNumber: `HAZ-2026-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    location: 'Mining Site A',
    area: 'Primary Crusher',
    status: 'open',
    createdAt: new Date().toISOString(),
    ...overrides
  }),

  generateUser: (overrides?: Partial<UserProfile>): UserProfile => ({
    ...MockUser,
    userId: `user-${Date.now()}`,
    ...overrides
  })
};
