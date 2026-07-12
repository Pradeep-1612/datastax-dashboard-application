# DataStax Dashboard Application

A full-stack TypeScript application for managing DataStax data, consisting of a React-based frontend (SPA) and an Express-based Backend-for-Frontend (BFF) service.

## Project Structure

```
datastax-dashboard-application/
├── datastax-dashboard-spa/     # React frontend application
└── datastax-dashboard-bff/     # Express BFF service
```

## Tech Stack

### Frontend (SPA)
- **React 19** with TypeScript
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Carbon Design System** - UI components
- **Axios** - HTTP client

### Backend (BFF)
- **Express 5** - Web framework
- **TypeScript** - Type safety
- **Axios** - HTTP client for external API calls

## Prerequisites

- **Node.js**: v18 or higher recommended
- **npm**: v9 or higher

## Installation

### 1. Install Frontend Dependencies

```bash
cd datastax-dashboard-spa
npm install
```

### 2. Install Backend Dependencies

```bash
cd datastax-dashboard-bff
npm install
```

## Running the Application

### Start the Backend (BFF)

```bash
cd datastax-dashboard-bff
npm run dev
```

The BFF server will start on `http://localhost:3000` (default port).

### Start the Frontend

```bash
cd datastax-dashboard-spa
npm run dev
```

The frontend will start on `http://localhost:5173` (Vite default port).

## Available Scripts

### Frontend (datastax-dashboard-spa)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (datastax-dashboard-bff)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build

## Environment Configuration

The BFF server uses the following environment variable:
- `PORT` - Server port (default: 3000)

## Health Check

The BFF provides a health check endpoint:
```
GET http://localhost:3000/health
```

## Development Notes

- The frontend uses Carbon Design System for consistent UI components
- State management is handled through Redux Toolkit
- The BFF acts as an intermediary between the frontend and DataStax services
- Both applications are written in TypeScript for type safety