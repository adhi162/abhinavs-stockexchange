// Client-side authentication service
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import { dataService } from './dataService';

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'dev-jwt-secret';
const MFA_SECRET = import.meta.env.VITE_MFA_SECRET || 'JBSWY3DPEHPK3PXP';

// Default passwords (will be hashed on first use)
const DEFAULT_PASSWORDS: Record<string, string> = {
  'adhiadarsh91@gmail.com': 'admin123',
};

class AuthService {
  // Initialize default passwords
  async initializePasswords(): Promise<void> {
    const users = dataService.getData().users;
    
    for (const user of users) {
      if (!user.passwordHash) {
        const defaultPassword = DEFAULT_PASSWORDS[user.email.toLowerCase()];
        if (defaultPassword) {
          user.passwordHash = await bcrypt.hash(defaultPassword, 10);
          dataService.save();
        }
      }
    }
  }

  // Verify password
  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = dataService.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      return false;
    }
    return bcrypt.compare(password, user.passwordHash);
  }

  // Verify MFA code
  verifyMfa(code: string): boolean {
    try {
      return authenticator.check(code, MFA_SECRET);
    } catch (error) {
      return false;
    }
  }

  // Generate JWT token (simplified - in production use proper JWT library)
  generateToken(email: string): string {
    const payload = {
      email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60, // 8 hours
    };
    
    // Simple base64 encoding (not secure for production, but works for client-side)
    return btoa(JSON.stringify(payload));
  }

  // Verify token
  verifyToken(token: string): { email: string } | null {
    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null; // Token expired
      }
      return { email: payload.email };
    } catch (error) {
      return null;
    }
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}

export const authService = new AuthService();

// Initialize on module load
authService.initializePasswords();

