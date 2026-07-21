# Pharmacy Management (Frontend)

A modern inventory and billing management system for pharmacies, built with React, Vite, and Redux Toolkit. This app features robust authentication, role-based access, and persistent login across reloads for a seamless user experience.

## Features
- User authentication with role-based access (Admin, Manager, User)
- Persistent login (token and user info stored in localStorage)
- Inventory management: companies, items, HSN, racks, salts, stores, units, manufacturers
- Purchase and billing modules
- Responsive dashboard and sidebar navigation
- Customizable data tables and modals
- Error boundaries and loading states

## Authentication Persistence
- On login, the authentication token and user info are saved to `localStorage`.
- On app load, the app restores authentication state from `localStorage` before rendering protected content.
- On logout, all authentication data is cleared from both Redux and `localStorage`.

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation
```bash
npm install
# or
yarn install
```

### Running the App
```bash
npm run dev
# or
yarn dev
```
The app will be available at `http://localhost:5173` by default.

### Building for Production
```bash
npm run build
# or
yarn build
```

### Environment Variables
Create a `.env` file in the root with the following (example):
```
VITE_BACKEND_BASE_URL=http://localhost:5000
```

## Project Structure
```
pharmacy-management-frontend/
├── public/                # Static assets
├── src/
│   ├── componets/         # UI components (auth, common, dashboard, layout)
│   ├── pages/             # Page components (dashboard, masters, purchase, etc.)
│   ├── services/          # API logic and Redux slices
│   ├── data/              # Static/mock data and permissions
│   ├── routes/            # App routes and protected route logic
│   ├── store.js           # Redux store setup
│   └── main.jsx           # App entry point
├── package.json
├── vite.config.js
└── README.md
```

## License
This project is for demonstration and educational purposes.

---
For questions or support, contact: support@example.com
