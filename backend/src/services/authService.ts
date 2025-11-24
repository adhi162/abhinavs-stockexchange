// Authentication service
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import { dataService } from './dataService';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production';
const MFA_SECRET = process.env.MFA_SECRET || 'JBSWY3DPEHPK3PXP';

// Default passwords (will be hashed on first use)
const DEFAULT_PASSWORDS: Record<string, string> = {
  'adhiadarsh91@gmail.com': 'admin123',
  'admin@senate.exchange': 'senate2024',
  'operator@senate.exchange': 'operator123',
};

class AuthService {
  async initializePasswords(): Promise<void> {
    const data = dataService.getData();
    let needsSave = false;

    for (const user of data.users) {
      if (!user.passwordHash) {
        const defaultPassword = DEFAULT_PASSWORDS[user.email.toLowerCase()];
        if (defaultPassword) {
          user.passwordHash = await bcrypt.hash(defaultPassword, 10);
          needsSave = true;
        }
      }
    }

    if (needsSave) {
      await dataService.save();
    }
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const data = dataService.getData();
    const user = data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user || !user.passwordHash) {
      return false;
    }

    return bcrypt.compare(password, user.passwordHash);
  }

  async verifyMfa(email: string, code: string): Promise<boolean> {
    // Use the MFA secret from environment or default
    const secret = MFA_SECRET.toUpperCase().replace(/\s/g, '');
    
    try {
      return authenticator.check(code, secret);
    } catch {
      return false;
    }
  }

  generateToken(email: string): string {
    return jwt.sign(
      { email, iat: Math.floor(Date.now() / 1000) },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
  }

  verifyToken(token: string): { email: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
      return decoded;
    } catch {
      return null;
    }
  }

  async createSession(email: string, token: string): Promise<void> {
    const data = dataService.getData();
    const user = data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      throw new Error('User not found');
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8);

    data.sessions.push({
      id: crypto.randomUUID(),
      userId: user.id,
      token,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    });

    // Update last login
    user.lastLogin = new Date().toISOString();

    await dataService.save();
  }

  async deleteSession(token: string): Promise<void> {
    await dataService.updateData((data) => {
      data.sessions = data.sessions.filter((s) => s.token !== token);
    });
  }

  async updatePassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    const isValid = await this.verifyPassword(email, currentPassword);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await dataService.updateData((data) => {
      const user = data.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (user) {
        user.passwordHash = newHash;
      }
    });
  }
}

export const authService = new AuthService();

