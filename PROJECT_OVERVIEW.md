# KiCad Issue CN - Project Overview

## 1. Project Structure

### 1.1 Directory Structure

```
├── app/
│   ├── [lang]/              # Localized versions of pages
│   │   ├── admin/           # Admin dashboard
│   │   ├── issues/          # Issue-related pages
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   └── page.tsx         # Home page
│   ├── admin/               # Admin dashboard (non-localized)
│   ├── api/                 # API routes
│   │   ├── admin/           # Admin-related API
│   │   ├── auth/            # Authentication API
│   │   ├── issues/          # Issue-related API
│   │   └── webhook/         # Webhook endpoints
│   ├── hooks/               # Custom React hooks
│   ├── issues/              # Issue-related pages (non-localized)
│   ├── login/               # Login page (non-localized)
│   ├── register/            # Registration page (non-localized)
│   └── page.tsx             # Home page (non-localized)
├── components/              # React components
│   ├── ui/                  # UI components
│   ├── CommentForm.tsx      # Comment form component
│   ├── CommentItem.tsx      # Comment item component
│   ├── CommentList.tsx      # Comment list component
│   ├── IssueItem.tsx        # Issue item component
│   ├── IssueList.tsx        # Issue list component
│   ├── IssueListClient.tsx  # Client-side issue list
│   ├── LanguageToggle.tsx   # Language toggle component
│   ├── Navigation.tsx       # Navigation component
│   ├── ThemeApplier.tsx     # Theme applier component
│   └── ThemeToggle.tsx      # Theme toggle component
├── lib/                     # Utility functions and types
│   ├── admin.ts             # Admin-related functions
│   ├── auth.ts              # Authentication functions
│   ├── db.ts                # Database operations
│   ├── gitlab.ts            # GitLab API integration
│   └── types.ts             # Type definitions
├── prisma/                  # Prisma ORM files
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Database schema
├── public/                  # Static files
│   ├── messages/            # Localization messages
│   └── ...                  # Other static assets
├── .github/                 # GitHub workflows
├── docs/                    # Documentation
├── tasks/                   # Task files
├── package.json             # Project dependencies
├── next.config.ts           # Next.js configuration
└── tsconfig.json            # TypeScript configuration
```

### 1.2 Key Files and Their Purpose

