// Admin controller
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { dataService } from '../services/dataService';
import crypto from 'crypto';

// Currencies
export const getCurrencies = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = dataService.getData();
    res.json(data.currencies);
  } catch (error) {
    console.error('Get currencies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCurrency = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code, name, commissionRate } = req.body;
    if (!code || !name || !commissionRate) {
      res.status(400).json({ error: 'Code, name, and commissionRate are required' });
      return;
    }

    await dataService.updateData((data) => {
      if (data.currencies.some((c) => c.code === code)) {
        throw new Error('Currency already exists');
      }
      data.currencies.push({
        id: crypto.randomUUID(),
        code,
        name,
        commissionRate: String(commissionRate),
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    res.status(201).json({ message: 'Currency created' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create currency' });
  }
};

export const updateCurrency = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, commissionRate, enabled } = req.body;

    await dataService.updateData((data) => {
      const currency = data.currencies.find((c) => c.id === id);
      if (!currency) {
        throw new Error('Currency not found');
      }
      if (name) currency.name = name;
      if (commissionRate !== undefined) currency.commissionRate = String(commissionRate);
      if (enabled !== undefined) currency.enabled = enabled;
      currency.updatedAt = new Date().toISOString();
    });

    res.json({ message: 'Currency updated' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update currency' });
  }
};

// Rates
export const getRates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = dataService.getData();
    res.json(data.rates);
  } catch (error) {
    console.error('Get rates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateRate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rate } = req.body;

    if (!rate) {
      res.status(400).json({ error: 'Rate is required' });
      return;
    }

    await dataService.updateData((data) => {
      const rateEntry = data.rates.find((r) => r.id === id);
      if (!rateEntry) {
        throw new Error('Rate not found');
      }
      rateEntry.rate = String(rate);
      rateEntry.updatedAt = new Date().toISOString();
      rateEntry.updatedById = req.user?.email;
    });

    res.json({ message: 'Rate updated' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update rate' });
  }
};

// Users
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = dataService.getData();
    const users = data.users.map(({ passwordHash, ...user }) => user);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(password, 10);

    await dataService.updateData((data) => {
      if (data.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('User already exists');
      }
      data.users.push({
        id: crypto.randomUUID(),
        email: email.toLowerCase(),
        passwordHash,
        createdAt: new Date().toISOString(),
      });
    });

    res.status(201).json({ message: 'User created' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create user' });
  }
};

export const updateUserPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current and new passwords are required' });
      return;
    }

    const { authService } = require('../services/authService');
    await authService.updatePassword(email, currentPassword, newPassword);

    res.json({ message: 'Password updated' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update password' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.params;

    await dataService.updateData((data) => {
      data.users = data.users.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
      data.sessions = data.sessions.filter((s) => {
        const user = data.users.find((u) => u.id === s.userId);
        return user && user.email.toLowerCase() !== email.toLowerCase();
      });
    });

    res.json({ message: 'User deleted' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to delete user' });
  }
};

// Office Location
export const getOfficeLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = dataService.getData();
    const { updatedAt, ...location } = data.officeLocation;
    res.json(location);
  } catch (error) {
    console.error('Get office location error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOfficeLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { street, city, postalCode, mapUrl } = req.body;

    await dataService.updateData((data) => {
      data.officeLocation = {
        street,
        city,
        postalCode,
        mapUrl,
        updatedAt: new Date().toISOString(),
      };
    });

    res.json({ message: 'Office location updated' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update office location' });
  }
};

// Settings
export const getSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = dataService.getData();
    res.json({ defaultCommission: data.settings.defaultCommission });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { defaultCommission } = req.body;

    await dataService.updateData((data) => {
      data.settings.defaultCommission = String(defaultCommission);
      data.settings.updatedAt = new Date().toISOString();
    });

    res.json({ message: 'Settings updated' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update settings' });
  }
};

