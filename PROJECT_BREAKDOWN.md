# Template Website - Go Fiber + PostgreSQL + React TypeScript

## 📋 Overview
Template untuk membangun aplikasi web full-stack modern dengan:
- **Backend**: Go dengan Fiber framework
- **Database**: PostgreSQL
- **Frontend**: React dengan TypeScript
- **Deployment**: Docker ready

## 🏗️ Arsitektur Proyek

```
go-starter/
├── backend/                    # Go Fiber API
│   ├── cmd/
│   │   └── main.go            # Entry point aplikasi
│   ├── internal/
│   │   ├── config/            # Konfigurasi aplikasi
│   │   ├── database/          # Database connection & migrations
│   │   ├── handlers/          # HTTP handlers/controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/            # Database models
│   │   ├── routes/            # Route definitions
│   │   ├── services/          # Business logic
│   │   └── utils/             # Utility functions
│   ├── migrations/            # Database migrations
│   ├── go.mod
│   ├── go.sum
│   └── .env.example
├── frontend/                   # React TypeScript App
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript definitions
│   │   ├── utils/             # Utility functions
│   │   ├── styles/            # CSS/SCSS files
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── postgres.Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
├── .gitignore
└── README.md
```

## 🚀 Tech Stack Detail

### Backend (Go Fiber)
- **Framework**: [Fiber v2](https://gofiber.io/) - Express-inspired web framework
- **Database ORM**: GORM - Object Relational Mapping
- **Validation**: Go Playground Validator
- **Authentication**: JWT (JSON Web Tokens)
- **Middleware**: 
  - CORS
  - Rate Limiting
  - Logging
  - Authentication
- **Environment**: Viper untuk config management

### Database (PostgreSQL)
- **Version**: PostgreSQL 15+
- **Migration**: GORM Auto-migrate + Manual migrations
- **Connection Pool**: Configured untuk production
- **Features**:
  - UUID primary keys
  - Timestamps (created_at, updated_at)
  - Soft deletes
  - Indexing

### Frontend (React TypeScript)
- **React**: v18+ dengan functional components
- **TypeScript**: Strict mode enabled
- **Build Tool**: Vite untuk fast development
- **State Management**: 
  - React Query untuk server state
  - Zustand untuk client state
- **Routing**: React Router v6
- **UI Framework**: 
  - Tailwind CSS
  - Headless UI components
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios dengan interceptors

## 📦 Dependencies

### Backend Dependencies
```go
// Core
github.com/gofiber/fiber/v2
github.com/joho/godotenv
gorm.io/gorm
gorm.io/driver/postgres

// Authentication & Security
github.com/golang-jwt/jwt/v4
golang.org/x/crypto

// Validation & Utilities
github.com/go-playground/validator/v10
github.com/google/uuid
github.com/spf13/viper

// Middleware
github.com/gofiber/middleware/cors/v2
github.com/gofiber/middleware/limiter/v2
github.com/gofiber/middleware/logger/v2
```

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "react-query": "^3.39.0",
    "zustand": "^4.3.0",
    "axios": "^1.3.0",
    "react-hook-form": "^7.43.0",
    "zod": "^3.20.0",
    "@headlessui/react": "^1.7.0",
    "@heroicons/react": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^3.1.0",
    "typescript": "^4.9.0",
    "tailwindcss": "^3.2.0",
    "vite": "^4.1.0"
  }
}
```

## 🔧 Setup & Development

### Prerequisites
- Go 1.21+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Environment Variables

#### Backend (.env)
```env
# Server
PORT=8080
ENVIRONMENT=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=go_starter
DB_SSL_MODE=disable

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE_HOURS=24

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Go Starter Template
```

### Development Commands

#### Backend
```bash
# Setup
cd backend
go mod init go-starter
go mod tidy

# Development
go run cmd/main.go

# Build
go build -o bin/app cmd/main.go

# Test
go test ./...
```

#### Frontend
```bash
# Setup
cd frontend
npm install

# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

#### Docker Development
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# Stop services
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 🗃️ Database Schema

### Core Tables
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Posts table (example)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    published BOOLEAN DEFAULT false,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_user_id ON posts(user_id);
```

## 🛣️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get user profile

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Posts (Example Resource)
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)

## 🎨 Frontend Pages & Components

### Pages
- **Home** (`/`) - Landing page
- **Login** (`/login`) - Authentication
- **Register** (`/register`) - User registration
- **Dashboard** (`/dashboard`) - User dashboard
- **Profile** (`/profile`) - User profile management
- **Posts** (`/posts`) - Posts listing
- **Post Detail** (`/posts/:id`) - Single post view

### Key Components
- **Layout Components**
  - `Header` - Navigation header
  - `Footer` - Site footer
  - `Sidebar` - Dashboard sidebar
  - `Layout` - Main layout wrapper

- **UI Components**
  - `Button` - Reusable button component
  - `Input` - Form input component
  - `Modal` - Modal dialog
  - `Loading` - Loading spinner
  - `Alert` - Alert messages

- **Feature Components**
  - `AuthForm` - Login/Register forms
  - `PostCard` - Post preview card
  - `UserTable` - Users data table
  - `PostEditor` - Rich text editor

## 🔐 Security Features

### Backend Security
- **Password Hashing**: bcrypt dengan cost 12
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Request limiting per IP
- **CORS**: Configured untuk frontend domain
- **Input Validation**: Comprehensive validation
- **SQL Injection Prevention**: GORM ORM protection

### Frontend Security
- **XSS Prevention**: React built-in protection
- **CSRF Protection**: Token-based protection
- **Input Sanitization**: Client-side validation
- **Secure Storage**: JWT dalam httpOnly cookies
- **Route Protection**: Private route guards

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
CGO_ENABLED=0 GOOS=linux go build -o bin/app cmd/main.go

# Frontend
cd frontend
npm run build
```

### Docker Production
```bash
# Build and start
docker-compose up -d

# Scale services
docker-compose up -d --scale backend=3
```

### Environment-specific Configs
- **Development**: Hot reload, detailed logging
- **Staging**: Production-like dengan debug info
- **Production**: Optimized, minimal logging

## 📈 Performance Optimization

### Backend
- **Database**: Connection pooling, indexing
- **Caching**: Redis untuk session dan data caching
- **Compression**: Gzip middleware
- **Static Files**: Efficient serving

### Frontend
- **Code Splitting**: Route-based splitting
- **Lazy Loading**: Component lazy loading
- **Bundle Optimization**: Tree shaking
- **Image Optimization**: WebP format, lazy loading

## 🧪 Testing Strategy

### Backend Testing
```go
// Unit tests
go test ./internal/services/...

// Integration tests
go test ./internal/handlers/...

// Coverage
go test -cover ./...
```

### Frontend Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📋 Development Checklist

### Initial Setup
- [ ] Clone repository
- [ ] Setup environment variables
- [ ] Install dependencies
- [ ] Setup PostgreSQL database
- [ ] Run migrations
- [ ] Start development servers

### Feature Development
- [ ] Create database models
- [ ] Implement API endpoints
- [ ] Add input validation
- [ ] Create frontend components
- [ ] Implement state management
- [ ] Add error handling
- [ ] Write tests
- [ ] Update documentation

### Deployment Preparation
- [ ] Environment configuration
- [ ] Database migrations
- [ ] Build optimization
- [ ] Security audit
- [ ] Performance testing
- [ ] Documentation update

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Coding! 🚀**

> Template ini dirancang untuk memberikan foundation yang solid untuk pengembangan aplikasi web modern dengan Go Fiber dan React TypeScript.