// Session management using localStorage
import { authService } from './authService';
import { dataService } from './dataService';

export interface Session {
  token: string;
  email: string;
}

const SESSION_KEY = 'senate_exchange_session';

export const getSession = (): Session | null => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const session: Session = JSON.parse(stored);
    
    // Verify token is still valid
    const decoded = authService.verifyToken(session.token);
    if (!decoded) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
};

export const saveSession = (email: string, token: string): void => {
  const session: Session = { email, token };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  dataService.updateUserLastLogin(email);
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const isAuthenticated = (): boolean => {
  return getSession() !== null;
};
