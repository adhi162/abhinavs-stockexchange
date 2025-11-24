// Auth controller
import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { AuthRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const isValid = await authService.verifyPassword(email, password);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Return email for MFA step (token will be generated after MFA)
    res.json({ email: email.toLowerCase(), requiresMfa: true });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyMfa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ error: 'Email and MFA code are required' });
      return;
    }

    const isValid = await authService.verifyMfa(email, code);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid MFA code' });
      return;
    }

    // Generate token and create session
    const token = authService.generateToken(email);
    await authService.createSession(email, token);

    res.json({ token, email: email.toLowerCase() });
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await authService.deleteSession(token);
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

