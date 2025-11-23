// Session management for admin panel
const SESSION_KEY = "admin_session";
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

export interface AdminSession {
  email: string;
  timestamp: number;
  expiresAt: number;
}

export const saveSession = (email: string): void => {
  const session: AdminSession = {
    email,
    timestamp: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = (): AdminSession | null => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const session: AdminSession = JSON.parse(stored);

    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const isAuthenticated = (): boolean => {
  return getSession() !== null;
};

// Office location management
const OFFICE_LOCATION_KEY = "office_location";

export interface OfficeLocation {
  street: string;
  city: string;
  postalCode: string;
  mapUrl: string;
}

const defaultOfficeLocation: OfficeLocation = {
  street: "123 Main Street",
  city: "Kathmandu, Nepal",
  postalCode: "44600",
  mapUrl: "https://www.google.com/maps?q=Kathmandu,Nepal&output=embed"
};

export const getOfficeLocation = (): OfficeLocation => {
  try {
    const stored = localStorage.getItem(OFFICE_LOCATION_KEY);
    if (!stored) return defaultOfficeLocation;
    return JSON.parse(stored);
  } catch {
    return defaultOfficeLocation;
  }
};

export const saveOfficeLocation = (location: OfficeLocation): void => {
  localStorage.setItem(OFFICE_LOCATION_KEY, JSON.stringify(location));
};

// Authorized users management
const AUTHORIZED_USERS_KEY = "authorized_users";

const defaultAuthorizedUsers: Record<string, string> = {
  "adhiadarsh91@gmail.com": "admin123",
  "admin@senate.exchange": "senate2024",
  "operator@senate.exchange": "operator123"
};

export const getAuthorizedUsers = (): Record<string, string> => {
  try {
    const stored = localStorage.getItem(AUTHORIZED_USERS_KEY);
    if (!stored) {
      // Initialize with defaults if not exists
      saveAuthorizedUsers(defaultAuthorizedUsers);
      return defaultAuthorizedUsers;
    }
    return JSON.parse(stored);
  } catch {
    return defaultAuthorizedUsers;
  }
};

export const saveAuthorizedUsers = (users: Record<string, string>): void => {
  localStorage.setItem(AUTHORIZED_USERS_KEY, JSON.stringify(users));
};

export const addAuthorizedUser = (email: string, password: string): void => {
  const users = getAuthorizedUsers();
  users[email.toLowerCase().trim()] = password;
  saveAuthorizedUsers(users);
};

export const updateAuthorizedUserPassword = (email: string, password: string): void => {
  const users = getAuthorizedUsers();
  const normalizedEmail = email.toLowerCase().trim();
  if (users[normalizedEmail]) {
    users[normalizedEmail] = password;
    saveAuthorizedUsers(users);
  }
};

export const removeAuthorizedUser = (email: string): void => {
  const users = getAuthorizedUsers();
  const normalizedEmail = email.toLowerCase().trim();
  delete users[normalizedEmail];
  saveAuthorizedUsers(users);
};

export const isAuthorizedUser = (email: string): boolean => {
  const users = getAuthorizedUsers();
  return users[email.toLowerCase().trim()] !== undefined;
};

export const verifyUserPassword = (email: string, password: string): boolean => {
  const users = getAuthorizedUsers();
  const normalizedEmail = email.toLowerCase().trim();
  return users[normalizedEmail] === password;
};

