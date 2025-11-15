# SG Cars Trends - Admin Dashboard

Admin dashboard for managing the SG Cars Trends platform, built with Next.js 16 and Better Auth.

## Features

- 🔐 **Authentication**: Email/password and Google OAuth with Better Auth
- 📝 **Blog Management**: Create and regenerate AI-powered blog posts
- 🚗 **Data Management**: View and manage car registration and COE data
- ⚙️ **System Settings**: Maintenance mode, user management, and configuration
- 📊 **Analytics**: Monitor application usage and performance

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Upstash Redis instance

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here  # Generate with: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3001   # Admin dashboard URL

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Redis
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

**Required Environment Variables:**
- `BETTER_AUTH_SECRET` - Secret key for session encryption (generate with `openssl rand -base64 32`)
- `BETTER_AUTH_URL` - Admin dashboard URL (e.g., `http://localhost:3001` for dev, `https://admin.sgcarstrends.com` for prod)
- `DATABASE_URL` - PostgreSQL connection string
- `UPSTASH_REDIS_REST_URL` - Redis instance URL
- `UPSTASH_REDIS_REST_TOKEN` - Redis authentication token

**Optional Environment Variables:**
- `GOOGLE_CLIENT_ID` - Google OAuth client ID for social login
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### Database Setup

1. Run database migrations:
```bash
pnpm db:migrate
```

2. Create your first admin user (after starting the app):
   - Navigate to `/login`
   - Sign up with email/password or Google OAuth
   - The first user is automatically granted admin access

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser.

## Authentication

This app uses [Better Auth](https://www.better-auth.com/) for authentication with:

- **Email/Password**: Standard email and password login
- **Google OAuth**: Sign in with Google account
- **Admin Plugin**: User role management and access control
- **Session Management**: Secure cookie-based sessions

### Creating Additional Admin Users

1. Log in as an existing admin
2. Navigate to Settings → Users
3. Create new users or invite via email

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── layout.tsx    # Dashboard layout with sidebar
│   │   ├── page.tsx      # Dashboard home
│   │   ├── content/      # Content management
│   │   └── settings/     # Settings pages
│   ├── login/            # Login page (public)
│   ├── actions/          # Server actions
│   └── api/              # API routes
├── components/           # React components
├── lib/                  # Auth configuration
└── proxy.ts             # Authentication middleware
```

## Security

- All routes except `/login` and `/api/auth/*` require authentication
- Server actions are protected with session validation
- Passwords are hashed using bcrypt
- Sessions are encrypted and stored in secure cookies
- CSRF protection enabled by default

## Deployment

See the main project documentation for deployment instructions.