| File | Purpose | Path |
|------|---------|------|
| `lib/db.ts` | Database operations and Prisma client setup | [lib/db.ts](file:///Users/admin/code/kicad-issue-cn/lib/db.ts) |
| `lib/auth.ts` | Authentication functions and session management | [lib/auth.ts](file:///Users/admin/code/kicad-issue-cn/lib/auth.ts) |
| `lib/gitlab.ts` | GitLab API integration | [lib/gitlab.ts](file:///Users/admin/code/kicad-issue-cn/lib/gitlab.ts) |
| `lib/types.ts` | Type definitions for the application | [lib/types.ts](file:///Users/admin/code/kicad-issue-cn/lib/types.ts) |
| `prisma/schema.prisma` | Database schema definition | [prisma/schema.prisma](file:///Users/admin/code/kicad-issue-cn/prisma/schema.prisma) |
| `app/api/auth/login/route.ts` | Login API endpoint | [app/api/auth/login/route.ts](file:///Users/admin/code/kicad-issue-cn/app/api/auth/login/route.ts) |
| `app/api/auth/register/route.ts` | Registration API endpoint | [app/api/auth/register/route.ts](file:///Users/admin/code/kicad-issue-cn/app/api/auth/register/route.ts) |
| `app/api/issues/route.ts` | Issue creation and listing API endpoint | [app/api/issues/route.ts](file:///Users/admin/code/kicad-issue-cn/app/api/issues/route.ts) |

## 2. Database Schema

### 2.1 Tables

#### User Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | String (UUID) | Primary key |
| `email` | String | Unique email address |
| `passwordHash` | String | Hashed password |
| `role` | String | User role (default: 'user') |
| `createdAt` | DateTime | Creation timestamp |
| `nickname` | String | User's display name |

#### Invite Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | String (UUID) | Primary key |
| `code` | String | Unique invite code |
| `used` | Boolean | Whether the invite has been used |
| `usedBy` | String | Email of the user who used the invite |
| `createdAt` | DateTime | Creation timestamp |
| `email` | String | Email for which the invite was created |

#### Issue Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | String (UUID) | Primary key |
| `gitlabIid` | Integer | Unique GitLab issue ID |
| `title` | String | Issue title |
| `userId` | String | Foreign key to User table |
| `createdAt` | DateTime | Creation timestamp |

### 2.2 Relationships
- User has many Issues (one-to-many)
- Issue belongs to one User (many-to-one)

### 2.3 Schema Evolution
The database schema has evolved through the following migrations:
1. **Initial Migration** (20260415075854_init): Created the `issues` table with basic fields
2. **Support Admin** (20260417031842_support_admin): Added `User` and `Invite` tables, recreated `Issue` table with user relation
3. **Add Email to Invite** (20260417101638_add_email_to_invite): Added `email` field to `Invite` table
4. **Add Nickname to User** (20260420140418_add_nickname_to_user): Added `nickname` field to `User` table

## 3. Authentication and Authorization

### 3.1 Authentication Flow
1. **Registration**:
   - User provides email, password, nickname, and invite code (unless admin email)
   - System verifies invite code (if not admin email)
   - System hashes password and creates user account
   - System sets session cookie

2. **Login**:
   - User provides email and password
   - System verifies credentials
   - System checks if user should be admin based on ADMIN_EMAILS environment variable
   - System sets session cookie

3. **Session Management**:
   - Sessions are stored in cookies with a 7-day expiration
   - Session cookie is httpOnly and secure in production

### 3.2 Authorization
- **Admin Users**: Users whose email is in the ADMIN_EMAILS environment variable
- **Regular Users**: All other users
- Admin users have access to the admin dashboard for user management

## 4. GitLab Integration

### 4.1 API Endpoints Used
- **Create Issue**: `POST /projects/{project_id}/issues`
- **List Issues**: `GET /projects/{project_id}/issues`
- **Get Issue**: `GET /projects/{project_id}/issues/{iid}`
- **List Notes**: `GET /projects/{project_id}/issues/{iid}/notes`
- **Create Note**: `POST /projects/{project_id}/issues/{iid}/notes`

### 4.2 Configuration
- `GITLAB_TOKEN`: Personal access token for GitLab API
- `GITLAB_PROJECT_ID`: GitLab project ID (default: 15502567 for KiCad)
- `GITLAB_BASE_URL`: GitLab API base URL (default: https://gitlab.com/api/v4)

## 5. Pages and Routes

### 5.1 Public Pages
- **Home Page**: Displays welcome information and links to other pages
- **Login Page**: Login form for existing users
- **Register Page**: Registration form for new users (requires invite code)

### 5.2 Protected Pages
- **Issues List Page**: Displays a list of issues, filtered by current user if logged in
- **Issue Detail Page**: Displays detailed information about a specific issue
- **New Issue Page**: Form to create a new issue
- **Admin Dashboard**: User management interface for admin users

### 5.3 API Routes
- **Authentication**:
  - `POST /api/auth/login`: Login endpoint
  - `POST /api/auth/register`: Registration endpoint
  - `GET /api/auth/me`: Get current user information
  - `POST /api/auth/logout`: Logout endpoint

- **Issues**:
  - `GET /api/issues`: List issues
  - `POST /api/issues`: Create new issue
  - `GET /api/issues/{iid}`: Get issue details
  - `POST /api/issues/{iid}/notes`: Add comment to issue

- **Admin**:
  - `GET /api/admin/users`: List users
  - `POST /api/admin/promote`: Promote user to admin
  - `POST /api/admin/demote`: Demote user from admin
  - `POST /api/admin/invites`: Create invite code

- **Webhooks**:
  - `POST /api/webhook/gitlab`: GitLab webhook endpoint

## 6. Workflow

### 6.1 User Flow
1. **New User**:
   - Obtains invite code from admin
   - Registers account using invite code
   - Logs in to the application
   - Creates new issues or views existing ones

2. **Existing User**:
   - Logs in to the application
   - Creates new issues, views existing ones, or adds comments

3. **Admin User**:
   - Logs in to the application
   - Manages users (promote/demote)
   - Creates invite codes for new users
   - Performs regular user actions

### 6.2 Issue Flow
1. **Creating an Issue**:
   - User fills out issue form with title, description, and labels
   - System creates issue in GitLab via API
   - System stores issue reference in local database

2. **Viewing Issues**:
   - User navigates to issues list page
   - System displays issues, filtered by current user if logged in
   - User clicks on issue to view details
   - System fetches issue details and comments from GitLab

3. **Adding Comments**:
   - User views issue detail page
   - User enters comment in comment form
   - System adds comment to GitLab via API

## 7. Localization

The application supports localization through:
- **Language files** in `public/messages/` directory
- **Localized routes** in `app/[lang]/` directory
- **Language toggle** component for switching between languages

## 8. Theme Support

The application supports dark/light theme through:
- **Theme context** in `components/ui/ThemeContext.tsx`
- **Theme toggle** component for switching between themes
- **Theme applier** component for applying the selected theme

## 9. Development Setup

### 9.1 Prerequisites
- Node.js (18+)
- PostgreSQL database
- GitLab personal access token (for GitLab integration)

### 9.2 Installation
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd kicad-issue-cn
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env` file with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/kicad-issue-cn"
   GITLAB_TOKEN="your-gitlab-personal-access-token"
   ADMIN_EMAILS="admin1@example.com,admin2@example.com"
   ```

4. **Run database migrations**:
   ```bash
   pnpm prisma:migrate
   ```

5. **Start the development server**:
   ```bash
   pnpm dev
   ```

## 10. Deployment

### 10.1 Build Process
1. **Generate Prisma client**:
   ```bash
   pnpm prisma:generate
   ```

2. **Build the application**:
   ```bash
   pnpm build
   ```

### 10.2 Deployment Options
- **Vercel** (recommended): Connect repository to Vercel for automatic deployments
- **Docker**: Use the provided Dockerfile to build and run the application

## 11. Monitoring and Maintenance

### 11.1 Logging
- Application logs errors to the console
- GitLab API calls are logged for debugging

### 11.2 Common Issues
- **GitLab API errors**: Check GITLAB_TOKEN and GITLAB_PROJECT_ID environment variables
- **Database connection errors**: Check DATABASE_URL environment variable
- **Authentication issues**: Verify user credentials and session cookie settings

## 12. Future Enhancements

- **Improved error handling**
- **More comprehensive user permissions**
- **Advanced issue filtering and search**
- **Integration with other issue trackers**
- **Enhanced localization support**
- **User profile management**
