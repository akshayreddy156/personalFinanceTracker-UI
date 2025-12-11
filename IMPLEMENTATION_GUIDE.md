# Personal Finance Tracker Frontend - Complete Implementation Guide

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Dependencies Installation](#dependencies-installation)
4. [Project Structure](#project-structure)
5. [Phase 1: Foundation](#phase-1-foundation)
6. [Phase 2: Routing & Layout](#phase-2-routing--layout)
7. [Phase 3: Authentication](#phase-3-authentication)
8. [Phase 4: Dashboard & Transactions](#phase-4-dashboard--transactions)
9. [Phase 5: Categories](#phase-5-categories)
10. [Phase 6: Reports & Visualization](#phase-6-reports--visualization)
11. [Key Concepts Explained](#key-concepts-explained)
12. [Testing Guide](#testing-guide)
13. [Troubleshooting](#troubleshooting)
14. [Future Enhancements](#future-enhancements)

---

## Project Overview

### What You're Building
A complete personal finance tracker with:
- User authentication (login/register/logout)
- Transaction management (income/expenses)
- Category management
- Dashboard with financial summary
- Reports with charts and visualizations

### Backend API Information
- **Base URL**: `http://localhost:2002`
- **Authentication**: Session-based (Spring Security)
- **Endpoints**:
  - `/api/auth/register` - User registration
  - `/api/auth/login` - User login
  - `/api/auth/logout` - User logout
  - `/api/auth/me` - Get current user
  - `/api/categories/` - Category CRUD
  - `/api/transactions/` - Transaction CRUD
  - `/api/reports/monthly` - Monthly reports
  - `/api/reports/yearly` - Yearly reports

### Tech Stack
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Material-UI (MUI)** - UI components
- **Axios** - HTTP client
- **MUI X Charts** - Data visualization
- **Context API** - State management

---

## Prerequisites

Before starting, ensure you have:
- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:2002`
- Basic understanding of React hooks (useState, useEffect)
- Code editor (VS Code recommended)

---

## Dependencies Installation

### Step 0: Install All Required Packages

Open your terminal in the project directory and run:

```bash
# UI Framework (Material-UI)
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

# Data Visualization
npm install @mui/x-charts

# Routing & HTTP Client
npm install react-router-dom axios

# TypeScript Types
npm install --save-dev @types/node
```

### Verify Installation
After installation, your `package.json` should include:
- `@mui/material`
- `@mui/icons-material`
- `@emotion/react`
- `@emotion/styled`
- `@mui/x-charts`
- `react-router-dom`
- `axios`

---

## Project Structure

```
src/
├── types/                              # TypeScript type definitions
│   ├── api.types.ts                    # API response wrappers & error types
│   ├── auth.types.ts                   # User, LoginRequest, RegisterRequest
│   ├── category.types.ts               # Category types
│   ├── transaction.types.ts            # Transaction types
│   └── report.types.ts                 # Report types
│
├── contexts/                           # React Context (Global State)
│   └── AuthContext.tsx                 # Authentication state & functions
│
├── services/                           # API Communication Layer
│   ├── api.ts                          # Axios instance configuration
│   ├── auth.service.ts                 # Authentication API calls
│   ├── category.service.ts             # Category API calls
│   ├── transaction.service.ts          # Transaction API calls
│   └── report.service.ts               # Report API calls
│
├── components/                         # Reusable UI Components
│   ├── layout/
│   │   ├── Navbar.tsx                  # Navigation bar
│   │   ├── Layout.tsx                  # Page wrapper
│   │   └── ProtectedRoute.tsx          # Auth guard for routes
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx               # Login form
│   │   └── RegisterForm.tsx            # Registration form
│   │
│   ├── transactions/
│   │   ├── TransactionForm.tsx         # Add/Edit transaction
│   │   └── TransactionList.tsx         # Transaction table
│   │
│   ├── categories/
│   │   ├── CategoryForm.tsx            # Add/Edit category
│   │   └── CategoryList.tsx            # Category list
│   │
│   └── reports/
│       ├── SummaryCards.tsx            # Summary statistics
│       ├── MonthlyChart.tsx            # Monthly bar chart
│       └── YearlyChart.tsx             # Yearly line chart
│
├── pages/                              # Page Components (Routes)
│   ├── HomePage.tsx                    # Landing page
│   ├── LoginPage.tsx                   # Login page
│   ├── RegisterPage.tsx                # Registration page
│   ├── DashboardPage.tsx               # Main dashboard
│   ├── TransactionsPage.tsx            # Transaction management
│   ├── CategoriesPage.tsx              # Category management
│   └── ReportsPage.tsx                 # Reports & charts
│
├── App.tsx                             # Root component with routing
├── main.tsx                            # Application entry point
└── index.css                           # Global styles
```

**Total Files to Create: 34 files**

---

## Phase 1: Foundation

### Goal
Set up TypeScript types and API communication layer.

### Learning Objectives
- Understand TypeScript interfaces
- Learn Axios configuration
- Master API interceptors for error handling
- Handle API response types properly

---

### Step 1.0: Create API Response Types (NEW!)

**File**: `src/types/api.types.ts`

```typescript
// Generic API Response wrapper (if backend wraps responses)
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

// Error response from backend
export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path?: string;
  errors?: Record<string, string>; // Field-level validation errors
}

// Paginated response (for future use if backend adds pagination)
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// Common response statuses
export type ApiStatus = 'success' | 'error' | 'loading';
```

**What This Does:**
- Defines shapes for API responses from backend
- Handles error responses consistently
- Prepares for pagination (future feature)
- Type-safe response handling

**Why API Response Types?**
Your backend might return responses in different formats:
1. **Direct data**: `{ id: 1, name: "Food" }`
2. **Wrapped data**: `{ data: { id: 1, name: "Food" }, message: "Success" }`
3. **Error format**: `{ message: "Not found", status: 404, timestamp: "..." }`

**When to Use:**
- If your Spring Boot backend wraps responses in a standard format
- For consistent error handling across the app
- When backend returns validation errors

**How to Use in Services:**
```typescript
// If backend returns direct data (most Spring Boot apps)
const response = await api.get('/api/categories/');
return response.data; // Already the Category[]

// If backend wraps in ApiResponse format
const response = await api.get<ApiResponse<Category[]>>('/api/categories/');
return response.data.data; // Unwrap the data property
```

**Important Note:**
Based on typical Spring Boot REST APIs, your backend likely returns data directly (not wrapped). So you might not need `ApiResponse<T>` wrapper for success cases. However, `ApiError` is very useful for handling error responses consistently!

**Example Error Handling:**
```typescript
try {
  await categoryService.create(data);
} catch (error: any) {
  const apiError = error.response?.data as ApiError;
  setError(apiError?.message || 'Something went wrong');
}
```

---

### Step 1.1: Create Authentication Types

**File**: `src/types/auth.types.ts`

```typescript
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
```

**What This Does:**
- Defines the shape of user data
- Defines login credentials structure
- Defines registration data structure

**Why TypeScript Types?**
- Catches errors at compile time
- Provides autocomplete in your editor
- Makes code self-documenting

---

### Step 1.2: Create Category Types

**File**: `src/types/category.types.ts`

```typescript
export interface Category {
  id: number;
  name: string;
  type: 'INCOME' | 'EXPENSE';
}
```

**Key Concept - Union Types:**
- `type: 'INCOME' | 'EXPENSE'` means type can ONLY be one of these two strings
- TypeScript prevents you from using invalid values

---

### Step 1.3: Create Transaction Types

**File**: `src/types/transaction.types.ts`

```typescript
import { Category } from './category.types';

export interface Transaction {
  id: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: Category;
  date: string;
  description: string;
}

export interface TransactionFormData {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  categoryId: number;
  date: string;
  description: string;
}
```

**Why Two Interfaces?**
- `Transaction`: Data from backend (includes full Category object)
- `TransactionFormData`: Data to send to backend (includes only categoryId)

---

### Step 1.4: Create Report Types

**File**: `src/types/report.types.ts`

```typescript
export interface MonthlyReport {
  month: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export interface YearlyReport {
  year: number;
  months: MonthlyReport[];
}
```

---

### Step 1.5: Set Up Axios Instance

**File**: `src/services/api.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:2002',
  withCredentials: true, // CRITICAL: Sends session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: Handle 401/403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Session expired or unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Key Concepts Explained:**

1. **`baseURL`**: All requests will be prefixed with this URL
   - Example: `api.get('/api/auth/me')` → `http://localhost:2002/api/auth/me`

2. **`withCredentials: true`**: CRITICAL for session-based auth
   - Tells browser to send cookies with every request
   - Without this, Spring Security won't recognize your session

3. **Interceptors**: Middleware for requests/responses
   - Response interceptor catches errors before they reach your code
   - If 401/403 → automatically redirects to login
   - Prevents repetitive error handling in every component

---

### Step 1.6: Create Authentication Service

**File**: `src/services/auth.service.ts`

```typescript
import api from './api';
import { User, LoginRequest, RegisterRequest } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<User> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};
```

**Why Service Files?**
- Centralize all API calls in one place
- If backend endpoint changes, you only update here
- Components don't need to know about API implementation details

**Pattern Used:**
```typescript
const response = await api.post(endpoint, data);
return response.data;
```
- `response.data` is where axios puts the actual response body
- We return just the data, not the full axios response object

---

### Step 1.7: Create Category Service

**File**: `src/services/category.service.ts`

```typescript
import api from './api';
import { Category } from '../types/category.types';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/api/categories/');
    return response.data;
  },

  create: async (data: Omit<Category, 'id'>): Promise<Category> => {
    const response = await api.post('/api/categories/', data);
    return response.data;
  },

  update: async (id: number, data: Omit<Category, 'id'>): Promise<Category> => {
    const response = await api.put(`/api/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/categories/${id}`);
  },
};
```

**Key Concept - `Omit<Category, 'id'>`:**
- Takes the `Category` type and removes the `id` property
- Used because when creating, we don't have an ID yet (backend generates it)
- TypeScript ensures we don't accidentally send an ID when creating

---

### Step 1.8: Create Transaction Service

**File**: `src/services/transaction.service.ts`

```typescript
import api from './api';
import { Transaction, TransactionFormData } from '../types/transaction.types';

export const transactionService = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get('/api/transactions/');
    return response.data;
  },

  create: async (data: TransactionFormData): Promise<Transaction> => {
    const response = await api.post('/api/transactions/', data);
    return response.data;
  },

  update: async (id: number, data: TransactionFormData): Promise<Transaction> => {
    const response = await api.put(`/api/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/transactions/${id}`);
  },
};
```

**CRUD Pattern:**
- **C**reate: `POST` with data
- **R**ead: `GET` (returns array or single item)
- **U**pdate: `PUT` with id and data
- **D**elete: `DELETE` with id

---

### Step 1.9: Create Report Service

**File**: `src/services/report.service.ts`

```typescript
import api from './api';
import { MonthlyReport, YearlyReport } from '../types/report.types';

export const reportService = {
  getMonthly: async (): Promise<MonthlyReport[]> => {
    const response = await api.get('/api/reports/monthly');
    return response.data;
  },

  getYearly: async (): Promise<YearlyReport> => {
    const response = await api.get('/api/reports/yearly');
    return response.data;
  },
};
```

---

### Step 1.10: Create Authentication Context

**File**: `src/contexts/AuthContext.tsx`

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { User, LoginRequest, RegisterRequest } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (on page load)
  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    const user = await authService.login(credentials);
    setUser(user);
  };

  const register = async (data: RegisterRequest) => {
    const user = await authService.register(data);
    setUser(user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // Run once when component mounts
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Key Concepts - Context API:**

1. **`createContext`**: Creates a container for shared state
2. **`AuthProvider`**: Component that wraps your app to provide the state
3. **`useAuth`**: Custom hook to easily access auth state anywhere

**How It Works:**
```
App wrapped in <AuthProvider>
  ├── Any component can call useAuth()
  ├── Gets: user, loading, login, register, logout
  └── All components see the same user state
```

**Why Context API?**
- Avoids "prop drilling" (passing props through many levels)
- Global state accessible anywhere
- Built into React (no extra library needed)

**Authentication Flow:**
1. App loads → `useEffect` runs → calls `checkAuth()`
2. `checkAuth()` calls `/api/auth/me` to see if session exists
3. If yes: sets user data
4. If no: user stays null
5. Components can now check `if (user)` to see if logged in

---

### ✅ Phase 1 Checkpoint

At this point, you should have:
- ✅ 4 type files created
- ✅ 5 service files created
- ✅ 1 context file created
- ✅ Understanding of TypeScript interfaces
- ✅ Understanding of Axios and API calls
- ✅ Understanding of Context API

**Test your understanding:**
- Can you explain what `withCredentials: true` does?
- Can you describe the authentication flow?
- What's the difference between `Transaction` and `TransactionFormData`?

---

## Phase 2: Routing & Layout

### Goal
Set up navigation structure and route protection.

### Learning Objectives
- Understand React Router
- Learn nested routes
- Master protected routes (authorization)
- Build reusable layout components

---

### Step 2.1: Update App.tsx with Routing

**File**: `src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import CategoriesPage from './pages/CategoriesPage';
import ReportsPage from './pages/ReportsPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Route>

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
```

**Key Concepts Explained:**

1. **`BrowserRouter`**: Enables client-side routing
   - Manages browser history
   - Updates URL without page reload

2. **`Routes` and `Route`**: Define URL-to-component mappings
   ```typescript
   <Route path="/login" element={<LoginPage />} />
   ```
   - When URL is `/login`, render `<LoginPage />`

3. **Nested Routes**:
   ```typescript
   <Route element={<Layout />}>
     <Route path="/" element={<HomePage />} />
   </Route>
   ```
   - `Layout` wraps all child routes
   - Child routes render inside `<Outlet />` in Layout

4. **Protected Routes**:
   ```typescript
   <Route element={<ProtectedRoute />}>
     <Route path="/dashboard" element={<DashboardPage />} />
   </Route>
   ```
   - `ProtectedRoute` checks authentication
   - If not logged in → redirect to login
   - If logged in → render child routes

5. **Catch-all Route**:
   ```typescript
   <Route path="*" element={<Navigate to="/" replace />} />
   ```
   - Matches any undefined path
   - Redirects to home page

6. **Theme Provider**:
   - Wraps app to provide MUI theme colors
   - `CssBaseline` normalizes styles across browsers

**Route Structure:**
```
/ ────────────────────────> HomePage (public)
/login ───────────────────> LoginPage (public)
/register ────────────────> RegisterPage (public)
/dashboard ───────────────> DashboardPage (protected)
/transactions ────────────> TransactionsPage (protected)
/categories ──────────────> CategoriesPage (protected)
/reports ─────────────────> ReportsPage (protected)
```

---

### Step 2.2: Create Navbar Component

**File**: `src/components/layout/Navbar.tsx`

```typescript
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Personal Finance Tracker
        </Typography>

        {user ? (
          // Logged in - show dashboard links
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/transactions">
              Transactions
            </Button>
            <Button color="inherit" component={Link} to="/categories">
              Categories
            </Button>
            <Button color="inherit" component={Link} to="/reports">
              Reports
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          // Not logged in - show login/register
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
```

**Key Concepts:**

1. **Conditional Rendering**:
   ```typescript
   {user ? <LoggedInButtons /> : <PublicButtons />}
   ```
   - If `user` exists (truthy) → show first option
   - If `user` is null (falsy) → show second option

2. **`useNavigate`**: Programmatic navigation
   ```typescript
   const navigate = useNavigate();
   navigate('/login'); // Changes URL to /login
   ```

3. **`component={Link}`**: Makes MUI Button work as React Router Link
   ```typescript
   <Button component={Link} to="/dashboard">Dashboard</Button>
   ```
   - Looks like a button, acts like a link
   - No page reload when clicked

4. **`sx` prop**: MUI's styling system
   ```typescript
   sx={{ display: 'flex', gap: 2 }}
   ```
   - Similar to inline CSS but with theme support
   - `gap: 2` → 16px spacing (theme spacing scale)

---

### Step 2.3: Create Layout Component

**File**: `src/components/layout/Layout.tsx`

```typescript
import { Outlet } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Navbar from './Navbar';

function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Outlet /> {/* Child routes render here */}
      </Container>
    </Box>
  );
}

export default Layout;
```

**Key Concepts:**

1. **`<Outlet />`**: Where child routes render
   ```typescript
   // When URL is /dashboard
   <Layout>         // Shows Navbar + Container
     <Outlet />     // Renders <DashboardPage />
   </Layout>
   ```

2. **Layout Pattern**:
   ```
   ┌─────────────────────────────┐
   │         Navbar              │  ← Always visible
   ├─────────────────────────────┤
   │                             │
   │      <Outlet />             │  ← Changes per route
   │      (Page content)         │
   │                             │
   └─────────────────────────────┘
   ```

3. **Flexbox Layout**:
   ```typescript
   minHeight: '100vh'  // Full viewport height
   flex: 1             // Content fills available space
   ```

---

### Step 2.4: Create ProtectedRoute Component

**File**: `src/components/layout/ProtectedRoute.tsx`

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Still checking if user is logged in
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Not logged in - redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in - show the protected content
  return <Outlet />;
}

export default ProtectedRoute;
```

**Key Concepts - Authorization:**

**This is how you protect routes!**

**Flow:**
```
User visits /dashboard
         ↓
ProtectedRoute checks:
         ↓
Still loading? → Show spinner
         ↓
Not logged in? → Redirect to /login
         ↓
Logged in? → Render <DashboardPage />
```

**Three States:**
1. **Loading**: Checking if user is authenticated
   - Shows spinner while waiting
   - Prevents flash of wrong content

2. **Not Authenticated**: No user logged in
   - `<Navigate to="/login" replace />`
   - `replace` → replaces history entry (back button goes to previous page)

3. **Authenticated**: User logged in
   - `<Outlet />` → renders child routes

**Why This Works:**
- `useAuth()` hook gives us current user state
- If someone tries to access `/dashboard` without logging in:
  - `user` is `null`
  - Component returns `<Navigate to="/login" />`
  - User sees login page instead

---

### ✅ Phase 2 Checkpoint

At this point, you should have:
- ✅ Routing configured in App.tsx
- ✅ Navbar with conditional navigation
- ✅ Layout wrapper for consistent structure
- ✅ ProtectedRoute for authorization
- ✅ Understanding of React Router
- ✅ Understanding of protected routes

**Test your understanding:**
- What does `<Outlet />` do?
- How does ProtectedRoute prevent unauthorized access?
- What's the difference between `Link` and `useNavigate`?

---

## Phase 3: Authentication

### Goal
Build login and registration functionality.

### Learning Objectives
- Handle form state with controlled components
- Submit forms with async operations
- Display errors and loading states
- Navigate after successful actions

---

### Step 3.1: Create Login Form Component

**File**: `src/components/auth/LoginForm.tsx`

```typescript
import { useState, FormEvent } from 'react';
import { TextField, Button, Alert, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setError('');
    setLoading(true);

    try {
      await login({ username, password });
      navigate('/dashboard'); // Redirect after successful login
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        margin="normal"
        required
        fullWidth
        label="Username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </Box>
  );
}

export default LoginForm;
```

**Key Concepts - Controlled Components:**

1. **Form State**:
   ```typescript
   const [username, setUsername] = useState('');
   ```
   - React state holds the current input value

2. **Value from State**:
   ```typescript
   <TextField value={username} />
   ```
   - Input displays what's in state
   - React controls the input (not the DOM)

3. **onChange Updates State**:
   ```typescript
   onChange={(e) => setUsername(e.target.value)}
   ```
   - User types → onChange fires
   - Updates state with new value
   - Component re-renders with new value

**Data Flow:**
```
User types "John"
      ↓
onChange fires with "John"
      ↓
setUsername("John")
      ↓
State updates: username = "John"
      ↓
Component re-renders
      ↓
Input shows "John"
```

**Form Submission:**

1. **Prevent Default**:
   ```typescript
   e.preventDefault();
   ```
   - Stops browser from reloading page
   - Without this, form would submit traditionally

2. **Try-Catch-Finally**:
   ```typescript
   try {
     await login({ username, password });
     navigate('/dashboard');
   } catch (err) {
     setError(err.message);
   } finally {
     setLoading(false);
   }
   ```
   - `try`: Attempt login
   - `catch`: If error, show message
   - `finally`: Always runs (stop loading)

3. **Loading State**:
   ```typescript
   disabled={loading}
   {loading ? 'Logging in...' : 'Login'}
   ```
   - Disables button while loading
   - Shows different text during loading
   - Prevents double submission

---

### Step 3.2: Create Register Form Component

**File**: `src/components/auth/RegisterForm.tsx`

```typescript
import { useState, FormEvent } from 'react';
import { TextField, Button, Alert, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ username, email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        margin="normal"
        required
        fullWidth
        label="Username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Register'}
      </Button>
    </Box>
  );
}

export default RegisterForm;
```

**Same Pattern as LoginForm:**
- Three controlled inputs (username, email, password)
- Form submission with error handling
- Loading state during async operation
- Navigate on success

---

### Step 3.3: Create Home Page

**File**: `src/pages/HomePage.tsx`

```typescript
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  const { user } = useAuth();

  // If already logged in, go to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Personal Finance Tracker
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Take control of your finances. Track income, expenses, and visualize your spending patterns.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" size="large" component={Link} to="/login">
            Login
          </Button>
          <Button variant="outlined" size="large" component={Link} to="/register">
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default HomePage;
```

**Key Feature:**
```typescript
if (user) {
  return <Navigate to="/dashboard" replace />;
}
```
- If user already logged in, redirect to dashboard
- No need to see home page if authenticated

---

### Step 3.4: Create Login Page

**File**: `src/pages/LoginPage.tsx`

```typescript
import { Container, Paper, Typography, Box, Link as MuiLink } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';

function LoginPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>
        <LoginForm />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <MuiLink component={Link} to="/register">
              Register here
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
```

**Pattern - Page vs Component:**
- **LoginForm**: Reusable form logic
- **LoginPage**: Page layout + navigation links
- Separation allows reusing form in different contexts

---

### Step 3.5: Create Register Page

**File**: `src/pages/RegisterPage.tsx`

```typescript
import { Container, Paper, Typography, Box, Link as MuiLink } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';

function RegisterPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>
        <RegisterForm />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <MuiLink component={Link} to="/login">
              Login here
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;
```

---

### ✅ Phase 3 Checkpoint

At this point, you should have:
- ✅ Login form with validation
- ✅ Register form with validation
- ✅ Home, Login, and Register pages
- ✅ Working authentication flow
- ✅ Understanding of controlled components
- ✅ Understanding of async form submission

**Test your understanding:**
- What is a controlled component?
- Why do we use `e.preventDefault()`?
- How does the loading state improve UX?

**Test the app:**
1. Run `npm run dev`
2. Navigate to `http://localhost:5173`
3. Try registering a new user
4. Try logging in
5. Notice how you're redirected to dashboard after login

---

## Phase 4: Dashboard & Transactions

### Goal
Build the main dashboard and transaction management features.

### Learning Objectives
- Fetch data with useEffect
- Display loading and error states
- Perform CRUD operations
- Work with modals/dialogs
- Handle parent-child component communication

---

### Step 4.1: Create Dashboard Page

**File**: `src/pages/DashboardPage.tsx`

```typescript
import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { transactionService } from '../services/transaction.service';
import { Transaction } from '../types/transaction.types';

function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate current month totals
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalIncome = thisMonthTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = thisMonthTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light' }}>
            <Typography variant="h6">Total Income</Typography>
            <Typography variant="h4">${totalIncome.toFixed(2)}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light' }}>
            <Typography variant="h6">Total Expenses</Typography>
            <Typography variant="h4">${totalExpense.toFixed(2)}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'info.light' }}>
            <Typography variant="h6">Net Balance</Typography>
            <Typography variant="h4">${netBalance.toFixed(2)}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" component={Link} to="/transactions">
          Manage Transactions
        </Button>
        <Button variant="outlined" component={Link} to="/reports">
          View Reports
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
        {thisMonthTransactions.slice(0, 5).map(transaction => (
          <Box key={transaction.id} sx={{ py: 1, borderBottom: '1px solid #eee' }}>
            <Typography>
              {transaction.description} - ${transaction.amount} ({transaction.type})
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}

export default DashboardPage;
```

**Key Concepts - Data Fetching:**

1. **useEffect for Loading Data**:
   ```typescript
   useEffect(() => {
     fetchTransactions();
   }, []); // Empty array = run once on mount
   ```
   - Runs after component renders
   - Empty dependency array `[]` = only run once
   - Perfect for loading initial data

2. **Async Function Inside useEffect**:
   ```typescript
   const fetchTransactions = async () => {
     try {
       const data = await transactionService.getAll();
       setTransactions(data);
     } catch (error) {
       console.error(error);
     } finally {
       setLoading(false);
     }
   };
   ```
   - Can't make useEffect itself async
   - Create async function inside and call it

3. **Array Methods for Calculations**:
   ```typescript
   const totalIncome = thisMonthTransactions
     .filter(t => t.type === 'INCOME')
     .reduce((sum, t) => sum + t.amount, 0);
   ```
   - `filter()`: Keep only income transactions
   - `reduce()`: Sum up all amounts

4. **Conditional Rendering Based on Loading**:
   ```typescript
   if (loading) {
     return <CircularProgress />;
   }
   return <ActualContent />;
   ```
   - Show spinner while loading
   - Show content when done

5. **MUI Grid System**:
   ```typescript
   <Grid container spacing={3}>
     <Grid item xs={12} md={4}>
       {/* Content */}
     </Grid>
   </Grid>
   ```
   - `container`: Wraps grid items
   - `item`: Grid cell
   - `xs={12}`: Full width on mobile
   - `md={4}`: 1/3 width on desktop (12 / 4 = 3 columns)

---

### Step 4.2: Create Transaction Form Component

**File**: `src/components/transactions/TransactionForm.tsx`

```typescript
import { useState, useEffect, FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Alert
} from '@mui/material';
import { transactionService } from '../../services/transaction.service';
import { categoryService } from '../../services/category.service';
import { Category } from '../../types/category.types';
import { Transaction, TransactionFormData } from '../../types/transaction.types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: Transaction;
}

function TransactionForm({ open, onClose, onSuccess, transaction }: Props) {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'EXPENSE',
    amount: 0,
    categoryId: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        categoryId: transaction.category.id,
        date: transaction.date,
        description: transaction.description,
      });
    }
  }, [transaction]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (transaction) {
        await transactionService.update(transaction.id, formData);
      } else {
        await transactionService.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{transaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            select
            fullWidth
            label="Type"
            margin="normal"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'INCOME' | 'EXPENSE' })}
          >
            <MenuItem value="INCOME">Income</MenuItem>
            <MenuItem value="EXPENSE">Expense</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Amount"
            type="number"
            margin="normal"
            required
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          />

          <TextField
            select
            fullWidth
            label="Category"
            margin="normal"
            required
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
          >
            {categories
              .filter(cat => cat.type === formData.type)
              .map(cat => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            fullWidth
            label="Date"
            type="date"
            margin="normal"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TransactionForm;
```

**Key Concepts - Form Object State:**

1. **Object State**:
   ```typescript
   const [formData, setFormData] = useState<TransactionFormData>({
     type: 'EXPENSE',
     amount: 0,
     categoryId: 0,
     date: new Date().toISOString().split('T')[0],
     description: '',
   });
   ```
   - Single state object for entire form
   - Easier to submit (already in correct format)

2. **Updating Object State**:
   ```typescript
   onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
   ```
   - `...formData`: Spread operator - copies all properties
   - `amount: newValue`: Overrides just the amount
   - Creates new object (React detects change)

3. **MUI Dialog**:
   ```typescript
   <Dialog open={open} onClose={onClose}>
     <DialogTitle>Title</DialogTitle>
     <DialogContent>Form fields</DialogContent>
     <DialogActions>Buttons</DialogActions>
   </Dialog>
   ```
   - Modal overlay for forms
   - `open` prop controls visibility
   - `onClose` called when clicking outside or ESC

4. **Props Interface**:
   ```typescript
   interface Props {
     open: boolean;
     onClose: () => void;
     onSuccess: () => void;
     transaction?: Transaction;
   }
   ```
   - Defines component's API
   - `transaction?`: Optional (undefined for create, provided for edit)

5. **Create vs Update**:
   ```typescript
   if (transaction) {
     await transactionService.update(transaction.id, formData);
   } else {
     await transactionService.create(formData);
   }
   ```
   - Same form for both operations
   - If transaction exists → update
   - If not → create new

6. **Category Filtering**:
   ```typescript
   categories.filter(cat => cat.type === formData.type)
   ```
   - Show only income categories when type is INCOME
   - Show only expense categories when type is EXPENSE

---

### Step 4.3: Create Transaction List Component

**File**: `src/components/transactions/TransactionList.tsx`

```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Transaction } from '../../types/transaction.types';
import { transactionService } from '../../services/transaction.service';

interface Props {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: () => void;
}

function TransactionList({ transactions, onEdit, onDelete }: Props) {
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.delete(id);
        onDelete();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography color="text.secondary">No transactions found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category.name}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell align="right">
                  ${transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => onEdit(transaction)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(transaction.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransactionList;
```

**Key Concepts - Callback Props:**

1. **Callback Functions as Props**:
   ```typescript
   interface Props {
     transactions: Transaction[];
     onEdit: (transaction: Transaction) => void;
     onDelete: () => void;
   }
   ```
   - Parent passes functions as props
   - Child calls them when something happens
   - Way for child to communicate with parent

2. **Calling Callback with Data**:
   ```typescript
   <IconButton onClick={() => onEdit(transaction)}>
   ```
   - Arrow function needed to pass arguments
   - Without arrow: `onClick={onEdit}` → no arguments
   - With arrow: `onClick={() => onEdit(transaction)}` → pass transaction

3. **User Confirmation**:
   ```typescript
   if (window.confirm('Are you sure?')) {
     // Delete
   }
   ```
   - Browser native confirm dialog
   - Returns true if OK, false if Cancel

4. **MUI Table Structure**:
   ```typescript
   <Table>
     <TableHead>
       <TableRow>
         <TableCell>Header</TableCell>
       </TableRow>
     </TableHead>
     <TableBody>
       <TableRow>
         <TableCell>Data</TableCell>
       </TableRow>
     </TableBody>
   </Table>
   ```

5. **Empty State**:
   ```typescript
   {transactions.length === 0 ? (
     <EmptyMessage />
   ) : (
     <DataRows />
   )}
   ```
   - Show helpful message when no data
   - Better UX than blank screen

---

### Step 4.4: Create Transactions Page

**File**: `src/pages/TransactionsPage.tsx`

```typescript
import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { transactionService } from '../services/transaction.service';
import { Transaction } from '../types/transaction.types';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';

function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | undefined>();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditTransaction(undefined);
    setFormOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditTransaction(undefined);
  };

  const handleSuccess = () => {
    fetchTransactions();
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Transactions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Transaction
        </Button>
      </Box>

      <TransactionList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={fetchTransactions}
      />

      <TransactionForm
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={handleSuccess}
        transaction={editTransaction}
      />
    </Box>
  );
}

export default TransactionsPage;
```

**Key Concepts - Component Coordination:**

**State Management Pattern:**
```typescript
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [formOpen, setFormOpen] = useState(false);
const [editTransaction, setEditTransaction] = useState<Transaction | undefined>();
```
- `transactions`: Data to display
- `formOpen`: Controls dialog visibility
- `editTransaction`: Which transaction to edit (undefined = create new)

**Data Flow:**
```
TransactionsPage (parent - manages state)
    ├── TransactionList (displays data)
    │   └── Calls onEdit(transaction) when edit clicked
    │   └── Calls onDelete() when delete succeeds
    │
    └── TransactionForm (dialog for add/edit)
        └── Calls onSuccess() when save succeeds
        └── Calls onClose() when cancel clicked
```

**Add Flow:**
```
Click "Add Transaction"
      ↓
handleAdd() called
      ↓
setEditTransaction(undefined) - no transaction = create mode
setFormOpen(true) - show dialog
      ↓
User fills form and submits
      ↓
onSuccess() called
      ↓
fetchTransactions() - reload data
```

**Edit Flow:**
```
Click edit icon on transaction
      ↓
onEdit(transaction) called
      ↓
handleEdit(transaction) called
      ↓
setEditTransaction(transaction) - sets which to edit
setFormOpen(true) - show dialog
      ↓
Form pre-fills with transaction data
      ↓
User changes and submits
      ↓
onSuccess() called
      ↓
fetchTransactions() - reload data
```

---

### ✅ Phase 4 Checkpoint

At this point, you should have:
- ✅ Dashboard with financial summary
- ✅ Transaction form (add/edit)
- ✅ Transaction list with delete
- ✅ Working CRUD operations
- ✅ Understanding of useEffect for data fetching
- ✅ Understanding of parent-child communication

**Test your understanding:**
- How does the form know if it's creating or editing?
- Why do we refetch data after create/update/delete?
- What's the purpose of callback props like `onEdit`?

**Test the app:**
1. Create a few categories first (you'll build this next)
2. Add transactions
3. Edit a transaction
4. Delete a transaction
5. See dashboard update with new totals

---

## Phase 5: Categories

### Goal
Build category management (simpler than transactions - good practice!).

### Learning Objectives
- Apply learned patterns to new feature
- Practice CRUD operations
- Work with list displays

---

### Step 5.1: Create Category Form Component

**File**: `src/components/categories/CategoryForm.tsx`

```typescript
import { useState, useEffect, FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Alert
} from '@mui/material';
import { categoryService } from '../../services/category.service';
import { Category } from '../../types/category.types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category;
}

function CategoryForm({ open, onClose, onSuccess, category }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setType(category.type);
    } else {
      setName('');
      setType('EXPENSE');
    }
  }, [category]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (category) {
        await categoryService.update(category.id, { name, type });
      } else {
        await categoryService.create({ name, type });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            fullWidth
            label="Category Name"
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            select
            fullWidth
            label="Type"
            margin="normal"
            value={type}
            onChange={(e) => setType(e.target.value as 'INCOME' | 'EXPENSE')}
          >
            <MenuItem value="INCOME">Income</MenuItem>
            <MenuItem value="EXPENSE">Expense</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CategoryForm;
```

**Simpler than Transaction Form:**
- Only 2 fields (name, type)
- No date handling
- No dependent dropdowns
- Same patterns as before

---

### Step 5.2: Create Category List Component

**File**: `src/components/categories/CategoryList.tsx`

```typescript
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Category } from '../../types/category.types';
import { categoryService } from '../../services/category.service';

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: () => void;
}

function CategoryList({ categories, onEdit, onDelete }: Props) {
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure? This may affect existing transactions.')) {
      try {
        await categoryService.delete(id);
        onDelete();
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert('Cannot delete category. It may be in use by transactions.');
      }
    }
  };

  const incomeCategories = categories.filter(c => c.type === 'INCOME');
  const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

  return (
    <Box>
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, bgcolor: 'success.light' }}>
          <Typography variant="h6">Income Categories</Typography>
        </Box>
        <List>
          {incomeCategories.length === 0 ? (
            <ListItem>
              <ListItemText primary="No income categories yet" />
            </ListItem>
          ) : (
            incomeCategories.map((category) => (
              <ListItem
                key={category.id}
                secondaryAction={
                  <>
                    <IconButton edge="end" onClick={() => onEdit(category)} sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(category.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={category.name}
                  secondary={<Chip label="INCOME" size="small" color="success" />}
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>

      <Paper>
        <Box sx={{ p: 2, bgcolor: 'error.light' }}>
          <Typography variant="h6">Expense Categories</Typography>
        </Box>
        <List>
          {expenseCategories.length === 0 ? (
            <ListItem>
              <ListItemText primary="No expense categories yet" />
            </ListItem>
          ) : (
            expenseCategories.map((category) => (
              <ListItem
                key={category.id}
                secondaryAction={
                  <>
                    <IconButton edge="end" onClick={() => onEdit(category)} sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(category.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={category.name}
                  secondary={<Chip label="EXPENSE" size="small" color="error" />}
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default CategoryList;
```

**Key Features:**

1. **Grouped Display**:
   ```typescript
   const incomeCategories = categories.filter(c => c.type === 'INCOME');
   const expenseCategories = categories.filter(c => c.type === 'EXPENSE');
   ```
   - Separates categories by type
   - Easier to find what you need

2. **MUI List**:
   ```typescript
   <List>
     <ListItem>
       <ListItemText primary="Name" secondary="Details" />
     </ListItem>
   </List>
   ```
   - Alternative to Table for simpler displays

3. **Delete Warning**:
   ```typescript
   alert('Cannot delete category. It may be in use by transactions.');
   ```
   - Backend might reject delete if category in use
   - Show helpful message to user

---

### Step 5.3: Create Categories Page

**File**: `src/pages/CategoriesPage.tsx`

```typescript
import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { categoryService } from '../services/category.service';
import { Category } from '../types/category.types';
import CategoryForm from '../components/categories/CategoryForm';
import CategoryList from '../components/categories/CategoryList';

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | undefined>();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditCategory(undefined);
    setFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditCategory(undefined);
  };

  const handleSuccess = () => {
    fetchCategories();
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Category
        </Button>
      </Box>

      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={fetchCategories}
      />

      <CategoryForm
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={handleSuccess}
        category={editCategory}
      />
    </Box>
  );
}

export default CategoriesPage;
```

**Same Pattern as TransactionsPage:**
- Load data on mount
- Add/Edit with dialog
- Refresh after changes
- Consistent UX across features

---

### ✅ Phase 5 Checkpoint

At this point, you should have:
- ✅ Category management (CRUD)
- ✅ Grouped category display
- ✅ Categories working with transactions
- ✅ Confidence with React patterns

**Test your understanding:**
- Can you create a category component from scratch now?
- Do you see the repeated patterns across features?
- Can you explain the data flow from user action to display?

**Test the app:**
1. Create income categories (Salary, Freelance, etc.)
2. Create expense categories (Food, Rent, Entertainment, etc.)
3. Edit a category
4. Try to delete one (see what happens if it's used in transactions)
5. Use categories when creating transactions

---

## Phase 6: Reports & Visualization

### Goal
Build reports page with charts and visualizations.

### Learning Objectives
- Work with MUI X Charts
- Transform data for visualization
- Create summary statistics
- Combine multiple charts

---

### Step 6.1: Create Summary Cards Component

**File**: `src/components/reports/SummaryCards.tsx`

```typescript
import { Grid, Paper, Typography } from '@mui/material';
import { MonthlyReport } from '../../types/report.types';

interface Props {
  data: MonthlyReport[];
}

function SummaryCards({ data }: Props) {
  const totalIncome = data.reduce((sum, m) => sum + m.totalIncome, 0);
  const totalExpense = data.reduce((sum, m) => sum + m.totalExpense, 0);
  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light' }}>
          <Typography variant="h6">Total Income</Typography>
          <Typography variant="h4">${totalIncome.toFixed(2)}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light' }}>
          <Typography variant="h6">Total Expenses</Typography>
          <Typography variant="h4">${totalExpense.toFixed(2)}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'info.light' }}>
          <Typography variant="h6">Net Balance</Typography>
          <Typography variant="h4">${netBalance.toFixed(2)}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light' }}>
          <Typography variant="h6">Savings Rate</Typography>
          <Typography variant="h4">{savingsRate}%</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default SummaryCards;
```

**Key Concepts - Array Reduce:**

```typescript
const totalIncome = data.reduce((sum, m) => sum + m.totalIncome, 0);
```

**How reduce works:**
1. Start with initial value: `0`
2. For each item: `sum = sum + m.totalIncome`
3. Return final sum

**Example:**
```
data = [
  { month: 'Jan', totalIncome: 100 },
  { month: 'Feb', totalIncome: 200 },
  { month: 'Mar', totalIncome: 150 }
]

Iteration 1: sum = 0 + 100 = 100
Iteration 2: sum = 100 + 200 = 300
Iteration 3: sum = 300 + 150 = 450

Result: 450
```

**Savings Rate Calculation:**
```typescript
const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;
```
- (Net / Income) * 100 = Percentage saved
- `.toFixed(1)` = Round to 1 decimal place
- Check `totalIncome > 0` to avoid division by zero

---

### Step 6.2: Create Monthly Chart Component

**File**: `src/components/reports/MonthlyChart.tsx`

```typescript
import { BarChart } from '@mui/x-charts/BarChart';
import { Paper, Typography, Box } from '@mui/material';
import { MonthlyReport } from '../../types/report.types';

interface Props {
  data: MonthlyReport[];
}

function MonthlyChart({ data }: Props) {
  const months = data.map(d => d.month);
  const incomeData = data.map(d => d.totalIncome);
  const expenseData = data.map(d => d.totalExpense);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Monthly Income vs Expenses
      </Typography>
      <Box sx={{ width: '100%', height: 400 }}>
        <BarChart
          xAxis={[{ scaleType: 'band', data: months }]}
          series={[
            { data: incomeData, label: 'Income', color: '#4caf50' },
            { data: expenseData, label: 'Expenses', color: '#f44336' },
          ]}
          height={350}
        />
      </Box>
    </Paper>
  );
}

export default MonthlyChart;
```

**Key Concepts - MUI X Charts:**

1. **Data Transformation**:
   ```typescript
   const months = data.map(d => d.month);      // ['Jan', 'Feb', 'Mar']
   const incomeData = data.map(d => d.totalIncome);  // [100, 200, 150]
   ```
   - Charts need separate arrays for labels and values
   - Use `.map()` to extract what you need

2. **BarChart Configuration**:
   ```typescript
   <BarChart
     xAxis={[{ scaleType: 'band', data: months }]}
     series={[
       { data: incomeData, label: 'Income', color: '#4caf50' },
       { data: expenseData, label: 'Expenses', color: '#f44336' },
     ]}
     height={350}
   />
   ```
   - `xAxis`: Labels on horizontal axis (months)
   - `series`: Data sets to display (income, expense)
   - Each series has data, label, and color

3. **Colors**:
   - `#4caf50`: Green for income
   - `#f44336`: Red for expenses
   - Hex color codes

---

### Step 6.3: Create Yearly Chart Component

**File**: `src/components/reports/YearlyChart.tsx`

```typescript
import { LineChart } from '@mui/x-charts/LineChart';
import { Paper, Typography, Box } from '@mui/material';
import { YearlyReport } from '../../types/report.types';

interface Props {
  data: YearlyReport;
}

function YearlyChart({ data }: Props) {
  const months = data.months.map(m => m.month);
  const incomeData = data.months.map(m => m.totalIncome);
  const expenseData = data.months.map(m => m.totalExpense);
  const netData = data.months.map(m => m.netBalance);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Yearly Trends ({data.year})
      </Typography>
      <Box sx={{ width: '100%', height: 400 }}>
        <LineChart
          xAxis={[{ scaleType: 'band', data: months }]}
          series={[
            { data: incomeData, label: 'Income', color: '#4caf50' },
            { data: expenseData, label: 'Expenses', color: '#f44336' },
            { data: netData, label: 'Net Balance', color: '#2196f3' },
          ]}
          height={350}
        />
      </Box>
    </Paper>
  );
}

export default YearlyChart;
```

**LineChart vs BarChart:**
- **BarChart**: Good for comparing values (income vs expense each month)
- **LineChart**: Good for showing trends over time
- Same data, different visualization

**Three Series:**
- Income (green)
- Expense (red)
- Net Balance (blue) - shows if you're saving or losing money

---

### Step 6.4: Create Reports Page

**File**: `src/pages/ReportsPage.tsx`

```typescript
import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { reportService } from '../services/report.service';
import { MonthlyReport, YearlyReport } from '../types/report.types';
import SummaryCards from '../components/reports/SummaryCards';
import MonthlyChart from '../components/reports/MonthlyChart';
import YearlyChart from '../components/reports/YearlyChart';

function ReportsPage() {
  const [monthlyData, setMonthlyData] = useState<MonthlyReport[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [monthly, yearly] = await Promise.all([
        reportService.getMonthly(),
        reportService.getYearly(),
      ]);
      setMonthlyData(monthly);
      setYearlyData(yearly);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Reports</Typography>

      {monthlyData.length > 0 && (
        <>
          <SummaryCards data={monthlyData} />
          <Box sx={{ mb: 3 }}>
            <MonthlyChart data={monthlyData} />
          </Box>
        </>
      )}

      {yearlyData && (
        <Box sx={{ mb: 3 }}>
          <YearlyChart data={yearlyData} />
        </Box>
      )}

      {monthlyData.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          No data available yet. Add some transactions to see reports!
        </Typography>
      )}
    </Box>
  );
}

export default ReportsPage;
```

**Key Concepts - Promise.all:**

```typescript
const [monthly, yearly] = await Promise.all([
  reportService.getMonthly(),
  reportService.getYearly(),
]);
```

**What it does:**
- Runs both API calls in parallel (at the same time)
- Waits for both to complete
- Returns array of results

**Why use it:**
- Faster than sequential (one after another)
- `await` both → 2 seconds total
- `await` sequentially → 1 second + 1 second = 2 seconds
- `Promise.all` → max(1 second, 1 second) = 1 second

**Conditional Rendering:**
```typescript
{monthlyData.length > 0 && <MonthlyChart />}
{yearlyData && <YearlyChart />}
{monthlyData.length === 0 && <NoDataMessage />}
```
- Only show charts if data exists
- Show helpful message if no data

---

### ✅ Phase 6 Checkpoint

At this point, you should have:
- ✅ Complete application with all features
- ✅ Reports with charts and statistics
- ✅ Data visualization working
- ✅ Understanding of MUI X Charts
- ✅ Understanding of data transformation

**Test your understanding:**
- How do you transform data for charts?
- What's the difference between BarChart and LineChart?
- Why use `Promise.all` for multiple API calls?

**Test the complete app:**
1. Register/Login
2. Create categories
3. Add transactions
4. View dashboard
5. View reports with charts
6. Logout and login again (session persists)

---

## Key Concepts Explained

### 1. React Component Lifecycle

**Mounting (Component Created):**
```typescript
function MyComponent() {
  useEffect(() => {
    console.log('Component mounted');
    // Load data here
  }, []);

  return <div>Content</div>;
}
```

**Updating (Props/State Change):**
```typescript
useEffect(() => {
  console.log('userId changed');
  // Reload data when userId changes
}, [userId]);
```

**Unmounting (Component Removed):**
```typescript
useEffect(() => {
  return () => {
    console.log('Component unmounting');
    // Cleanup here
  };
}, []);
```

---

### 2. State Management

**Local State (useState):**
```typescript
const [count, setCount] = useState(0);
```
- Component-specific
- Lost when component unmounts
- Use for UI state (form inputs, modals, etc.)

**Global State (Context):**
```typescript
const { user } = useAuth();
```
- Shared across components
- Persists across navigation
- Use for app-wide data (user, theme, etc.)

---

### 3. Data Fetching Patterns

**Basic Pattern:**
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await service.getData();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

**Three States:**
1. Loading: Show spinner
2. Error: Show error message
3. Success: Show data

---

### 4. Form Handling

**Controlled Component:**
```typescript
const [value, setValue] = useState('');

<input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```
- React controls the input
- State is source of truth
- Can validate on every keystroke

**Form Submission:**
```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault(); // Don't reload page

  setLoading(true);
  try {
    await api.post('/endpoint', formData);
    // Success: close form, refresh data
  } catch (error) {
    // Error: show message
  } finally {
    setLoading(false);
  }
};
```

---

### 5. Props and Callbacks

**Parent to Child (Props):**
```typescript
// Parent
<ChildComponent data={myData} />

// Child
function ChildComponent({ data }) {
  return <div>{data}</div>;
}
```

**Child to Parent (Callback):**
```typescript
// Parent
const handleEdit = (item) => {
  console.log('Edit:', item);
};
<ChildComponent onEdit={handleEdit} />

// Child
function ChildComponent({ onEdit }) {
  return <button onClick={() => onEdit(item)}>Edit</button>;
}
```

---

### 6. Routing

**Navigate with Link:**
```typescript
import { Link } from 'react-router-dom';
<Link to="/dashboard">Dashboard</Link>
```

**Navigate Programmatically:**
```typescript
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/dashboard');
```

**Protected Routes:**
```typescript
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Route>
```
- Checks authentication before rendering
- Redirects if not logged in

---

### 7. Authentication Flow

```
1. User submits login form
         ↓
2. AuthContext.login(credentials)
         ↓
3. authService.login() → POST /api/auth/login
         ↓
4. Backend validates & returns user + sets session cookie
         ↓
5. AuthContext stores user in state
         ↓
6. All subsequent requests include cookie automatically
         ↓
7. ProtectedRoute allows access to protected pages
         ↓
8. On page refresh, AuthContext.checkAuth() runs
         ↓
9. Calls /api/auth/me to verify session still valid
         ↓
10. If valid, restores user state
```

---

### 8. Session-Based Authentication

**How It Works:**
1. **Login**: Backend creates session, sends session ID in cookie
2. **Requests**: Browser automatically sends cookie with every request
3. **Validation**: Backend checks session ID, retrieves user
4. **Logout**: Backend destroys session

**Key Configuration:**
```typescript
axios.create({
  withCredentials: true, // Send cookies with requests
});
```

**Why Session over JWT:**
- Simpler (no token storage)
- More secure (cookie HttpOnly)
- Backend controls (can revoke instantly)

---

### 9. TypeScript Benefits

**Type Safety:**
```typescript
// TypeScript catches errors at compile time
const user: User = {
  id: 1,
  username: 'john',
  // Error: Property 'email' is missing
};
```

**Autocomplete:**
```typescript
// Editor shows available properties
user. // Shows: id, username, email
```

**Refactoring:**
```typescript
// Rename interface property
// TypeScript finds all usages
```

---

### 10. Common Patterns Summary

**Fetch on Mount:**
```typescript
useEffect(() => {
  fetchData();
}, []);
```

**Create/Update/Delete:**
```typescript
// Create
await service.create(data);
fetchData(); // Refresh

// Update
await service.update(id, data);
fetchData();

// Delete
await service.delete(id);
fetchData();
```

**Modal Pattern:**
```typescript
const [open, setOpen] = useState(false);
const [editItem, setEditItem] = useState(null);

// Add
const handleAdd = () => {
  setEditItem(null);
  setOpen(true);
};

// Edit
const handleEdit = (item) => {
  setEditItem(item);
  setOpen(true);
};

<Modal open={open} onClose={() => setOpen(false)}>
  <Form item={editItem} />
</Modal>
```

---

## Testing Guide

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Logout works
- [ ] Session persists on page refresh
- [ ] Protected routes redirect when not logged in
- [ ] Can't access protected routes after logout

**Categories:**
- [ ] Create income category
- [ ] Create expense category
- [ ] Edit category
- [ ] Delete unused category
- [ ] Can't delete category in use
- [ ] Categories appear in transaction form

**Transactions:**
- [ ] Create income transaction
- [ ] Create expense transaction
- [ ] Edit transaction
- [ ] Delete transaction
- [ ] Category dropdown filters by type
- [ ] Date picker works
- [ ] Amount validates as number

**Dashboard:**
- [ ] Shows correct totals
- [ ] Income, expense, net balance accurate
- [ ] Recent transactions display
- [ ] Updates after creating transaction

**Reports:**
- [ ] Monthly chart displays
- [ ] Yearly chart displays
- [ ] Summary cards show correct totals
- [ ] Charts update after transactions change
- [ ] No data message shows when empty

---

### Testing Tips

1. **Use Browser DevTools:**
   - Network tab: See API requests/responses
   - Console: Check for errors
   - Application tab: View cookies

2. **Test Edge Cases:**
   - Empty states (no data)
   - Loading states (slow network)
   - Error states (server down)
   - Large datasets (many transactions)

3. **Test Different Browsers:**
   - Chrome
   - Firefox
   - Safari
   - Edge

4. **Test Responsiveness:**
   - Desktop
   - Tablet
   - Mobile

---

## Troubleshooting

### Issue: CORS Errors

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:2002/api/auth/login'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Cause:**
Backend not configured to allow frontend origin

**Solution:**
Backend needs CORS configuration:
```java
@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowCredentials(true)
                    .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}
```

---

### Issue: 401 Unauthorized on Every Request

**Symptoms:**
Login works, but other requests fail with 401

**Cause:**
Cookies not being sent with requests

**Solution:**
Check `withCredentials: true` in `src/services/api.ts`:
```typescript
const api = axios.create({
  withCredentials: true, // Must be true!
});
```

---

### Issue: Session Not Persisting on Refresh

**Symptoms:**
Login works, but refreshing page logs you out

**Possible Causes:**

1. **AuthContext not checking on mount:**
   ```typescript
   useEffect(() => {
     checkAuth(); // Must be here!
   }, []);
   ```

2. **Backend session timeout too short:**
   - Check Spring Security session config

3. **Cookies being cleared:**
   - Check browser settings
   - Check if incognito mode

---

### Issue: Protected Routes Not Working

**Symptoms:**
Can access `/dashboard` without logging in

**Cause:**
ProtectedRoute not configured correctly

**Solution:**
Check route structure in App.tsx:
```typescript
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Route>
```

Must be nested under ProtectedRoute!

---

### Issue: Charts Not Displaying

**Symptoms:**
Reports page shows nothing or errors

**Possible Causes:**

1. **Data format mismatch:**
   ```typescript
   // Data must be arrays of same length
   const months = ['Jan', 'Feb', 'Mar'];
   const income = [100, 200]; // Error: different length!
   ```

2. **Missing data:**
   ```typescript
   // Check for empty data
   {data.length > 0 && <Chart data={data} />}
   ```

3. **Chart container size:**
   ```typescript
   <Box sx={{ width: '100%', height: 400 }}>
     <BarChart height={350} />
   </Box>
   ```

---

### Issue: Form Not Submitting

**Symptoms:**
Click submit, nothing happens

**Possible Causes:**

1. **Missing e.preventDefault():**
   ```typescript
   const handleSubmit = (e: FormEvent) => {
     e.preventDefault(); // Must be first!
     // ...
   };
   ```

2. **Form not wrapped in <form>:**
   ```typescript
   <form onSubmit={handleSubmit}>
     {/* fields */}
   </form>
   ```

3. **Button type not set:**
   ```typescript
   <Button type="submit"> // Not just onClick!
   ```

---

### Issue: Data Not Refreshing After Create/Update

**Symptoms:**
Add transaction, but list doesn't update

**Cause:**
Not calling fetch after mutation

**Solution:**
```typescript
const handleSuccess = () => {
  fetchTransactions(); // Reload data!
};

<TransactionForm onSuccess={handleSuccess} />
```

---

### Common Console Errors

**Error:** `useAuth must be used within AuthProvider`
**Fix:** Wrap app in AuthProvider in App.tsx

**Error:** `Cannot read property 'map' of undefined`
**Fix:** Check if data exists before mapping:
```typescript
{data && data.map(...)}
```

**Error:** `A component is changing an uncontrolled input to be controlled`
**Fix:** Initialize state with empty string, not undefined:
```typescript
const [value, setValue] = useState(''); // Not useState()
```

---

## Future Enhancements

### Feature Ideas

1. **Budget Tracking:**
   - Set monthly budget per category
   - Show warnings when approaching limit
   - Progress bars for spending

2. **Recurring Transactions:**
   - Mark transactions as recurring
   - Auto-create on schedule
   - Edit/cancel recurring

3. **Multiple Accounts:**
   - Bank, cash, credit card accounts
   - Transfer between accounts
   - Account balance tracking

4. **Export Data:**
   - Download transactions as CSV
   - Generate PDF reports
   - Email reports

5. **Search & Filters:**
   - Search by description
   - Filter by date range
   - Filter by amount range
   - Advanced filters

6. **Tags:**
   - Add custom tags to transactions
   - Filter by tags
   - Tag-based reports

7. **Dark Mode:**
   - Toggle light/dark theme
   - Persist preference
   - Automatic (system preference)

8. **Notifications:**
   - Budget exceeded alerts
   - Upcoming recurring transactions
   - Weekly/monthly summaries

9. **Mobile App:**
   - React Native version
   - Camera for receipt scanning
   - Push notifications

10. **Data Visualization:**
    - Pie charts for category breakdown
    - Trend analysis
    - Year-over-year comparison
    - Custom date ranges

---

### Technical Improvements

1. **Performance:**
   - Implement pagination for transactions
   - Virtual scrolling for large lists
   - Lazy loading for charts
   - Memoization for expensive calculations

2. **State Management:**
   - Migrate to React Query for server state
   - Optimistic updates
   - Cache management
   - Background refetching

3. **Form Handling:**
   - Use React Hook Form
   - Better validation
   - Field-level errors
   - Form persistence (save drafts)

4. **Error Handling:**
   - Error boundary components
   - Retry failed requests
   - Offline support
   - Better error messages

5. **Testing:**
   - Unit tests (Jest)
   - Component tests (React Testing Library)
   - E2E tests (Playwright/Cypress)
   - API mocking (MSW)

6. **Code Quality:**
   - Prettier for formatting
   - Husky for git hooks
   - Lint-staged
   - Conventional commits

7. **Accessibility:**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support
   - Focus management

8. **Security:**
   - Input sanitization
   - XSS prevention
   - CSRF tokens (if not using cookies)
   - Rate limiting

9. **Deployment:**
   - CI/CD pipeline
   - Environment variables
   - Production build optimization
   - CDN for static assets

10. **Monitoring:**
    - Error tracking (Sentry)
    - Analytics (Google Analytics)
    - Performance monitoring
    - User feedback system

---

## Learning Resources

### Official Documentation
- [React Docs](https://react.dev/) - Official React documentation
- [React Router](https://reactrouter.com/) - Routing library docs
- [Material-UI](https://mui.com/) - MUI component library
- [MUI X Charts](https://mui.com/x/react-charts/) - Chart documentation
- [TypeScript](https://www.typescriptlang.org/) - TypeScript handbook
- [Axios](https://axios-http.com/) - HTTP client docs

### Concepts to Study Further
- React hooks (useState, useEffect, useMemo, useCallback)
- Context API and global state
- TypeScript generics and advanced types
- Async/await and Promises
- REST API design
- Session vs JWT authentication
- Form validation patterns
- Error boundary patterns
- Performance optimization
- Accessibility (a11y)

### Practice Projects
After completing this project, try:
1. Todo app with categories
2. Blog with authentication
3. E-commerce store
4. Social media feed
5. Weather dashboard

---

## Conclusion

### What You've Built

A full-stack personal finance tracker with:
- ✅ User authentication
- ✅ Category management
- ✅ Transaction CRUD
- ✅ Financial dashboard
- ✅ Data visualization
- ✅ Session-based security

### What You've Learned

**React Fundamentals:**
- Component architecture
- State management
- Props and callbacks
- Lifecycle with hooks
- Conditional rendering

**TypeScript:**
- Interfaces and types
- Type safety
- Generic types
- Type inference

**Routing:**
- Client-side navigation
- Nested routes
- Protected routes
- Programmatic navigation

**API Integration:**
- Axios configuration
- Error handling
- Loading states
- CRUD operations

**Forms:**
- Controlled components
- Validation
- Async submission
- Error display

**Authentication:**
- Session-based auth
- Context for global state
- Route protection
- Session persistence

**Data Visualization:**
- Chart libraries
- Data transformation
- Multiple chart types
- Responsive design

### Next Steps

1. **Complete the Implementation:**
   - Follow this guide step by step
   - Test each feature thoroughly
   - Ask questions when stuck

2. **Customize:**
   - Add your own styling
   - Create additional features
   - Improve UX with your ideas

3. **Deploy:**
   - Frontend: Vercel, Netlify, or GitHub Pages
   - Backend: Heroku, Railway, or AWS
   - Database: PostgreSQL on cloud

4. **Keep Learning:**
   - Build more projects
   - Learn advanced patterns
   - Contribute to open source
   - Help others learn

---

## Quick Reference

### File Creation Order

**Phase 1 - Foundation:**
1. `src/types/auth.types.ts`
2. `src/types/category.types.ts`
3. `src/types/transaction.types.ts`
4. `src/types/report.types.ts`
5. `src/services/api.ts`
6. `src/services/auth.service.ts`
7. `src/services/category.service.ts`
8. `src/services/transaction.service.ts`
9. `src/services/report.service.ts`
10. `src/contexts/AuthContext.tsx`

**Phase 2 - Routing:**
11. `src/App.tsx` (modify)
12. `src/components/layout/Navbar.tsx`
13. `src/components/layout/Layout.tsx`
14. `src/components/layout/ProtectedRoute.tsx`

**Phase 3 - Authentication:**
15. `src/components/auth/LoginForm.tsx`
16. `src/components/auth/RegisterForm.tsx`
17. `src/pages/HomePage.tsx`
18. `src/pages/LoginPage.tsx`
19. `src/pages/RegisterPage.tsx`

**Phase 4 - Transactions:**
20. `src/pages/DashboardPage.tsx`
21. `src/components/transactions/TransactionForm.tsx`
22. `src/components/transactions/TransactionList.tsx`
23. `src/pages/TransactionsPage.tsx`

**Phase 5 - Categories:**
24. `src/components/categories/CategoryForm.tsx`
25. `src/components/categories/CategoryList.tsx`
26. `src/pages/CategoriesPage.tsx`

**Phase 6 - Reports:**
27. `src/components/reports/SummaryCards.tsx`
28. `src/components/reports/MonthlyChart.tsx`
29. `src/components/reports/YearlyChart.tsx`
30. `src/pages/ReportsPage.tsx`

---

### Command Reference

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check for code issues

# Package Management
npm install [package]           # Install package
npm uninstall [package]         # Remove package
npm update                      # Update all packages
npm list --depth=0              # List installed packages
```

---

### Common Code Snippets

**Fetch Data:**
```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await service.getAll();
      setState(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

**Form Submit:**
```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    await service.create(formData);
    onSuccess();
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**Conditional Render:**
```typescript
{loading && <CircularProgress />}
{error && <Alert severity="error">{error}</Alert>}
{data && <DataDisplay data={data} />}
```

---

### Helpful VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** - Code snippets
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **TypeScript Hero** - TypeScript tools
- **Auto Import** - Automatic imports
- **Path Intellisense** - File path autocomplete
- **Material Icon Theme** - Better file icons

---

### Keyboard Shortcuts (VS Code)

- `Ctrl + P` - Quick file open
- `Ctrl + Shift + P` - Command palette
- `Ctrl + `` ` `` - Toggle terminal
- `Ctrl + /` - Toggle comment
- `Alt + Up/Down` - Move line up/down
- `Ctrl + D` - Select next occurrence
- `F2` - Rename symbol

---

## Support & Feedback

If you get stuck:
1. Check this guide's troubleshooting section
2. Read error messages carefully
3. Use browser DevTools
4. Search for errors online
5. Ask for help with specific error messages

Remember: Everyone gets stuck. Debugging is part of learning!

---

**Good luck with your project! Happy coding! 🚀**
