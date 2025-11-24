# Senate Exchange - Currency Exchange Platform

A simple, client-side currency exchange platform for Nepal, built with React, TypeScript, and Tailwind CSS. This application provides real-time exchange rates, a live calculator, and an admin panel for managing currencies and office location.

## 📋 Project Overview

Senate Exchange is a client-side application that allows users to:
- View real-time exchange rates for enabled currencies (e.g., USDT → NPR)
- Calculate exchange quotes with live rates
- Access admin panel for managing currencies, exchange rates, users, and office location
- Secure authentication with Google Authenticator MFA

### Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for routing
- **localStorage** for data persistence
- **bcryptjs** for password hashing
- **otplib** for MFA (Google Authenticator)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Admin Panel Access

1. Navigate to `/admin` in your browser
2. Login with:
   - **Email:** `adhiadarsh91@gmail.com`
   - **Password:** `admin123`
3. Complete MFA verification using Google Authenticator
   - MFA Secret: `JBSWY3DPEHPK3PXP` (configure in Google Authenticator)

## 📝 Admin Panel Features

### Currencies & Exchange Rates
- **Add Currency:** Add new currencies with exchange rates (e.g., 1 USDT = 133.20 NPR)
- **Update Rate:** Modify exchange rates for existing currencies
- **Enable/Disable:** Toggle currency visibility on the public site
- **Delete Currency:** Remove currencies from the system

### Users & Security
- **Add Admin:** Create new admin users with email and password
- **Change Password:** Update your own password
- **Delete User:** Remove admin users from the system

### Office Location
- **Update Location:** Modify office address, city, postal code, and map URL

## 💾 Data Storage

Data is stored in two places:

### 1. Browser localStorage (Runtime)
- **Storage key:** `senate_exchange_data`
- **Purpose:** Fast runtime access
- **Location:** Browser's localStorage
- **Auto-saved:** Every time data changes

### 2. JSON File (Persistent)
- **File location:** `public/data/data.json`
- **Purpose:** Persistent storage, backup, and version control
- **Auto-export:** Data is automatically exported on every save
- **Manual import:** Use the Data Management tab in admin panel

**Data includes:**
- **Users:** Admin user accounts with hashed passwords
- **Currencies:** Currency codes, names, exchange rates, and enabled status
- **Office Location:** Street, city, postal code, and map URL

**How it works:**
1. Data is saved to localStorage for fast runtime access
2. On every save, `data.json` is automatically downloaded
3. Place the downloaded file in `public/data/` folder
4. On app startup, data is loaded from `public/data/data.json` if available
5. If no file exists, default data is created

## 📁 Project Structure

```
lovable/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── lib/            # Services and utilities
│   │   ├── dataService.ts    # localStorage data management
│   │   ├── authService.ts     # Authentication & password hashing
│   │   └── session.ts         # Session management
│   ├── hooks/          # Custom React hooks
│   └── assets/         # Images and static assets
├── public/             # Public assets
├── index.html          # HTML entry point
├── package.json        # Dependencies
├── vite.config.ts      # Vite configuration
└── tailwind.config.ts  # Tailwind configuration
```

## 🔒 Security Features

- **Password Hashing:** bcryptjs with salt rounds
- **MFA (Multi-Factor Authentication):** Google Authenticator TOTP support
- **Session Management:** JWT tokens stored in localStorage
- **Input Validation:** Comprehensive validation on all admin operations
- **Password Requirements:** Minimum 8 characters

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Application won't start
- Ensure Node.js 20+ is installed
- Check that all dependencies are installed: `npm install`
- Clear node_modules and reinstall if needed

### Admin panel shows errors
- Check browser console for errors
- Ensure localStorage is enabled in your browser
- Clear browser cache and localStorage if needed

### MFA verification fails
- Ensure MFA secret matches: `JBSWY3DPEHPK3PXP`
- Check system time is synchronized (TOTP is time-based)
- Verify Google Authenticator is configured correctly

## 📄 License

ISC


------------------------------
reload the site is asking me to save @data.json file, I dont wwant that, I want appication to fetch and update persitent data from public/data/data.json when I running locally, and from S3 bucket when I am hosting it on aws