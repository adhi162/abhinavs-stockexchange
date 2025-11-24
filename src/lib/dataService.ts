// Client-side data service using localStorage with JSON file export/import
// Use crypto.randomUUID() if available, otherwise fallback to simple UUID generator
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  exchangeRate: string; // Exchange rate to NPR
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  lastLogin?: string;
}

export interface OfficeLocation {
  street: string;
  city: string;
  postalCode: string;
  mapUrl: string;
  updatedAt: string;
}

export interface DataStore {
  users: User[];
  currencies: Currency[];
  officeLocation: OfficeLocation;
}

const STORAGE_KEY = 'senate_exchange_data';

// Default data
const defaultData: DataStore = {
  users: [
    {
      id: generateUUID(),
      email: 'adhiadarsh91@gmail.com',
      passwordHash: '', // Will be set on first use
      createdAt: new Date().toISOString(),
    },
  ],
  currencies: [
    {
      id: generateUUID(),
      code: 'USDT',
      name: 'Tether',
      exchangeRate: '133.20',
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  officeLocation: {
    street: '123 Main Street',
    city: 'Kathmandu, Nepal',
    postalCode: '44600',
    mapUrl: 'https://www.google.com/maps?q=Kathmandu,Nepal&output=embed',
    updatedAt: new Date().toISOString(),
  },
};

class DataService {
  private data: DataStore | null = null;

  // Initialize data from localStorage, public file, or create default
  initialize(): DataStore {
    if (this.data) {
      return this.data;
    }

    try {
      // First try to load from localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
        // Validate structure
        if (!this.data || !this.data.users || !this.data.currencies || !this.data.officeLocation) {
          throw new Error('Invalid data structure');
        }
        // Try to load from public file in background (non-blocking)
        this.loadFromPublicFile().catch(() => {
          // Silently fail if file doesn't exist
        });
        return this.data;
      }
      
      // If no localStorage data, try to load from public/data/data.json synchronously via fetch
      // Note: This is a best-effort attempt, will fallback to default if file doesn't exist
      fetch('/data/data.json')
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('File not found');
        })
        .then((importedData: DataStore) => {
          if (importedData && importedData.users && importedData.currencies && importedData.officeLocation) {
            this.data = importedData;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data, null, 2));
            // Trigger a custom event to notify components
            window.dispatchEvent(new CustomEvent('dataLoaded'));
          }
        })
        .catch(() => {
          // File doesn't exist or invalid, use default
          if (!this.data) {
            this.data = JSON.parse(JSON.stringify(defaultData));
            this.save();
          }
        });
      
      // If fetch hasn't completed yet, use default for now
      if (!this.data) {
        this.data = JSON.parse(JSON.stringify(defaultData));
        this.save();
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      this.data = JSON.parse(JSON.stringify(defaultData));
      this.save();
    }

    return this.data!;
  }

  // Save data to localStorage and export to file
  save(): void {
    if (!this.data) {
      this.initialize();
    }
    try {
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data, null, 2));
      
      // Also export to file (downloads data.json - user should place it in public/data/)
      // Note: Browser security prevents direct file writes, so we download the file
      this.exportToFile();
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }

  // Export data to JSON file (downloads to user's downloads folder as data.json)
  // User should manually place this file in public/data/data.json
  exportToFile(): void {
    if (!this.data) {
      this.initialize();
    }
    try {
      const dataStr = JSON.stringify(this.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'data.json';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data to file:', error);
    }
  }

  // Try to load data from public/data/data.json on initialization
  async loadFromPublicFile(): Promise<boolean> {
    try {
      const response = await fetch('/data/data.json');
      if (!response.ok) {
        return false;
      }
      const importedData = await response.json() as DataStore;
      
      // Validate structure
      if (!importedData || !importedData.users || !importedData.currencies || !importedData.officeLocation) {
        return false;
      }
      
      this.data = importedData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data, null, 2));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Save data to data/data.json file (via download, user places it manually)
  saveToDataFolder(): void {
    this.exportToFile();
  }

  // Import data from JSON file
  importFromFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedData = JSON.parse(content) as DataStore;
          
          // Validate structure
          if (!importedData || !importedData.users || !importedData.currencies || !importedData.officeLocation) {
            throw new Error('Invalid data structure in file');
          }
          
          this.data = importedData;
          this.save();
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Get current data
  getData(): DataStore {
    if (!this.data) {
      this.initialize();
    }
    return this.data!;
  }

  // Update data with a function
  updateData(updater: (data: DataStore) => void): void {
    if (!this.data) {
      this.initialize();
    }
    updater(this.data!);
    this.save();
  }

  // Currency operations
  getCurrencies(): Currency[] {
    return this.getData().currencies;
  }

  getEnabledCurrencies(): Currency[] {
    return this.getData().currencies.filter((c) => c.enabled);
  }

  createCurrency(code: string, name: string, exchangeRate: string): void {
    this.updateData((data) => {
      if (data.currencies.some((c) => c.code.toUpperCase() === code.toUpperCase())) {
        throw new Error('Currency already exists');
      }
      data.currencies.push({
        id: generateUUID(),
        code: code.toUpperCase(),
        name,
        exchangeRate: String(exchangeRate),
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  }

  updateCurrency(id: string, updates: Partial<Currency>): void {
    this.updateData((data) => {
      const currency = data.currencies.find((c) => c.id === id);
      if (!currency) {
        throw new Error('Currency not found');
      }
      Object.assign(currency, updates);
      currency.updatedAt = new Date().toISOString();
    });
  }

  deleteCurrency(id: string): void {
    this.updateData((data) => {
      const index = data.currencies.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error('Currency not found');
      }
      data.currencies.splice(index, 1);
    });
  }

  // User operations
  getUsers(): Omit<User, 'passwordHash'>[] {
    return this.getData().users.map(({ passwordHash, ...user }) => user);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getData().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(email: string, passwordHash: string): void {
    this.updateData((data) => {
      if (data.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('User already exists');
      }
      data.users.push({
        id: generateUUID(),
        email: email.toLowerCase(),
        passwordHash,
        createdAt: new Date().toISOString(),
      });
    });
  }

  updateUserPassword(email: string, passwordHash: string): void {
    this.updateData((data) => {
      const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error('User not found');
      }
      user.passwordHash = passwordHash;
    });
  }

  deleteUser(email: string): void {
    this.updateData((data) => {
      const index = data.users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
      if (index === -1) {
        throw new Error('User not found');
      }
      data.users.splice(index, 1);
    });
  }

  updateUserLastLogin(email: string): void {
    this.updateData((data) => {
      const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        user.lastLogin = new Date().toISOString();
      }
    });
  }

  // Office location operations
  getOfficeLocation(): OfficeLocation {
    return this.getData().officeLocation;
  }

  updateOfficeLocation(updates: Partial<OfficeLocation>): void {
    this.updateData((data) => {
      Object.assign(data.officeLocation, updates);
      data.officeLocation.updatedAt = new Date().toISOString();
    });
  }
}

export const dataService = new DataService();
