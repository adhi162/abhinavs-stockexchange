# Backend Migration & Database Analysis

## Executive Summary

This document analyzes the current React frontend application and identifies:
1. Components that should be moved to a Node.js backend
2. Data that requires database persistence
3. Components that should remain in the frontend

---

## 🔴 CRITICAL: Must Move to Backend + Database

### 1. **Authentication & Authorization System**
**Current State:** Stored in `localStorage` (`src/lib/session.ts`)
- Admin user credentials (email + password)
- Session management
- MFA secret handling

**Why Backend:**
- Security: Passwords should NEVER be stored in localStorage (plaintext!)
- Session management should be server-side
- MFA secrets must be secure

**Database Tables Needed:**
```sql
-- Users/Admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- bcrypt/argon2
  mfa_secret VARCHAR(255), -- encrypted
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_login TIMESTAMP
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES admins(id),
  token VARCHAR(255) UNIQUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP
);
```

**Backend API Endpoints:**
- `POST /api/auth/login` - Credential verification
- `POST /api/auth/mfa/verify` - MFA verification
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/session` - Session validation

---

### 2. **Admin User Management**
**Current State:** `localStorage` (`src/lib/session.ts` - `AUTHORIZED_USERS_KEY`)
- Add/remove admin users
- Password updates

**Why Backend:**
- Security: User management must be server-side
- Access control and audit logging
- Password hashing

**Database Tables:**
```sql
-- Already covered in admins table above
-- Add role/permission system if needed
CREATE TABLE admin_roles (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES admins(id),
  role VARCHAR(50), -- 'super_admin', 'admin', 'operator'
  permissions JSONB
);
```

**Backend API Endpoints:**
- `GET /api/admin/users` - List all admins
- `POST /api/admin/users` - Add new admin
- `DELETE /api/admin/users/:id` - Remove admin
- `PUT /api/admin/users/:id/password` - Update own password

---

### 3. **Currency & Commission Management**
**Current State:** Hardcoded in `src/pages/Admin.tsx` (lines 40-47)
- Currency list (RUB, USD, EUR, KZT, USDT, BTC)
- Commission rates per currency
- Default commission rate
- Currency enable/disable status

**Why Backend + Database:**
- Dynamic configuration
- Historical tracking of rate changes
- Multi-tenant support
- Audit trail

**Database Tables:**
```sql
-- Currencies table
CREATE TABLE currencies (
  id UUID PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL, -- RUB, USD, etc.
  name VARCHAR(100) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL, -- 0.20 = 0.20%
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Commission history (audit trail)
CREATE TABLE commission_history (
  id UUID PRIMARY KEY,
  currency_id UUID REFERENCES currencies(id),
  old_rate DECIMAL(5,2),
  new_rate DECIMAL(5,2),
  changed_by UUID REFERENCES admins(id),
  changed_at TIMESTAMP
);

-- Default commission settings
CREATE TABLE settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMP,
  updated_by UUID REFERENCES admins(id)
);
```

**Backend API Endpoints:**
- `GET /api/currencies` - List all currencies
- `POST /api/currencies` - Add new currency
- `PUT /api/currencies/:id` - Update currency (commission, enabled)
- `DELETE /api/currencies/:id` - Remove currency
- `GET /api/settings/default-commission` - Get default commission
- `PUT /api/settings/default-commission` - Update default commission

---

### 4. **Exchange Rates**
**Current State:** Hardcoded in `src/components/RatesSection.tsx` (lines 5-12)
- Exchange rates (RUB→NPR, USD→NPR, etc.)
- Rate change percentages
- Rate trends

**Why Backend + Database:**
- Real-time rate updates
- Rate history and analytics
- Integration with external rate providers
- Rate validation and business rules

**Database Tables:**
```sql
-- Exchange rates table
CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY,
  from_currency VARCHAR(10) NOT NULL,
  to_currency VARCHAR(10) NOT NULL, -- Usually NPR
  rate DECIMAL(15,4) NOT NULL,
  change_percent DECIMAL(5,2), -- +0.5%, -0.2%
  trend VARCHAR(10), -- 'up', 'down', 'neutral'
  updated_at TIMESTAMP,
  updated_by UUID REFERENCES admins(id),
  UNIQUE(from_currency, to_currency)
);

