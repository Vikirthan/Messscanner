# Mess Management PWA - Office Meal Scanner System

A Progressive Web App (PWA) for managing office mess operations, enabling workers to log meals through a scanner interface and providing admins with monthly consumption reports for automatic salary deductions.

## Features

### 🔐 Worker Features
- **Secure Login**: Worker ID + Password authentication
- **Meal Scanning**: One-tap meal registration (Rs 22 per meal)
- **Personal Dashboard**: View meal history and running salary deductions
- **Offline Support**: Meals logged while offline sync when reconnected
- **Responsive Design**: Works seamlessly on phones, tablets, and desktops

### 📊 Admin Features
- **Monthly Reports**: View all workers' meal consumption by month
- **Salary Deductions**: Automatic calculation (Rs 22 per meal)
- **Export Reports**: Download meal data as CSV for payroll integration
- **Data Management**: Clear historical records when needed
- **Worker Statistics**: See meals per worker with department info

### 📱 PWA Capabilities
- **Offline-First**: Works without internet connection
- **Installable**: Add to home screen on mobile and desktop
- **Fast Loading**: Service Worker caching for instant load times
- **Sync Support**: Automatically syncs data when connection restored

## Demo Credentials

| Role | ID | Password |
|------|-----|----------|
| Worker | W001 | password123 |
| Worker | W002 | password123 |
| Worker | W003 | password123 |
| Worker | W004 | password123 |
| Worker | W005 | password123 |
| Admin | — | No password (direct access) |

## Tech Stack

- **Frontend**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Browser LocalStorage
- **PWA**: Service Worker + Web App Manifest
- **Deployment**: Vercel-ready

## Installation & Setup

### Prerequisites
- Node.js 18+ (with npm)
- Git (optional)

### Quick Start

1. **Navigate to project**
```bash
cd c:\Users\deepa\Downloads\ATIMOTORS_LUNCH
```

2. **Install dependencies** (if not already installed)
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## Usage Guide

### For Workers

1. **Login**
   - Enter your Worker ID (e.g., W001)
   - Enter password (password123)
   - Click "Login"

2. **Scan Meal**
   - Tap the large green "Scan Meal" button on dashboard
   - Meal is recorded with Rs 22 charge
   - View in recent meals list

3. **View History**
   - See all meals with date and time
   - View total monthly deduction
   - Check last meal scanned

4. **Logout**
   - Click "Logout" button in header

### For Admins

1. **Access Dashboard**
   - Click "Admin Dashboard" on login page
   - No password required for demo (add authentication in production)

2. **View Reports**
   - Select month using navigation buttons
   - See worker meal counts and deductions
   - Toggle between months

3. **Export Data**
   - Click "📥 Export CSV" to download report
   - Use for payroll system integration
   - Format: Worker ID, Name, Department, Meals, Deduction (Rs)

4. **Manage Data**
   - Clear all records with "🗑️ Clear Data" button
   - Use caution - action cannot be undone

## File Structure

```
ATIMOTORS_LUNCH/
├── app/
│   ├── layout.tsx              # Root layout with PWA config
│   ├── page.tsx                # Login page
│   ├── globals.css             # Global styles
│   ├── dashboard/
│   │   └── page.tsx            # Worker dashboard
│   └── admin/
│       └── page.tsx            # Admin dashboard
├── lib/
│   ├── auth.ts                 # Authentication logic
│   └── storage.ts              # LocalStorage management
├── components/
│   └── ServiceWorkerRegister.tsx # PWA registration
├── public/
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service Worker
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind configuration
└── package.json                # Dependencies
```

## Key Features Explained

### Meal Storage (LocalStorage)
- All meals stored in browser with worker ID and timestamp
- Data persists even after closing the app
- Grouped by worker and month for reporting

### Salary Calculation
- Each meal = Rs 22 charge
- Automatically deducted from monthly salary
- Admin can see per-worker breakdown

### PWA Offline Support
- Service Worker caches app shell
- Meals can be logged offline
- Data syncs when online (within same session)
- No backend currently - uses browser storage only

## Development

### Build Production Version
```bash
npm run build
npm start
```

### Run Type Checking
```bash
npx tsc --noEmit
```

### Lint Code
```bash
npm run lint
```

## API Routes (Ready for Backend Integration)

Currently using mock data. To integrate with backend:

1. Replace `lib/auth.ts` - Connect to actual user database
2. Update `lib/storage.ts` - Sync with backend API
3. Add environment variables for API endpoints
4. Implement real-time sync with WebSocket

## PWA Installation

### On Mobile (iOS/Android)
1. Open in browser
2. Tap share menu
3. Select "Add to Home Screen"
4. App appears as installed app

### On Desktop
1. Click install prompt in address bar
2. Or: Menu → More tools → "Create shortcut"
3. Launch from Start menu or desktop

## Future Enhancements

- [ ] Backend API integration (Node.js/Express)
- [ ] Database for persistent storage (MongoDB/PostgreSQL)
- [ ] Real authentication system
- [ ] Image-based QR code meal scanning
- [ ] Biometric login
- [ ] Monthly bill PDF generation
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Analytics dashboard

## Troubleshooting

### App Won't Load
- Clear browser cache
- Check if dev server is running: `npm run dev`
- Verify localhost:3000 is accessible

### Meals Not Saving
- Check browser console for errors
- Ensure LocalStorage is enabled
- Try private/incognito window

### PWA Won't Install
- Service Worker must be registered (check console)
- HTTPS required in production (localhost works)
- Manifest.json must be valid

### Data Lost After Reload
- Data is stored in LocalStorage - check if enabled
- Try exporting data before clearing
- Browser storage may be cleared by cache management

## Contact & Support

For issues or questions:
1. Check troubleshooting section above
2. Review browser console for errors
3. Restart dev server: `npm run dev`

## License

This project is for internal office use. All rights reserved.

---

**Last Updated**: 2026-07-01  
**Version**: 1.0.0  
**Status**: Development / Demo
