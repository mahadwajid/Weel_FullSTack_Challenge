# Delivery Order Management System

A full-stack web application for managing delivery orders with user authentication, order creation, and order management features.

##  Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Login Credentials](#login-credentials)
- [Project Structure](#project-structure)
- [Design Choices](#design-choices)
- [Improvements Made](#improvements-made)
- [Running Tests](#running-tests)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

## Features

- **User Authentication**: Secure login with JWT tokens
- **Order Management**: Create, view, and edit delivery orders
- **Delivery Types**: Support for In-Store, Home Delivery, and Curbside pickup
- **Form Validation**: Client and server-side validation
- **Responsive Design**: Works on desktop and mobile devices
- **Protected Routes**: Only authenticated users can access order pages

##  Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **Sequelize** ORM for database operations
- **JWT** for authentication
- **bcrypt** for password hashing

### Frontend
- **React 19** with React Router
- **Axios** for API calls
- **Context API** for state management

### Infrastructure
- **Docker** and Docker Compose for containerization

## Quick Start

### Prerequisites

Before you begin, make sure you have:
- **Docker Desktop** installed and running ([Download here](https://www.docker.com/products/docker-desktop/))
- **Node.js** (v18 or higher) - Only needed if running without Docker

### Option 1: Using Docker (Recommended - Easiest Way)

1. **Open Terminal/Command Prompt** in the project folder:
   ```bash
   cd D:\Weel_FullSTack_Challenge
   ```

2. **Start all services**:
   ```bash
   cd infra
   docker-compose up --build
   ```

3. **Wait for services to start** (about 1-2 minutes). You'll see:
   - "Database is ready!"
   - "Migrations completed"
   - "Seeds completed"
   - "Backend running on 8080"
   - "Compiled successfully!"

4. **Open your browser** and go to: `http://localhost:3000`

5. **Login** with the credentials below

**To stop the application:**
- Press `Ctrl + C` in the terminal
- Then run: `docker-compose down`

### Option 2: Local Development (Without Docker)

#### Setup Backend

1. **Install PostgreSQL** and create a database named `appdb`

2. **Navigate to backend folder**:
   ```bash
   cd Backend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Create `.env` file** in the `Backend` folder:
   ```env
   DATABASE_URL=postgres://your_username:your_password@localhost:5432/appdb
   JWT_SECRET=supersecret
   PORT=8080
   ```

5. **Run migrations and seeds**:
   ```bash
   npm run migrate
   npm run seed
   ```

6. **Start the backend server**:
   ```bash
   npm run dev
   ```

#### Setup Frontend

1. **Open a new terminal** and navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the frontend**:
   ```bash
   npm start
   ```

4. **Open your browser** at `http://localhost:3000`

## Environment Variables

### Backend `.env` File

Create a `.env` file in the `Backend` folder with the following variables:

```env
# Database Connection
DATABASE_URL=postgres://your_username:your_password@localhost:5432/appdb

# JWT Secret Key (use a strong secret in production)
JWT_SECRET=supersecret

# Server Port (default: 8080)
PORT=8080
```

**Example for local PostgreSQL:**
```env
DATABASE_URL=postgres://postgres:mypassword@localhost:5432/appdb
JWT_SECRET=my-super-secret-jwt-key-12345
PORT=8080
```

### Frontend `.env` File (Optional)

Create a `.env` file in the `frontend` folder if you need to change the API URL:

```env
# Backend API URL (default: http://localhost:8080)
REACT_APP_API_URL=http://localhost:8080
```

**Note:** 
- For Docker setup, you don't need to create `.env` files - everything is configured in `docker-compose.yml`
- For local development, create the `.env` files as shown above
- Never commit `.env` files to version control (they're already in `.gitignore`)

## Login Credentials

Use these credentials to login:

- **Email**: `user@example.com`
- **Password**: `password123`

> **Note**: This user is automatically created when you run the database seeds.

##  Project Structure

```
Weel_FullSTack_Challenge/
├── Backend/                    # Express.js API server
│   ├── src/
│   │   ├── __tests__/          # Backend tests
│   │   ├── config/             # Database configuration
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # Auth & validation
│   │   ├── migrations/        # Database migrations
│   │   ├── models/             # Sequelize models
│   │   ├── routes/             # API routes
│   │   ├── seeders/            # Database seeds
│   │   └── index.js            # Server entry point
│   └── package.json
├── frontend/                   # React application
│   ├── src/
│   │   ├── __tests__/          # Frontend tests
│   │   ├── Pages/              # Page components
│   │   ├── Context/            # Auth context
│   │   └── App.js              # Main app component
│   └── package.json
└── infra/                      # Docker configuration
    └── docker-compose.yml
```

## Design Choices

### Color Scheme
- **Black, White, and Grey Theme**: Clean, professional, and modern look
- **Dark Background** (#1a1a1a) for main pages
- **White Cards** for content areas
- **Grey Accents** for borders and secondary elements

### Login Page
- **Split Layout**: 
  - Left side: Dark gradient with welcome message and animated pattern
  - Right side: Clean white form section
- **Responsive**: Stacks vertically on mobile devices

### User Experience
- **Card-based Design**: All forms and content in clean white cards
- **Smooth Animations**: Fade-in effects for better visual appeal
- **Clear Labels**: All form fields have descriptive labels
- **Error Messages**: Red error messages with clear explanations
- **Loading States**: Shows loading indicators during API calls

### Form Design
- **Conditional Fields**: Phone and address fields appear based on delivery type
- **Date/Time Picker**: Easy-to-use datetime picker that closes automatically
- **Validation**: Real-time validation with helpful error messages

## Improvements Made

### Backend Improvements
1. **Database Migrations**: Proper Sequelize migrations instead of auto-sync
2. **Database Seeds**: Automatic user creation on setup
3. **Validation Middleware**: Centralized validation logic
4. **Error Handling**: Consistent error responses
5. **Code Organization**: Separated controllers, routes, and middleware
6. **ES Module Support**: Modern JavaScript with ES6 imports

### Frontend Improvements
1. **Protected Routes**: Authentication guards for secure pages
2. **Edit Functionality**: Ability to edit existing orders
3. **Better Error Handling**: User-friendly error messages
4. **Loading States**: Visual feedback during operations
5. **Responsive Design**: Works on all screen sizes
6. **Modern UI**: Clean, professional design with smooth animations

### Infrastructure Improvements
1. **Docker Setup**: Easy deployment with Docker Compose
2. **Database Wait Script**: Ensures database is ready before starting backend
3. **Environment Variables**: Proper configuration management
4. **Auto Migrations**: Database setup happens automatically

## Running Tests

### Backend Tests

Navigate to the Backend folder and run:

```bash
cd Backend
npm install  # Install jest and supertest if not already installed
npm test
```

**Backend tests cover:**
-  Login validation (email format, password length)
-  Auth guard (token verification)
-  Order validation (delivery type, phone, address, datetime)

### Frontend Tests

Navigate to the frontend folder and run:

```bash
cd frontend
npm test
```

**Frontend tests cover:**
-  Login navigation and error handling
-  Route guards (protected routes)
-  Conditional fields (phone/address based on delivery type)
-  Past-time blocking (datetime validation)
-  Summary page consistency (order display)

### Test Coverage

- **Backend**: Login, auth guard, order validation
- **Frontend**: Login navigation, guards, conditional fields, past-time block, summary consistency

##  API Endpoints

### Authentication
- `POST /auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token }`
- `GET /auth/me` - Get current user (requires auth)

### Orders (All require authentication)
- `POST /orders` - Create new order
  - Body: `{ deliveryType, phone?, address?, pickupDatetime?, notes? }`
  - Returns: Order object
- `GET /orders/:id` - Get order by ID
  - Returns: Order object
- `PUT /orders/:id` - Update order
  - Body: `{ deliveryType, phone?, address?, pickupDatetime?, notes? }`
  - Returns: Updated order object


## Available Scripts

### Backend Scripts
- `npm run dev` - Start development server
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration
- `npm run seed` - Run database seeds
- `npm run seed:undo` - Undo seeds
- `npm run setup` - Run migrations and seeds
- `npm test` - Run tests

### Frontend Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Key Features Explained

### Delivery Types
- **IN_STORE**: Customer picks up at the store (no phone/address needed)
- **DELIVERY**: Home delivery (requires phone and address)
- **CURBSIDE**: Curbside pickup (requires phone only)

### Order Flow
1. User logs in
2. User fills out delivery form
3. System validates the order
4. Order is created and saved
5. User sees order summary
6. User can edit the order if needed