-- Rate history for analytics
CREATE TABLE rate_history (
  id UUID PRIMARY KEY,
  exchange_rate_id UUID REFERENCES exchange_rates(id),
  rate DECIMAL(15,4),
  recorded_at TIMESTAMP,
  INDEX idx_recorded_at (recorded_at)
);
```

**Backend API Endpoints:**
- `GET /api/rates` - Get current rates
- `GET /api/rates/history` - Get rate history
- `PUT /api/rates/:id` - Update rate (admin only)
- `POST /api/rates/sync` - Sync from external provider

---

### 5. **Office Location**
**Current State:** `localStorage` (`src/lib/session.ts` - `OFFICE_LOCATION_KEY`)
- Street address
- City
- Postal code
- Google Maps embed URL

**Why Backend + Database:**
- Multi-location support
- Version control
- Public API access

**Database Tables:**
```sql
-- Office locations
CREATE TABLE office_locations (
  id UUID PRIMARY KEY,
  street VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  map_url TEXT,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Backend API Endpoints:**
- `GET /api/offices` - Get all office locations
- `GET /api/offices/main` - Get main office
- `POST /api/offices` - Add office location
- `PUT /api/offices/:id` - Update office location
- `DELETE /api/offices/:id` - Remove office location

---

## 🟡 RECOMMENDED: Should Move to Backend (Optional Database)

### 6. **Exchange Calculator Logic**
**Current State:** Frontend calculation in `src/components/Hero.tsx` and `src/components/ExchangeCalculator.tsx`
- Rate calculations
- Commission calculations
- Final quote generation

**Why Backend:**
- Business logic centralization
- Rate validation
- Commission rules enforcement
- Quote locking mechanism

**Backend API Endpoints:**
- `POST /api/calculator/quote` - Calculate exchange quote
- `POST /api/calculator/lock-quote` - Lock a quote (with expiration)

**Optional Database:**
```sql
-- Quote requests (for analytics)
CREATE TABLE quote_requests (
  id UUID PRIMARY KEY,
  from_currency VARCHAR(10),
  to_currency VARCHAR(10),
  amount DECIMAL(15,2),
  rate DECIMAL(15,4),
  commission DECIMAL(15,2),
  final_amount DECIMAL(15,2),
  delivery_method VARCHAR(50),
  requested_at TIMESTAMP,
  ip_address VARCHAR(45)
);
```

---

### 7. **Content Management (Static Content)**
**Current State:** Hardcoded in components
- FAQ items
- Testimonials
- Features list
- Process steps
- Blog posts

**Why Backend (Optional):**
- Easy content updates without code deployment
- Multi-language support
- A/B testing

**Database Tables (if needed):**
```sql
CREATE TABLE content_items (
  id UUID PRIMARY KEY,
  type VARCHAR(50), -- 'faq', 'testimonial', 'feature'
  title VARCHAR(255),
  content TEXT,
  order_index INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 🟢 KEEP IN FRONTEND

### 1. **UI Components & Presentation**
- All React components (`src/components/`)
- UI library components (`src/components/ui/`)
- Styling (Tailwind CSS)
- Animations and transitions
- Responsive design logic

**Reason:** Pure presentation layer, no business logic

---

### 2. **Client-Side State Management**
- Form state
- UI state (modals, tabs, etc.)
- Temporary calculations for display
- Client-side validation (UX only)

**Reason:** Improves UX, reduces server load

---

### 3. **Static Assets**
- Images
- Icons
- Fonts
- Public files

**Reason:** Served via CDN, no backend needed

---

## 📊 Database Schema Summary

### Core Tables
1. `admins` - Admin users
2. `sessions` - Active sessions
3. `currencies` - Supported currencies
4. `exchange_rates` - Current exchange rates
5. `rate_history` - Rate change history
6. `office_locations` - Office addresses
7. `settings` - System settings
8. `commission_history` - Commission change audit
9. `audit_logs` - **Comprehensive audit trail** (see below)

### Optional Tables
10. `quote_requests` - Analytics for quotes
11. `content_items` - CMS content
12. `admin_roles` - Role-based access control

---

## 🔍 COMPREHENSIVE AUDIT LOGGING SYSTEM

### Overview
Every action in the admin panel must be logged with:
- Who performed the action
- What action was performed
- When it happened
- What changed (before/after values)
- Simple, human-readable messages

### Database Schema

```sql
-- Main audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admins(id),
  admin_email VARCHAR(255) NOT NULL, -- Denormalized for quick access
  action_type VARCHAR(50) NOT NULL, -- See action types below
  action_category VARCHAR(50) NOT NULL, -- 'auth', 'user_management', 'currency', 'rates', 'settings', 'office'
  message TEXT NOT NULL, -- Human-readable message
  details JSONB, -- Additional context (before/after values, etc.)
  ip_address VARCHAR(45), -- IPv4 or IPv6
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),

  -- Indexes for fast queries
  INDEX idx_admin_id (admin_id),
  INDEX idx_action_type (action_type),
  INDEX idx_action_category (action_category),
  INDEX idx_created_at (created_at),
  INDEX idx_admin_email (admin_email)
);

-- Example details JSONB structure:
-- {
--   "before": { "commission": "0.20" },
--   "after": { "commission": "0.25" },
--   "currency_code": "USD",
--   "currency_name": "US Dollar"
-- }
```

### Action Types & Messages

#### 1. Authentication Actions

| Action Type | Message Template | Example |
|------------|------------------|---------|
| `LOGIN_SUCCESS` | `"{admin_email} logged in successfully"` | "admin@senate.exchange logged in successfully" |
| `LOGIN_FAILED` | `"Failed login attempt for {email}"` | "Failed login attempt for admin@senate.exchange" |
| `MFA_VERIFIED` | `"{admin_email} verified MFA code"` | "admin@senate.exchange verified MFA code" |
| `MFA_FAILED` | `"Failed MFA verification for {email}"` | "Failed MFA verification for admin@senate.exchange" |
| `LOGOUT` | `"{admin_email} logged out"` | "admin@senate.exchange logged out" |
| `SESSION_EXPIRED` | `"Session expired for {admin_email}"` | "Session expired for admin@senate.exchange" |

**Details JSON:**
```json
{
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "session_duration": "2h 15m"
}
```

---

#### 2. User Management Actions

| Action Type | Message Template | Example |
|------------|------------------|---------|
| `USER_ADDED` | `"{admin_email} added new admin: {new_user_email}"` | "admin@senate.exchange added new admin: operator@senate.exchange" |
| `USER_REMOVED` | `"{admin_email} removed admin: {removed_user_email}"` | "admin@senate.exchange removed admin: operator@senate.exchange" |
| `PASSWORD_CHANGED` | `"{admin_email} changed their password"` | "admin@senate.exchange changed their password" |
| `PASSWORD_RESET_REQUESTED` | `"{admin_email} requested password reset"` | "admin@senate.exchange requested password reset" |

**Details JSON for USER_ADDED:**
```json
{
  "new_user_email": "operator@senate.exchange",
  "added_by": "admin@senate.exchange"
}
```

**Details JSON for PASSWORD_CHANGED:**
```json
{
  "changed_by": "admin@senate.exchange",
  "password_changed_at": "2024-01-15T10:30:00Z"
}
```

---

#### 3. Currency Management Actions

| Action Type | Message Template | Example |
|------------|------------------|---------|
| `CURRENCY_ADDED` | `"{admin_email} added currency: {code} ({name})"` | "admin@senate.exchange added currency: GBP (British Pound)" |
| `CURRENCY_UPDATED` | `"{admin_email} updated currency {code}: {changes}"` | "admin@senate.exchange updated currency USD: commission changed from 0.20% to 0.25%" |
| `CURRENCY_ENABLED` | `"{admin_email} enabled currency: {code}"` | "admin@senate.exchange enabled currency: BTC" |
| `CURRENCY_DISABLED` | `"{admin_email} disabled currency: {code}"` | "admin@senate.exchange disabled currency: BTC" |
| `CURRENCY_DELETED` | `"{admin_email} deleted currency: {code}"` | "admin@senate.exchange deleted currency: KZT" |

**Details JSON for CURRENCY_UPDATED:**
```json
{
  "currency_code": "USD",
  "currency_name": "US Dollar",
  "before": {
    "commission": "0.20",
    "enabled": true
  },
  "after": {
    "commission": "0.25",
    "enabled": true
  },
  "changes": ["commission"]
}
```

---

#### 4. Commission Settings Actions

| Action Type | Message Template | Example |
|------------|------------------|---------|
| `COMMISSION_UPDATED` | `"{admin_email} updated {currency_code} commission from {old}% to {new}%"` | "admin@senate.exchange updated USD commission from 0.20% to 0.25%" |
| `DEFAULT_COMMISSION_UPDATED` | `"{admin_email} updated default commission from {old}% to {new}%"` | "admin@senate.exchange updated default commission from 0.20% to 0.22%" |

**Details JSON:**
```json
{
  "currency_code": "USD",
  "before": { "commission": "0.20" },
  "after": { "commission": "0.25" }
}
```

---

#### 5. Exchange Rate Actions

| Action Type | Message Template | Example |
|------------|------------------|---------|
| `RATE_UPDATED` | `"{admin_email} updated {from_currency}→{to_currency} rate from {old_rate} to {new_rate}"` | "admin@senate.exchange updated USD→NPR rate from 133.25 to 133.50" |
| `RATES_BULK_UPDATED` | `"{admin_email} updated {count} exchange rates"` | "admin@senate.exchange updated 6 exchange rates" |
| `RATE_SYNCED` | `"{admin_email} synced rates from external provider"` | "admin@senate.exchange synced rates from external provider" |

**Details JSON for RATE_UPDATED:**
```json
{
  "from_currency": "USD",
  "to_currency": "NPR",
  "before": { "rate": "133.25", "change_percent": "-0.2", "trend": "down" },
  "after": { "rate": "133.50", "change_percent": "+0.2", "trend": "up" }
}
```

---

#### 6. Office Location Actions

| Action Type | Message Template | Example |
|------------|------------------|---------|
| `OFFICE_ADDED` | `"{admin_email} added office location: {address}"` | "admin@senate.exchange added office location: 123 Main Street, Kathmandu" |
| `OFFICE_UPDATED` | `"{admin_email} updated office location: {changes}"` | "admin@senate.exchange updated office location: address changed from '123 Main St' to '456 New St'" |
| `OFFICE_DELETED` | `"{admin_email} deleted office location: {address}"` | "admin@senate.exchange deleted office location: 123 Main Street, Kathmandu" |
| `MAIN_OFFICE_CHANGED` | `"{admin_email} changed main office to: {address}"` | "admin@senate.exchange changed main office to: 456 New Street, Kathmandu" |

**Details JSON for OFFICE_UPDATED:**
```json
{
  "office_id": "uuid-here",
  "before": {
    "street": "123 Main Street",
    "city": "Kathmandu, Nepal",
    "postal_code": "44600"
  },
  "after": {
    "street": "456 New Street",
    "city": "Kathmandu, Nepal",
    "postal_code": "44600"
  },
  "changes": ["street"]
}
```

---

#### 7. Settings Actions

| Action Type | Message Template | Example |
|------------|------------------|---------|
| `SETTING_UPDATED` | `"{admin_email} updated {setting_key} from {old_value} to {new_value}"` | "admin@senate.exchange updated default_commission from 0.20% to 0.22%" |

---

### Backend Implementation

#### Audit Logger Service (Node.js/TypeScript)

```typescript
// services/auditLogger.ts
import { db } from '../db';
import { Request } from 'express';

