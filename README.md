# AutoGuard Registry

A vehicle information management platform that enables vehicle owners to create public digital vehicle profiles accessible via QR codes, supporting emergency access, consent tracking, and administrative management.

## Project Overview

AutoGuard Registry provides a secure, privacy-conscious system for managing vehicle information through QR-based access. Vehicle owners can create profiles containing essential vehicle details and emergency contact information, all governed by explicit consent mechanisms. The platform ensures that vehicle information is accessible when needed while maintaining strict control over data sharing through an administrative dashboard.

The system is designed with transparency and data protection in mind, incorporating consent tracking, administrative oversight, and feedback mechanisms to ensure responsible data handling.

## Features

### Public Features

- **Vehicle Profile Creation**: Public interface for registering new vehicles with owner consent
- **Vehicle Profile Updates**: Controlled update mechanism for existing vehicle records
- **QR Code Access**: Direct vehicle information access via `/qr/[vehicleNumber]` endpoints
- **Public Vehicle View**: Shareable vehicle information pages at `/v/[vehicleNumber]`
- **Feedback Submission**: Integrated feedback form for user input and system improvements

### Administrative Features

- **Admin Dashboard**: Centralized management interface for all vehicle records
- **Authentication System**: Secure admin login and session management
- **Vehicle Status Control**: Toggle vehicle profiles between active and inactive states
- **Consent Tracking**: Monitor and verify user consent for data collection
- **Role-Based Access**: Administrative privilege management

### Data & Security

- **Consent Management**: Explicit consent fields tracked for all vehicle registrations
- **Prisma Migrations**: Version-controlled database schema management
- **Server Actions**: Type-safe server-side data mutations
- **API Routes**: RESTful endpoints for vehicle data operations

## Tech Stack

### Core Framework

- **Next.js 16**: React framework with App Router architecture
- **TypeScript**: Type-safe development environment
- **React Server Components**: Optimized server-side rendering

### Database & ORM

- **Prisma ORM**: Type-safe database client and migration tool
- **MySQL**: Relational database management system

### Architecture Patterns

- **Server Actions**: Server-side form handling and mutations
- **REST API Routes**: HTTP endpoints for data operations
- **Component-Based UI**: Modular React components

### Production Infrastructure

- **PM2**: Process manager for production deployment
- **Node.js**: JavaScript runtime environment

## Folder Structure

```

autoguard-registry/
├── app/
│ ├── (admin)/
│ │ └── admin/
│ │ └── page.tsx
│ ├── api/
│ │ ├── auth/
│ │ │ └── route.ts
│ │ └── vehicles/
│ │ └── [vehicleNumber]/
│ │ └── route.ts
│ ├── create/
│ │ └── page.tsx
│ ├── qr/
│ │ └── [vehicleNumber]/
│ │ └── page.tsx
│ ├── update/
│ │ └── page.tsx
│ ├── v/
│ │ └── [vehicleNumber]/
│ │ └── page.tsx
│ ├── layout.tsx
│ └── page.tsx
├── actions/
│ ├── vehicle-actions.ts
│ └── auth-actions.ts
├── components/
│ ├── FeedbackForm.tsx
│ ├── VehicleCard.tsx
│ └── AdminNav.tsx
├── lib/
│ ├── prisma.ts
│ ├── auth.ts
│ └── utils.ts
├── prisma/
│ ├── schema.prisma
│ ├── migrations/
│ │ └── [migration_files]
│ └── seed.ts
├── public/
│ └── assets/
├── .env.example
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json

```

## Environment Variables

Create a `.env` file in the project root with the following configuration:

```bash
# Database Connection String
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"

```

### Environment Variable Descriptions

- `DATABASE_URL`: MySQL connection string for Prisma ORM
- `NEXT_PUBLIC_APP_URL`: Base URL for QR code generation and redirects
- `ADMIN_USERNAME`: Administrator username for dashboard access
- `ADMIN_PASSWORD_HASH`: Bcrypt-hashed password (never store plaintext)
- `SESSION_SECRET`: Cryptographic secret for session management
- `NODE_ENV`: Runtime environment identifier

## Database Setup

### Prerequisites

- MySQL 8.0 or higher installed and running
- Database created with appropriate user permissions

### Initial Setup

1. Install dependencies:

```bash
npm install
```

2. Configure your `.env` file with valid `DATABASE_URL`

3. Generate Prisma Client:

```bash
npx prisma generate
```

4. Run initial migration:

```bash
npx prisma migrate dev --name init
```

### Schema Management

The database schema is defined in `prisma/schema.prisma` and includes models for:

- Vehicle records with owner information
- Emergency contact details
- Admin user credentials
- Consent tracking metadata
- Feedback submissions

### Migration Commands

**Create a new migration**:

```bash
npx prisma migrate dev --name description_of_changes
```

**Apply migrations in production**:

```bash
npx prisma migrate deploy
```

**Reset database** (development only):

```bash
npx prisma migrate reset
```

**Open Prisma Studio** (database GUI):

```bash
npx prisma studio
```

### Seeding Data

Optional seed script for initial admin user and test data:

```bash
npx prisma db seed
```

## Admin System

### Authentication Flow

The admin system uses server-side session management with the following security measures:

- Bcrypt password hashing with salt rounds
- Secure session storage with httpOnly cookies
- Server action-based authentication
- Protected route middleware for admin pages

### Admin Access

Admin users can access the dashboard at `/admin` after authentication. The dashboard provides:

- Complete vehicle record listing
- Individual vehicle detail views
- Vehicle status toggle controls
- Consent verification interface
- Feedback review system

### Creating Admin Users

Admin credentials are configured through environment variables. To create a new admin password hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('your_password', 10))"
```

Add the resulting hash to `ADMIN_PASSWORD_HASH` in your `.env` file.

### Role-Based Logic

The system implements administrative privilege checks through:

- Server action authorization validation
- API route authentication middleware
- Client-side route protection via session verification

## Security Considerations

### Data Protection

- **Password Security**: All passwords stored using bcrypt hashing algorithm
- **No Sensitive Identifiers**: System excludes government-issued ID numbers and regulated personal identifiers
- **Consent Tracking**: Explicit consent mechanisms for all data collection
- **Environment Secrets**: Sensitive configuration isolated in environment variables

### Application Security

- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: React automatic escaping and sanitization
- **CSRF Protection**: Server actions with built-in CSRF tokens
- **Session Management**: Secure session configuration with httpOnly flags

### Access Control

- **Admin Authentication**: Required for all administrative operations
- **Public Endpoints**: Read-only access to authorized vehicle information
- **API Authorization**: Server-side validation for all data mutations
- **Rate Limiting**: Recommended implementation for production environments

### Recommendations

- Enable HTTPS in production deployments
- Implement request rate limiting on public endpoints
- Configure Content Security Policy headers
- Regular dependency updates and security audits
- Database backup and recovery procedures

## Development

### Local Development

Start the development server:

```bash
npm run dev
```

Access the application at `http://localhost:3000`

### Build for Production

Create optimized production build:

```bash
npm run build
```

Start production server:

```bash
npm start
```

### Code Quality

Run TypeScript type checking:

```bash
npm run type-check
```

Run linting:

```bash
npm run lint
```

## License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.

---

**Note**: This project is an independent platform and is not affiliated with any government vehicle registration authority. It serves as a supplementary information system for emergency access and vehicle owner convenience.
