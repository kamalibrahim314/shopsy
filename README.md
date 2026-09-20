# Shopsy - Full-Stack Fashion E-Commerce Monorepo

Shopsy is a modern, production-ready full-stack fashion e-commerce application structured as a monorepo containing a React frontend and a Node.js Express backend.

## Architecture & Tech Stack

- **Monorepo Architecture**:
  - `src/` & `public/`: React frontend with Tailwind CSS and Redux Toolkit / RTK Query.
  - `api/`: Node.js / Express backend with Sequelize ORM and TiDB Cloud (MySQL-compatible).
- **Frontend**:
  - React 18, React Router v7, Redux Toolkit & RTK Query
  - Tailwind CSS with cohesive Light / Dark mode
  - Responsive design with sticky footer layout across mobile, tablet, and desktop viewports
- **Backend**:
  - Node.js (ES Modules), Express 5
  - Sequelize ORM with serverless connection pooling
  - TiDB Cloud Starter (MySQL-compatible with SSL/TLS)
  - Cloudinary for persistent media storage with memory-stream uploads
  - JWT authentication using HTTP-only secure cross-origin cookies and Authorization Bearer headers
  - Security hardening: Helmet, CORS, rate limiting, and XSS sanitization

## Main Features

- **Product Catalog & Filtering**: Search, filter by category/price, sorting, pagination, and stock tracking.
- **Product Details**: Multi-angle image gallery, size & color selection, stock availability, and trust guarantees.
- **Cart & Express Checkout**: Real-time shopping bag synchronization, automated tax/shipping calculations, cash-on-delivery & credit card options.
- **Order Tracking**: Visual multi-step fulfillment journey (`pending` -> `processing` -> `shipped` -> `delivered`).
- **User Dashboard**: Profile details, address book (add, remove, set default), and password change.
- **Admin Control Center**: Product creation with Cloudinary image upload, inventory management, and order status updates.

## Project Structure

```text
├── api/                     # Backend Express API
│   ├── api/
│   │   └── index.js         # Vercel Serverless Function entrypoint
│   ├── src/
│   │   ├── DB/              # Sequelize connection, models, and associations
│   │   ├── middleware/      # Auth, upload, and validation middleware
│   │   ├── modules/         # Modular controllers, routes, and schemas
│   │   ├── services/        # Cloudinary service integration
│   │   └── app.controller.js # Express app initialization & server bootstrap
│   ├── .env.example         # Backend environment variable template
│   ├── .gitignore           # Backend gitignore
│   ├── package.json         # Backend dependencies
│   ├── server.js            # Local development server entrypoint
│   └── vercel.json          # Vercel routing configuration
├── src/                     # React Frontend
│   ├── components/          # Reusable UI components (Navbar, Footer, Product cards)
│   ├── pages/               # Application pages (Home, Shop, Cart, Checkout, Orders, Profile, Admin)
│   └── redux/               # Redux Toolkit store and RTK Query API slices
├── public/                  # Static assets & HTML template
├── .gitignore               # Root gitignore protecting all secrets
├── package.json             # Frontend dependencies & scripts
└── README.md                # Project documentation
```

## Local Development

### 1. Backend Setup

```bash
cd api
npm install

# Create local environment file from template
cp .env.example .env
# Fill in your TiDB/MySQL database credentials, JWT secret, and Cloudinary keys in api/.env

# Start backend server (runs on http://localhost:5001)
npm run dev
```

### 2. Frontend Setup

In a separate terminal at the project root:

```bash
# Install frontend dependencies
npm install

# Start React development server (runs on http://localhost:3000)
npm start
```

## Environment Variables

### Backend (`api/.env`)

Refer to `api/.env.example`:

| Variable | Description |
| :--- | :--- |
| `NODE_ENV` | `development` or `production` |
| `PORT` | Local server port (default `5001`) |
| `ALLOWED_ORIGIN` | Comma-separated list of allowed frontend origins |
| `MYSQL_HOST` | TiDB Cloud Gateway host |
| `MYSQL_PORT` | TiDB Cloud port (default `4000`) |
| `MYSQL_USER` | TiDB Cloud username |
| `MYSQL_PASSWORD` | TiDB Cloud password |
| `MYSQL_DATABASE` | Database name (`Shopsy`) |
| `MYSQL_TIMEZONE` | Database timezone (e.g. `+02:00` or `+00:00`) |
| `MYSQL_POOL_MAX` | Max pool connections (`2` in production, `10` in dev) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiration duration (default `7d`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret |

## Deployment to Vercel

This single GitHub monorepo is deployed to Vercel using two separate projects:

### 1. Backend Vercel Project
- **Root Directory**: `api`
- **Framework Preset**: `Other`
- **Build Command**: Leave empty
- **Output Directory**: Leave empty
- **Environment Variables**: Add all variables from `api/.env.example`

### 2. Frontend Vercel Project
- **Root Directory**: `.` (project root)
- **Framework Preset**: `Create React App`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Environment Variables**:
  - `REACT_APP_API_URL`: URL of the deployed backend Vercel project (e.g. `https://shopsy-api.vercel.app`)

## License

ISC