export enum ActionType {
  // Auth
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  MFA_VERIFIED = 'MFA_VERIFIED',
  MFA_FAILED = 'MFA_FAILED',
  LOGOUT = 'LOGOUT',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // User Management
  USER_ADDED = 'USER_ADDED',
  USER_REMOVED = 'USER_REMOVED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',

  // Currency
  CURRENCY_ADDED = 'CURRENCY_ADDED',
  CURRENCY_UPDATED = 'CURRENCY_UPDATED',
  CURRENCY_ENABLED = 'CURRENCY_ENABLED',
  CURRENCY_DISABLED = 'CURRENCY_DISABLED',
  CURRENCY_DELETED = 'CURRENCY_DELETED',

  // Commission
  COMMISSION_UPDATED = 'COMMISSION_UPDATED',
  DEFAULT_COMMISSION_UPDATED = 'DEFAULT_COMMISSION_UPDATED',

  // Rates
  RATE_UPDATED = 'RATE_UPDATED',
  RATES_BULK_UPDATED = 'RATES_BULK_UPDATED',
  RATE_SYNCED = 'RATE_SYNCED',

  // Office
  OFFICE_ADDED = 'OFFICE_ADDED',
  OFFICE_UPDATED = 'OFFICE_UPDATED',
  OFFICE_DELETED = 'OFFICE_DELETED',
  MAIN_OFFICE_CHANGED = 'MAIN_OFFICE_CHANGED',

  // Settings
  SETTING_UPDATED = 'SETTING_UPDATED',
}

export enum ActionCategory {
  AUTH = 'auth',
  USER_MANAGEMENT = 'user_management',
  CURRENCY = 'currency',
  COMMISSION = 'commission',
  RATES = 'rates',
  OFFICE = 'office',
  SETTINGS = 'settings',
}

