// JSON file-based data storage service
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

interface DataStore {
  users: Array<{
    id: string;
    email: string;
    passwordHash: string;
    mfaSecret?: string;
    createdAt: string;
    lastLogin?: string;
  }>;
  currencies: Array<{
    id: string;
    code: string;
    name: string;
    commissionRate: string;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  rates: Array<{
    id: string;
    fromCurrency: string;
    toCurrency: string;
    rate: string;
    changePercent?: string;
    trend?: string;
    updatedAt: string;
    updatedById?: string;
  }>;
  officeLocation: {
    street: string;
    city: string;
    postalCode: string;
    mapUrl: string;
    updatedAt: string;
  };
  settings: {
    defaultCommission: string;
    updatedAt: string;
  };
  sessions: Array<{
    id: string;
    userId: string;
    token: string;
    expiresAt: string;
    createdAt: string;
  }>;
}

const defaultData: DataStore = {
  users: [
    {
      id: crypto.randomUUID(),
      email: 'adhiadarsh91@gmail.com',
      passwordHash: '', // Will be set on first load
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      email: 'admin@senate.exchange',
      passwordHash: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      email: 'operator@senate.exchange',
      passwordHash: '',
      createdAt: new Date().toISOString(),
    },
  ],
  currencies: [
    { id: crypto.randomUUID(), code: 'RUB', name: 'Russian Ruble', commissionRate: '0.20', enabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: crypto.randomUUID(), code: 'USD', name: 'US Dollar', commissionRate: '0.20', enabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: crypto.randomUUID(), code: 'EUR', name: 'Euro', commissionRate: '0.20', enabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: crypto.randomUUID(), code: 'KZT', name: 'Kazakhstani Tenge', commissionRate: '0.20', enabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: crypto.randomUUID(), code: 'USDT', name: 'Tether', commissionRate: '0.25', enabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: crypto.randomUUID(), code: 'BTC', name: 'Bitcoin', commissionRate: '0.30', enabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  rates: [],
  officeLocation: {
    street: '123 Main Street',
    city: 'Kathmandu, Nepal',
    postalCode: '44600',
    mapUrl: 'https://www.google.com/maps?q=Kathmandu,Nepal&output=embed',
    updatedAt: new Date().toISOString(),
  },
  settings: {
    defaultCommission: '0.20',
    updatedAt: new Date().toISOString(),
  },
  sessions: [],
};

class DataService {
  private data: DataStore | null = null;
  private writeLock = false;

  async initialize(): Promise<void> {
    try {
      // Ensure data directory exists
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Try to load existing data
      try {
        const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        console.log('✅ Loaded data from JSON file');
      } catch {
        // File doesn't exist, create with defaults
        this.data = JSON.parse(JSON.stringify(defaultData));
        await this.save();
        console.log('✅ Created new data file with defaults');
      }

      // Initialize password hashes if needed (using bcrypt in actual implementation)
      // For now, we'll handle this in the auth service
    } catch (error) {
      console.error('Failed to initialize data service:', error);
      throw error;
    }
  }

  async load(): Promise<DataStore> {
    if (this.data) {
      return this.data;
    }

    try {
      const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
      this.data = JSON.parse(fileContent);
      return this.data;
    } catch (error) {
      console.error('Failed to load data:', error);
      throw new Error('Failed to load data');
    }
  }

  async save(): Promise<void> {
    if (this.writeLock) {
      // Wait a bit and retry
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.save();
    }

    if (!this.data) {
      throw new Error('No data to save');
    }

    this.writeLock = true;
    try {
      // Write to temp file first, then rename (atomic operation)
      const tempFile = `${DATA_FILE}.tmp`;
      await fs.writeFile(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      await fs.rename(tempFile, DATA_FILE);
    } catch (error) {
      console.error('Failed to save data:', error);
      throw error;
    } finally {
      this.writeLock = false;
    }
  }

  getData(): DataStore {
    if (!this.data) {
      throw new Error('Data not initialized. Call initialize() first.');
    }
    return this.data;
  }

  async updateData(updater: (data: DataStore) => void): Promise<void> {
    const data = await this.load();
    updater(data);
    this.data = data;
    await this.save();
  }
}

export const dataService = new DataService();
export type { DataStore };

