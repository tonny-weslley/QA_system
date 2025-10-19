# 🎃 Guia de Implementação - Frontend Halloween Quiz

**Status:** Vite configurado ✅  
**Próximos passos:** Configurar dependências e estrutura

---

## ✅ O que já foi feito

1. ✅ Vite + React + TypeScript configurado
2. ✅ Estrutura básica criada

---

## 📦 Dependências a Instalar

```bash
# Navegue para /front
cd /home/tonny/Documents/personal/halloween/front

# Instalar dependências principais
npm install axios socket.io-client react-router-dom

# Instalar TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Instalar shadcn/ui
npx shadcn@latest init

# Instalar Framer Motion
npm install framer-motion

# Instalar outras dependências
npm install qrcode react-qr-code
npm install lucide-react
npm install @hookform/resolvers zod react-hook-form
npm install sonner # para toasts

# Instalar Storybook
npx storybook@latest init
```

---

## 📁 Estrutura de Pastas a Criar

```bash
mkdir -p src/components/{atoms,molecules,organisms,templates,pages}
mkdir -p src/lib/{api,websocket,hooks,context,utils}
mkdir -p src/styles
mkdir -p src/stories
```

---

## 🔧 Arquivos de Configuração

### 1. `.env`
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

### 2. `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        halloween: {
          purple: '#6B21A8',
          orange: '#F97316',
          black: '#0F0F0F',
        },
        success: '#10B981',
        error: '#EF4444',
      },
      fontFamily: {
        creepster: ['Creepster', 'cursive'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 3. `src/lib/api/client.ts`
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 4. `src/lib/api/auth.ts`
```typescript
import { apiClient } from './client';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData extends LoginData {
  role?: 'participant' | 'admin';
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    role: string;
    createdAt: string;
  };
  token: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
};
```

### 5. `src/lib/context/AuthContext.tsx`
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, AuthResponse } from '../api/auth';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authApi.login({ username, password });
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const register = async (username: string, password: string, role?: string) => {
    const response = await authApi.register({ username, password, role: role as any });
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 🎨 Componentes Prioritários

### Button (Atom)
```typescript
// src/components/atoms/Button/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-halloween-purple text-white hover:bg-halloween-purple/90',
        secondary: 'bg-halloween-orange text-white hover:bg-halloween-orange/90',
        danger: 'bg-error text-white hover:bg-error/90',
        ghost: 'hover:bg-halloween-purple/10',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

---

## 🚀 Próximos Passos

1. **Instalar todas as dependências** listadas acima
2. **Criar arquivos de configuração** (.env, tailwind.config.js)
3. **Criar estrutura de pastas**
4. **Implementar API client e AuthContext**
5. **Criar componentes atoms** (Button, Input, Badge, etc.)
6. **Criar componentes molecules** (FormField, Card, etc.)
7. **Criar páginas** (Login, Register, Questions, etc.)
8. **Implementar WebSocket** para tempo real
9. **Adicionar animações** com Framer Motion
10. **Testar integração** com backend

---

## 📝 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview

# Storybook
npm run storybook

# Lint
npm run lint
```

---

**Criado por:** backend-node-clean-arch  
**Data:** 2025-10-19  
**Status:** Guia de implementação pronto