interface AuditLogData {
  adminId: string;
  adminEmail: string;
  actionType: ActionType;
  actionCategory: ActionCategory;
  message: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLogger {
  static async log(data: AuditLogData): Promise<void> {
    try {
      await db.auditLogs.create({
        data: {
          admin_id: data.adminId,
          admin_email: data.adminEmail,
          action_type: data.actionType,
          action_category: data.actionCategory,
          message: data.message,
          details: data.details || {},
          ip_address: data.ipAddress,
          user_agent: data.userAgent,
          created_at: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to write audit log:', error);
      // Don't throw - audit logging should not break the main flow
    }
  }

  static getClientInfo(req: Request): { ipAddress?: string; userAgent?: string } {
    return {
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    };
  }

  // Helper methods for common actions
  static async logLogin(adminId: string, adminEmail: string, req: Request, success: boolean): Promise<void> {
    const clientInfo = this.getClientInfo(req);
    await this.log({
      adminId,
      adminEmail,
      actionType: success ? ActionType.LOGIN_SUCCESS : ActionType.LOGIN_FAILED,
      actionCategory: ActionCategory.AUTH,
      message: success
        ? `${adminEmail} logged in successfully`
        : `Failed login attempt for ${adminEmail}`,
      ...clientInfo,
    });
  }

  static async logPasswordChange(adminId: string, adminEmail: string, req: Request): Promise<void> {
    const clientInfo = this.getClientInfo(req);
    await this.log({
      adminId,
      adminEmail,
      actionType: ActionType.PASSWORD_CHANGED,
      actionCategory: ActionCategory.USER_MANAGEMENT,
      message: `${adminEmail} changed their password`,
      ...clientInfo,
    });
  }

  static async logCurrencyUpdate(
    adminId: string,
    adminEmail: string,
    currencyCode: string,
    currencyName: string,
    before: any,
    after: any,
    req: Request
  ): Promise<void> {
    const clientInfo = this.getClientInfo(req);
    const changes = this.detectChanges(before, after);
    const changesText = changes.map(change => {
      if (change === 'commission') {
        return `commission changed from ${before.commission}% to ${after.commission}%`;
      }
      if (change === 'enabled') {
        return `status changed from ${before.enabled ? 'enabled' : 'disabled'} to ${after.enabled ? 'enabled' : 'disabled'}`;
      }
      return `${change} changed`;
    }).join(', ');

    await this.log({
      adminId,
      adminEmail,
      actionType: ActionType.CURRENCY_UPDATED,
      actionCategory: ActionCategory.CURRENCY,
      message: `${adminEmail} updated currency ${currencyCode}: ${changesText}`,
      details: {
        currency_code: currencyCode,
        currency_name: currencyName,
        before,
        after,
        changes,
      },
      ...clientInfo,
    });
  }

  private static detectChanges(before: any, after: any): string[] {
    const changes: string[] = [];
    for (const key in after) {
      if (before[key] !== after[key]) {
        changes.push(key);
      }
    }
    return changes;
  }
}
```

#### Middleware for Automatic Logging

```typescript
// middleware/auditMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuditLogger } from '../services/auditLogger';

export const auditMiddleware = (actionType: string, getMessage: (req: Request, res: Response) => string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json to log after response
    res.json = function(body: any) {
      if (res.statusCode < 400) { // Only log successful operations
        const admin = (req as any).user; // Assuming user is attached by auth middleware
        if (admin) {
          AuditLogger.log({
            adminId: admin.id,
            adminEmail: admin.email,
            actionType,
            actionCategory: 'auto', // or determine from actionType
            message: getMessage(req, res),
            ...AuditLogger.getClientInfo(req),
          }).catch(console.error);
        }
      }
      return originalJson(body);
    };

    next();
  };
};
```

---

### API Endpoints for Audit Logs

```typescript
// GET /api/audit-logs
// Query params: ?page=1&limit=50&admin_id=xxx&action_type=xxx&start_date=xxx&end_date=xxx
GET /api/audit-logs
Response: {
  logs: [
    {
      id: "uuid",
      admin_email: "admin@senate.exchange",
      action_type: "CURRENCY_UPDATED",
      action_category: "currency",
      message: "admin@senate.exchange updated currency USD: commission changed from 0.20% to 0.25%",
      details: { ... },
      created_at: "2024-01-15T10:30:00Z",
      ip_address: "192.168.1.1"
    }
  ],
  total: 150,
  page: 1,
  limit: 50
}

// GET /api/audit-logs/export
// Export audit logs as CSV/JSON
GET /api/audit-logs/export?format=csv&start_date=xxx&end_date=xxx
```

---

### Frontend Audit Log Viewer

Add a new tab in Admin Panel: **"Audit Logs"**

```typescript
// Features:
- Filter by admin email
- Filter by action type
- Filter by date range
- Search by message
- Export to CSV
- Real-time updates (optional)
- Pagination
```

---

### Best Practices

1. **Never Delete Audit Logs** - Only archive old logs
2. **Immutable Records** - Once written, never modify
3. **Performance** - Use indexes, consider partitioning for large datasets
4. **Retention Policy** - Keep logs for at least 1 year (compliance)
5. **Privacy** - Don't log sensitive data (passwords, tokens)
6. **Async Logging** - Don't block main operations
7. **Error Handling** - Logging failures shouldn't break the app

---

### Example Audit Log Entries

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "admin_email": "admin@senate.exchange",
    "action_type": "LOGIN_SUCCESS",
    "action_category": "auth",
    "message": "admin@senate.exchange logged in successfully",
    "created_at": "2024-01-15T08:30:00Z",
    "ip_address": "192.168.1.100"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "admin_email": "admin@senate.exchange",
    "action_type": "CURRENCY_UPDATED",
    "action_category": "currency",
    "message": "admin@senate.exchange updated currency USD: commission changed from 0.20% to 0.25%",
    "details": {
      "currency_code": "USD",
      "currency_name": "US Dollar",
      "before": { "commission": "0.20", "enabled": true },
      "after": { "commission": "0.25", "enabled": true },
      "changes": ["commission"]
    },
    "created_at": "2024-01-15T09:15:00Z",
    "ip_address": "192.168.1.100"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "admin_email": "admin@senate.exchange",
    "action_type": "USER_ADDED",
    "action_category": "user_management",
    "message": "admin@senate.exchange added new admin: operator@senate.exchange",
    "details": {
      "new_user_email": "operator@senate.exchange"
    },
    "created_at": "2024-01-15T10:00:00Z",
    "ip_address": "192.168.1.100"
  }
]
```

---

## 🔧 Backend Architecture Recommendations

### Technology Stack
- **Runtime:** Node.js (Express/Fastify)
- **Database:** PostgreSQL (recommended) or MongoDB
- **ORM:** Prisma or TypeORM
- **Authentication:** JWT + bcrypt/argon2
- **MFA:** otplib (same library, server-side)
- **Validation:** Zod or Joi
- **API:** RESTful or GraphQL

### Security Considerations
1. **Password Hashing:** Use bcrypt (cost factor 10+) or argon2
2. **Session Management:** JWT with refresh tokens
3. **Rate Limiting:** Prevent brute force attacks
4. **CORS:** Configure properly for frontend domain
5. **Input Validation:** Validate all inputs server-side
6. **SQL Injection:** Use parameterized queries
7. **XSS Protection:** Sanitize outputs
8. **HTTPS:** Enforce in production

### API Structure
```
/api
  /auth
    POST /login
    POST /mfa/verify
    POST /logout
    GET /session
  /admin
    /users
      GET /
      POST /
      DELETE /:id
      PUT /:id/password
  /currencies
    GET /
    POST /
    PUT /:id
    DELETE /:id
  /rates
    GET /
    GET /history
    PUT /:id
  /offices
    GET /
    GET /main
    POST /
    PUT /:id
  /settings
    GET /default-commission
    PUT /default-commission
  /calculator
    POST /quote
    POST /lock-quote
```

---

## 🚀 Migration Priority

### Phase 1: Critical Security + Audit Logging (Week 1)
1. Set up database with audit_logs table
2. Move authentication to backend
3. Implement password hashing
4. Move admin user management
5. **Implement comprehensive audit logging system**
6. Log all authentication events (login, logout, MFA)

### Phase 2: Core Business Logic + Audit (Week 2)
1. Move currency management + audit logging
2. Move commission settings + audit logging
3. Move exchange rates + audit logging
4. Move office locations + audit logging
5. **Ensure all CRUD operations are audited**

### Phase 3: Enhanced Features (Week 3-4)
1. Implement rate history
2. Add quote calculation API
3. Add analytics
4. **Build audit log viewer UI in admin panel**
5. Add audit log export functionality
6. Optional: Content management

---

## 📝 Notes

- **Current Security Risk:** Passwords stored in plaintext in localStorage
- **Current Limitation:** All data is client-side, no persistence across devices
- **Current Issue:** No audit trail for changes
- **Current Problem:** Hardcoded rates require code deployment to update
- **Critical Requirement:** **Comprehensive audit logging** - Every admin action must be logged with who, what, when, and simple messages

---

## ✅ Benefits of Migration

1. **Security:** Proper password hashing and session management
2. **Scalability:** Centralized data, can handle multiple admins
3. **Reliability:** Database persistence, no data loss
4. **Comprehensive Audit Trail:** Track every action with who, what, when, and simple messages
5. **Accountability:** Know exactly who made what changes and when
6. **Compliance:** Full audit trail for regulatory requirements
7. **Real-time Updates:** Rates can update without code deployment
8. **Multi-device:** Admins can access from any device
9. **Analytics:** Track usage, quotes, rate changes
10. **Business Logic:** Centralized, consistent calculations
11. **Forensics:** Investigate issues with complete action history

---

## 🚀 IMPLEMENTATION ACTION PLAN

This section provides a detailed, step-by-step plan that any AI assistant can follow to implement the backend migration. Each task is clearly defined with acceptance criteria.

### Project Structure

```
practice/
├── frontend/              # Existing React app (move src/ here)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/               # New Node.js backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── currency.controller.ts
│   │   │   ├── rate.controller.ts
│   │   │   ├── office.controller.ts
│   │   │   └── audit.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── audit.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── models/
│   │   │   ├── Admin.ts
│   │   │   ├── Session.ts
│   │   │   ├── Currency.ts
│   │   │   ├── ExchangeRate.ts
│   │   │   ├── OfficeLocation.ts
│   │   │   └── AuditLog.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── admin.routes.ts
│   │   │   ├── currency.routes.ts
│   │   │   ├── rate.routes.ts
│   │   │   ├── office.routes.ts
│   │   │   └── audit.routes.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── password.service.ts
│   │   │   ├── mfa.service.ts
│   │   │   ├── auditLogger.service.ts
│   │   │   └── rate.service.ts
│   │   ├── utils/
│   │   │   ├── validators.ts
│   │   │   └── errors.ts
│   │   └── app.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── database/
│   └── migrations/        # SQL migration files
└── BACKEND_MIGRATION_ANALYSIS.md
```

---

## 📋 PHASE 1: SETUP & FOUNDATION (Days 1-2)

### Task 1.1: Initialize Backend Project
**Action Items:**
1. Create `backend/` directory in project root
2. Run `npm init -y` in backend directory
3. Install dependencies:
   ```bash
   npm install express cors helmet morgan dotenv
   npm install bcrypt jsonwebtoken otplib
   npm install prisma @prisma/client
   npm install zod express-validator
   npm install --save-dev @types/node @types/express @types/bcrypt @types/jsonwebtoken
   npm install --save-dev typescript ts-node nodemon @types/cors
   ```
4. Create `tsconfig.json` with proper TypeScript config
5. Create `.env` file with placeholders:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/senate_exchange"
   JWT_SECRET="your-secret-key-change-in-production"
   MFA_SECRET="JBSWY3DPEHPK3PXP"
   PORT=3000
   NODE_ENV=development
   ```

**Acceptance Criteria:**
- [ ] Backend directory exists
- [ ] `package.json` has all required dependencies
- [ ] TypeScript compiles without errors
- [ ] `.env` file exists with all required variables

---

### Task 1.2: Setup Database (PostgreSQL)
**Action Items:**
1. Install PostgreSQL locally or use Docker:
   ```bash
   docker run --name senate-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=senate_exchange -p 5432:5432 -d postgres:15
   ```
2. Install Prisma CLI: `npm install -g prisma` or use npx
3. Initialize Prisma: `npx prisma init`
4. Create `prisma/schema.prisma` with all tables (see schema below)
5. Run initial migration: `npx prisma migrate dev --name init`
6. Generate Prisma Client: `npx prisma generate`

**Prisma Schema (prisma/schema.prisma):**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Admin {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  mfaSecret     String?   @map("mfa_secret")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  lastLogin     DateTime? @map("last_login")

  sessions      Session[]
  auditLogs     AuditLog[]

  @@map("admins")
}

model Session {
  id        String   @id @default(uuid())
  adminId   String   @map("admin_id")
  token     String   @unique
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  admin     Admin    @relation(fields: [adminId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Currency {
  id            String   @id @default(uuid())
  code          String   @unique
  name          String
  commissionRate Decimal @map("commission_rate") @db.Decimal(5, 2)
  enabled       Boolean  @default(true)
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@map("currencies")
}

model ExchangeRate {
  id            String   @id @default(uuid())
  fromCurrency  String   @map("from_currency")
  toCurrency    String   @map("to_currency")
  rate          Decimal  @db.Decimal(15, 4)
  changePercent Decimal? @map("change_percent") @db.Decimal(5, 2)
  trend         String?  // 'up', 'down', 'neutral'
  updatedAt     DateTime @updatedAt @map("updated_at")
  updatedById   String?  @map("updated_by_id")

  @@unique([fromCurrency, toCurrency])
  @@map("exchange_rates")
}

model OfficeLocation {
  id        String   @id @default(uuid())
  street    String
  city      String
  postalCode String  @map("postal_code")
  mapUrl    String?  @map("map_url")
  isMain    Boolean  @default(false) @map("is_main")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("office_locations")
}

model Setting {
  key       String   @id
  value     Json
  updatedAt DateTime @updatedAt @map("updated_at")
  updatedById String? @map("updated_by_id")

  @@map("settings")
}

model AuditLog {
  id            String   @id @default(uuid())
  adminId       String?  @map("admin_id")
  adminEmail    String   @map("admin_email")
  actionType    String   @map("action_type")
  actionCategory String  @map("action_category")
  message       String
  details       Json?
  ipAddress     String?  @map("ip_address")
  userAgent     String?  @map("user_agent")
  createdAt     DateTime @default(now()) @map("created_at")

  admin         Admin?   @relation(fields: [adminId], references: [id], onDelete: SetNull)

  @@index([adminId])
  @@index([actionType])
  @@index([actionCategory])
  @@index([createdAt])
  @@index([adminEmail])
  @@map("audit_logs")
}
```

**Acceptance Criteria:**
- [ ] PostgreSQL database is running
- [ ] Prisma schema file exists with all models
- [ ] Migration runs successfully
- [ ] Prisma Client is generated
- [ ] Can connect to database from Node.js

---

### Task 1.3: Create Basic Express App Structure
**Action Items:**
1. Create `backend/src/app.ts`:
   ```typescript
   import express from 'express';
   import cors from 'cors';
   import helmet from 'helmet';
   import morgan from 'morgan';
   import dotenv from 'dotenv';

   dotenv.config();

   const app = express();
   const PORT = process.env.PORT || 3000;

   // Middleware
   app.use(helmet());
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
     credentials: true
   }));
   app.use(morgan('combined'));
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));

   // Health check
   app.get('/health', (req, res) => {
     res.json({ status: 'ok', timestamp: new Date().toISOString() });
   });

   // Routes will be added here

   // Error handling middleware (add later)
   app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
     console.error(err);
     res.status(err.status || 500).json({
       error: err.message || 'Internal server error'
     });
   });

   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });

   export default app;
   ```
2. Create `backend/src/config/database.ts`:
   ```typescript
   import { PrismaClient } from '@prisma/client';

   const prisma = new PrismaClient({
     log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
   });

   export default prisma;
   ```
3. Update `package.json` scripts:
   ```json
   {
     "scripts": {
       "dev": "nodemon --exec ts-node src/app.ts",
       "build": "tsc",
       "start": "node dist/app.js",
       "prisma:generate": "prisma generate",
       "prisma:migrate": "prisma migrate dev",
       "prisma:studio": "prisma studio"
     }
   }
   ```

**Acceptance Criteria:**
- [ ] Express app starts without errors
- [ ] Health check endpoint returns 200
- [ ] CORS is configured for frontend
- [ ] Database connection works

---

## 📋 PHASE 2: AUTHENTICATION SYSTEM (Days 3-4)

### Task 2.1: Create Password Service
**Action Items:**
1. Create `backend/src/services/password.service.ts`:
   ```typescript
   import bcrypt from 'bcrypt';

   const SALT_ROUNDS = 10;

   export class PasswordService {
     static async hash(password: string): Promise<string> {
       return bcrypt.hash(password, SALT_ROUNDS);
     }

     static async verify(password: string, hash: string): Promise<boolean> {
       return bcrypt.compare(password, hash);
     }
   }
   ```

**Acceptance Criteria:**
- [ ] Can hash passwords
- [ ] Can verify passwords against hash
- [ ] Uses bcrypt with salt rounds 10+

---

### Task 2.2: Create MFA Service
**Action Items:**
1. Create `backend/src/services/mfa.service.ts`:
   ```typescript
   import { authenticator } from 'otplib';

   authenticator.options = {
     window: 2,
     step: 30
   };

   export class MFAService {
     static generateSecret(): string {
       return authenticator.generateSecret();
     }

     static generateToken(secret: string): string {
       return authenticator.generate(secret);
     }

     static verifyToken(token: string, secret: string): boolean {
       return authenticator.check(token, secret);
     }

     static getProvisioningUri(email: string, secret: string, issuer: string = 'Senate Exchange'): string {
       return authenticator.keyuri(email, issuer, secret);
     }
   }
   ```

**Acceptance Criteria:**
- [ ] Can generate MFA secrets
- [ ] Can verify MFA tokens
- [ ] Can generate provisioning URIs

---

### Task 2.3: Create JWT Service
**Action Items:**
1. Create `backend/src/services/jwt.service.ts`:
   ```typescript
   import jwt from 'jsonwebtoken';

   const JWT_SECRET = process.env.JWT_SECRET!;
   const JWT_EXPIRES_IN = '8h';

   export interface JWTPayload {
     adminId: string;
     email: string;
   }

   export class JWTService {
     static generate(payload: JWTPayload): string {
       return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
     }

     static verify(token: string): JWTPayload {
       return jwt.verify(token, JWT_SECRET) as JWTPayload;
     }
   }
   ```

**Acceptance Criteria:**
- [ ] Can generate JWT tokens
- [ ] Can verify JWT tokens
- [ ] Tokens expire after 8 hours

---

### Task 2.4: Create Auth Service
**Action Items:**
1. Create `backend/src/services/auth.service.ts`:
   ```typescript
   import prisma from '../config/database';
   import { PasswordService } from './password.service';
   import { MFAService } from './mfa.service';
   import { JWTService } from './jwt.service';
   import { AuditLogger, ActionType, ActionCategory } from './auditLogger.service';

   export class AuthService {
     static async login(email: string, password: string, req: any) {
       const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase() } });

       if (!admin) {
         await AuditLogger.log({
           adminId: null,
           adminEmail: email,
           actionType: ActionType.LOGIN_FAILED,
           actionCategory: ActionCategory.AUTH,
           message: `Failed login attempt for ${email}`,
           ...AuditLogger.getClientInfo(req),
         });
         throw new Error('Invalid credentials');
       }

       const isValid = await PasswordService.verify(password, admin.passwordHash);
       if (!isValid) {
         await AuditLogger.log({
           adminId: admin.id,
           adminEmail: admin.email,
           actionType: ActionType.LOGIN_FAILED,
           actionCategory: ActionCategory.AUTH,
           message: `Failed login attempt for ${admin.email}`,
           ...AuditLogger.getClientInfo(req),
         });
         throw new Error('Invalid credentials');
       }

       // Update last login
       await prisma.admin.update({
         where: { id: admin.id },
         data: { lastLogin: new Date() }
       });

       await AuditLogger.log({
         adminId: admin.id,
         adminEmail: admin.email,
         actionType: ActionType.LOGIN_SUCCESS,
         actionCategory: ActionCategory.AUTH,
         message: `${admin.email} logged in successfully`,
         ...AuditLogger.getClientInfo(req),
       });

       return {
         admin: {
           id: admin.id,
           email: admin.email,
           mfaSecret: admin.mfaSecret
         }
       };
     }

     static async verifyMFA(adminId: string, token: string, req: any) {
       const admin = await prisma.admin.findUnique({ where: { id: adminId } });
       if (!admin || !admin.mfaSecret) {
         throw new Error('Admin not found or MFA not configured');
       }

       const isValid = MFAService.verifyToken(token, admin.mfaSecret);
       if (!isValid) {
         await AuditLogger.log({
           adminId: admin.id,
           adminEmail: admin.email,
           actionType: ActionType.MFA_FAILED,
           actionCategory: ActionCategory.AUTH,
           message: `Failed MFA verification for ${admin.email}`,
           ...AuditLogger.getClientInfo(req),
         });
         throw new Error('Invalid MFA token');
       }

       await AuditLogger.log({
         adminId: admin.id,
         adminEmail: admin.email,
         actionType: ActionType.MFA_VERIFIED,
         actionCategory: ActionCategory.AUTH,
         message: `${admin.email} verified MFA code`,
         ...AuditLogger.getClientInfo(req),
       });

       // Create session
       const jwtToken = JWTService.generate({ adminId: admin.id, email: admin.email });
       const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

       await prisma.session.create({
         data: {
           adminId: admin.id,
           token: jwtToken,
           expiresAt
         }
       });

       return { token: jwtToken, admin: { id: admin.id, email: admin.email } };
     }

     static async logout(token: string, req: any) {
       const session = await prisma.session.findUnique({ where: { token } });
       if (session) {
         const admin = await prisma.admin.findUnique({ where: { id: session.adminId } });
         if (admin) {
           await AuditLogger.log({
             adminId: admin.id,
             adminEmail: admin.email,
             actionType: ActionType.LOGOUT,
             actionCategory: ActionCategory.AUTH,
             message: `${admin.email} logged out`,
             ...AuditLogger.getClientInfo(req),
           });
         }
         await prisma.session.delete({ where: { token } });
       }
     }
   }
   ```

**Acceptance Criteria:**
- [ ] Login validates credentials
- [ ] MFA verification works
- [ ] Sessions are created in database
- [ ] All auth actions are logged

---

### Task 2.5: Create Auth Middleware
**Action Items:**
1. Create `backend/src/middleware/auth.middleware.ts`:
   ```typescript
   import { Request, Response, NextFunction } from 'express';
   import { JWTService } from '../services/jwt.service';
   import prisma from '../config/database';

   export interface AuthRequest extends Request {
     user?: {
       id: string;
       email: string;
     };
   }

   export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
     try {
       const token = req.headers.authorization?.replace('Bearer ', '');
       if (!token) {
         return res.status(401).json({ error: 'No token provided' });
       }

       const payload = JWTService.verify(token);
       const session = await prisma.session.findUnique({
         where: { token },
         include: { admin: true }
       });

       if (!session || session.expiresAt < new Date()) {
         return res.status(401).json({ error: 'Invalid or expired session' });
       }

       req.user = {
         id: payload.adminId,
         email: payload.email
       };

       next();
     } catch (error) {
       return res.status(401).json({ error: 'Invalid token' });
     }
   };
   ```

**Acceptance Criteria:**
- [ ] Middleware validates JWT tokens
- [ ] Middleware checks session in database
- [ ] Sets req.user for authenticated requests
- [ ] Returns 401 for invalid tokens

---

### Task 2.6: Create Auth Routes & Controller
**Action Items:**
1. Create `backend/src/controllers/auth.controller.ts`
2. Create `backend/src/routes/auth.routes.ts`
3. Wire up routes in `app.ts`

**Acceptance Criteria:**
- [ ] `POST /api/auth/login` - Returns admin info (requires MFA)
- [ ] `POST /api/auth/mfa/verify` - Returns JWT token
- [ ] `POST /api/auth/logout` - Destroys session
- [ ] `GET /api/auth/session` - Validates current session

---

## 📋 PHASE 3: AUDIT LOGGING SYSTEM (Day 5)

### Task 3.1: Create Audit Logger Service
**Action Items:**
1. Create `backend/src/services/auditLogger.service.ts` with all action types and categories
2. Implement all helper methods (logLogin, logPasswordChange, etc.)
3. Add getClientInfo method

**Acceptance Criteria:**
- [ ] All action types defined
- [ ] Can log any action with simple message
- [ ] Stores before/after values in details JSONB
- [ ] Captures IP and user agent

---

### Task 3.2: Create Audit Routes
**Action Items:**
1. Create `backend/src/controllers/audit.controller.ts`:
   - `GET /api/audit-logs` - List logs with filters
   - `GET /api/audit-logs/export` - Export as CSV
2. Create `backend/src/routes/audit.routes.ts`
3. Add pagination, filtering by admin, action type, date range

**Acceptance Criteria:**
- [ ] Can query audit logs
- [ ] Supports filtering and pagination
- [ ] Can export to CSV
- [ ] Only accessible to authenticated admins

---

## 📋 PHASE 4: ADMIN USER MANAGEMENT (Day 6)

### Task 4.1: Create Admin Service
**Action Items:**
1. Create `backend/src/services/admin.service.ts`:
   - `getAllAdmins()`
   - `addAdmin(email, password)`
   - `removeAdmin(adminId)`
   - `updatePassword(adminId, newPassword)`
2. All actions must log to audit system

**Acceptance Criteria:**
- [ ] Can list all admins
- [ ] Can add new admin (hashes password)
- [ ] Can remove admin
- [ ] Can update own password
- [ ] All actions are audited

---

### Task 4.2: Create Admin Routes
**Action Items:**
1. Create `backend/src/controllers/admin.controller.ts`
2. Create `backend/src/routes/admin.routes.ts`
3. Protect all routes with authMiddleware

**Acceptance Criteria:**
- [ ] `GET /api/admin/users` - List admins
- [ ] `POST /api/admin/users` - Add admin
- [ ] `DELETE /api/admin/users/:id` - Remove admin
- [ ] `PUT /api/admin/users/:id/password` - Update password

---

## 📋 PHASE 5: CURRENCY MANAGEMENT (Day 7)

### Task 5.1: Create Currency Service
**Action Items:**
1. Create `backend/src/services/currency.service.ts`:
   - `getAllCurrencies()`
   - `addCurrency(code, name, commission)`
   - `updateCurrency(id, data)`
   - `toggleCurrency(id, enabled)`
   - `deleteCurrency(id)`
2. Log all changes with before/after values

**Acceptance Criteria:**
- [ ] All CRUD operations work
- [ ] Commission validation (0-100)
- [ ] All changes are audited

---

### Task 5.2: Create Currency Routes
**Action Items:**
1. Create `backend/src/controllers/currency.controller.ts`
2. Create `backend/src/routes/currency.routes.ts`

**Acceptance Criteria:**
- [ ] `GET /api/currencies` - List currencies
- [ ] `POST /api/currencies` - Add currency
- [ ] `PUT /api/currencies/:id` - Update currency
- [ ] `DELETE /api/currencies/:id` - Delete currency

---

## 📋 PHASE 6: EXCHANGE RATES (Day 8)

### Task 6.1: Create Rate Service
**Action Items:**
1. Create `backend/src/services/rate.service.ts`:
   - `getAllRates()`
   - `updateRate(fromCurrency, toCurrency, rate, changePercent, trend)`
   - `bulkUpdateRates(rates)`
2. Store rate history for analytics

**Acceptance Criteria:**
- [ ] Can get current rates
- [ ] Can update individual rates
- [ ] Can bulk update rates
- [ ] All updates are audited

---

### Task 6.2: Create Rate Routes
**Action Items:**
1. Create `backend/src/controllers/rate.controller.ts`
2. Create `backend/src/routes/rate.routes.ts`

**Acceptance Criteria:**
- [ ] `GET /api/rates` - Get all rates
- [ ] `PUT /api/rates/:id` - Update rate
- [ ] `POST /api/rates/bulk` - Bulk update

---

## 📋 PHASE 7: OFFICE LOCATIONS (Day 9)

### Task 7.1: Create Office Service
**Action Items:**
1. Create `backend/src/services/office.service.ts`:
   - `getAllOffices()`
   - `getMainOffice()`
   - `addOffice(data)`
   - `updateOffice(id, data)`
   - `deleteOffice(id)`
   - `setMainOffice(id)`

**Acceptance Criteria:**
- [ ] All CRUD operations work
- [ ] Can set main office
- [ ] All changes are audited

---

### Task 7.2: Create Office Routes
**Action Items:**
1. Create `backend/src/controllers/office.controller.ts`
2. Create `backend/src/routes/office.routes.ts`

**Acceptance Criteria:**
- [ ] `GET /api/offices` - List offices
- [ ] `GET /api/offices/main` - Get main office
- [ ] `POST /api/offices` - Add office
- [ ] `PUT /api/offices/:id` - Update office
- [ ] `DELETE /api/offices/:id` - Delete office

---

## 📋 PHASE 8: FRONTEND INTEGRATION (Days 10-12)

### Task 8.1: Create API Client
**Action Items:**
1. Create `frontend/src/lib/api.ts`:
   ```typescript
   const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

   export const api = {
     auth: {
       login: (email: string, password: string) => {...},
       verifyMFA: (adminId: string, token: string) => {...},
       logout: () => {...},
     },
     admin: {
       getUsers: () => {...},
       addUser: (email: string, password: string) => {...},
       removeUser: (id: string) => {...},
       updatePassword: (id: string, password: string) => {...},
     },
     // ... other endpoints
   };
   ```

**Acceptance Criteria:**
- [ ] All API endpoints are wrapped
- [ ] Handles authentication tokens
- [ ] Error handling

---

### Task 8.2: Update Admin Panel
**Action Items:**
1. Replace localStorage calls with API calls
2. Update all forms to use API
3. Add loading states
4. Add error handling

**Acceptance Criteria:**
- [ ] Admin panel works with backend
- [ ] All CRUD operations work
- [ ] Proper error messages

---

### Task 8.3: Add Audit Log Viewer
**Action Items:**
1. Create new tab "Audit Logs" in admin panel
2. Display logs in table
3. Add filters (admin, action type, date range)
4. Add export functionality

**Acceptance Criteria:**
- [ ] Can view audit logs
- [ ] Can filter logs
- [ ] Can export to CSV
- [ ] Messages are human-readable

---

## 📋 PHASE 9: TESTING & DEPLOYMENT (Days 13-14)

### Task 9.1: Seed Initial Data
**Action Items:**
1. Create `backend/prisma/seed.ts`:
   - Create default admin user
   - Create default currencies
   - Create default rates
   - Create default office location

**Acceptance Criteria:**
- [ ] Can run seed script
- [ ] Default data is created

---

### Task 9.2: Testing
**Action Items:**
1. Test all API endpoints
2. Test authentication flow
3. Test audit logging
4. Test error handling

**Acceptance Criteria:**
- [ ] All endpoints work
- [ ] Authentication is secure
- [ ] All actions are logged
- [ ] Error handling works

---

### Task 9.3: Environment Configuration
**Action Items:**
1. Create `.env.example` files
2. Document all environment variables
3. Setup production configs

**Acceptance Criteria:**
- [ ] Environment variables documented
- [ ] Production configs ready

---

## ✅ FINAL CHECKLIST

Before considering migration complete:

- [ ] All database tables created
- [ ] All API endpoints implemented
- [ ] Authentication works end-to-end
- [ ] All admin actions are audited
- [ ] Frontend integrated with backend
- [ ] Audit log viewer works
- [ ] Error handling implemented
- [ ] Security best practices followed
- [ ] Documentation complete
- [ ] Initial data seeded

---

## 🔧 HELPFUL COMMANDS

```bash
# Backend
cd backend
npm run dev                    # Start dev server
npm run build                  # Build for production
npx prisma migrate dev         # Run migrations
npx prisma generate            # Generate Prisma client
npx prisma studio              # Open database GUI

# Database
docker ps                      # Check if PostgreSQL is running
docker logs senate-db          # Check database logs

# Testing
curl http://localhost:3000/health
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@senate.exchange","password":"senate2024"}'
```

---

## 📚 KEY FILES TO CREATE

1. `backend/src/services/auditLogger.service.ts` - Audit logging service
2. `backend/src/services/auth.service.ts` - Authentication logic
3. `backend/src/services/password.service.ts` - Password hashing
4. `backend/src/middleware/auth.middleware.ts` - Auth middleware
5. `backend/prisma/schema.prisma` - Database schema
6. `frontend/src/lib/api.ts` - API client

---

## 🎯 SUCCESS CRITERIA

The migration is successful when:
1. ✅ All data is stored in PostgreSQL (not localStorage)
2. ✅ Passwords are hashed (not plaintext)
3. ✅ Every admin action is logged with simple messages
4. ✅ Frontend works with backend API
5. ✅ Audit logs can be viewed and exported
6. ✅ Authentication is secure (JWT + MFA)
7. ✅ All CRUD operations work
8. ✅ Error handling is proper

---

This plan provides clear, actionable steps that any AI assistant can follow to implement the backend migration systematically.


----------------------
understand the @BACKEND_MIGRATION_ANALYSIS.md  and this project start actioning on it

and I want clear steps in readme.md about this project and steps to run this application locally and on aws ECS
