# Social Feed

A full-stack social media feed application with a **Node.js/Express** backend and **React Native/Expo** mobile frontend.

---

## Tech Stack

### Backend

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js v5
- **Database:** PostgreSQL with Prisma ORM v7
- **Authentication:** JWT (access + refresh tokens)
- **Notifications:** Firebase Cloud Messaging (FCM)
- **Validation:** Zod
- **Security:** Helmet, CORS, rate limiting

### Frontend (Mobile)

- **Framework:** React Native 0.81 with Expo SDK 54
- **Routing:** Expo Router v6 (file-based)
- **State Management:** Redux Toolkit + RTK Query
- **Token Storage:** expo-secure-store
- **Push Notifications:** expo-notifications + Firebase
- **Icons:** @expo/vector-icons (Ionicons)

---

## Project Structure

```
techzu_task/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database models
│   │   ├── migrations/          # Database migrations
│   │   └── seed.ts              # Sample data seeder
│   └── src/
│       ├── server.ts            # Entry point
│       ├── app.ts               # Express app setup
│       ├── config/
│       │   ├── env.ts           # Environment variables
│       │   └── firebase.ts      # Firebase Admin SDK
│       ├── middleware/
│       │   └── auth.ts          # JWT authentication
│       ├── routes/
│       │   ├── auth.routes.ts   # Auth endpoints
│       │   ├── post.routes.ts   # Post endpoints
│       │   └── user.routes.ts   # User endpoints
│       ├── services/
│       │   ├── auth.service.ts
│       │   ├── post.service.ts
│       │   ├── interaction.service.ts
│       │   └── notification.service.ts
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   ├── post.controller.ts
│       │   └── user.controller.ts
│       ├── validators/          # Zod schemas
│       └── utils/               # JWT & password helpers
│
├── mobile/
│   ├── app/
│   │   ├── _layout.tsx          # Root layout (auth routing)
│   │   ├── sign-in.tsx          # Login screen
│   │   ├── sign-up.tsx          # Register screen
│   │   └── (app)/
│   │       ├── _layout.tsx      # Notifications init
│   │       ├── post/[id].tsx    # Post detail screen
│   │       └── (tabs)/
│   │           ├── _layout.tsx  # Tab bar config
│   │           ├── index.tsx    # Feed screen
│   │           ├── create.tsx   # Create post screen
│   │           └── profile.tsx  # Profile screen
│   └── src/
│       ├── store/index.ts       # Redux store
│       ├── features/
│       │   ├── authSlice.ts     # Auth state
│       │   └── apiSlice.ts      # RTK Query API
│       ├── components/
│       │   ├── PostCard.tsx
│       │   ├── CommentItem.tsx
│       │   ├── AppInput.tsx
│       │   ├── AppTextArea.tsx
│       │   └── AppSplash.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── useNotifications.ts
│       ├── constants/
│       │   ├── theme.ts         # Colors, spacing, font sizes
│       │   └── config.ts        # BASE_URL
│       ├── lib/
│       │   └── secureStorage.ts # Token storage
│       └── types/index.ts       # TypeScript interfaces
│
└── README.md
```

---

## Database Models

| Model | Description |
|-------|-------------|
| **User** | id, username (unique), email (unique), passwordHash, fcmToken |
| **Post** | id, content (max 500 chars), userId (FK) |
| **Like** | id, userId, postId — unique constraint on (userId, postId) |
| **Comment** | id, content (max 500 chars), userId, postId |
| **RefreshToken** | id, token (unique), userId, expiresAt |

All models include `createdAt` timestamps. Likes and comments cascade delete on user/post removal.

---

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | No | Register (username, email, password) |
| POST | `/auth/login` | No | Login (email, password) |
| POST | `/auth/refresh` | No | Refresh access token |

Rate limited: 20 requests / 15 minutes.

### Posts (`/posts`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/posts` | Yes | Get feed (paginated, optional `?username=` filter) |
| POST | `/posts` | Yes | Create post (content, max 500 chars) |
| GET | `/posts/:id` | Yes | Get single post with stats |
| POST | `/posts/:id/like` | Yes | Toggle like |
| POST | `/posts/:id/comment` | Yes | Add comment |
| GET | `/posts/:id/comments` | Yes | Get comments (paginated) |

Rate limited: 100 requests / 15 minutes.

### Users (`/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/users/me/fcm-token` | Yes | Register FCM token for push notifications |

---

## Authentication Flow

1. User signs up or logs in → receives access token (15 min) + refresh token (7 days)
2. Access token sent as `Authorization: Bearer <token>` on every request
3. On 401 response → RTK Query auto-refreshes using the refresh token
4. Refresh tokens rotate on each use (old token deleted, new one issued)
5. Tokens stored encrypted via `expo-secure-store`
6. On app startup → validates stored tokens against the backend before granting access

---

## Push Notifications

- On login, the app registers the device's FCM token with the backend
- When a user **likes** or **comments** on a post, the post author receives a push notification
- Self-interactions don't trigger notifications
- Firebase Admin SDK sends notifications server-side

---

## Mobile App Screens

| Screen | Description |
|--------|-------------|
| **Sign In** | Email/password login with link to sign-up |
| **Sign Up** | Username, email, password registration |
| **Feed** | Infinite-scroll post list, pull-to-refresh, search by username |
| **Create** | Text area with 500-char limit to create a post |
| **Post Detail** | Full post, like button, paginated comments, add comment |
| **Profile** | User info (avatar, username, email, join date), logout |
| **Splash** | Loading screen shown during token verification |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`) — for cloud builds

### Backend Setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and JWT secrets

# Run database migrations
npm run db:migrate

# (Optional) Seed sample data
npm run db:seed

# Start development server
npm run dev
```

**Required environment variables:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/social_feed
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY=your-firebase-private-key
```

### Mobile Setup

```bash
cd mobile
npm install

# Update the backend URL
# Edit src/constants/config.ts with your backend URL

# Start Expo dev server
npm start
```

### Building APK

**Local debug build:**
```bash
cd mobile/android
./gradlew assembleDebug
# APK output: android/app/build/outputs/apk/debug/app-debug.apk
```

**EAS cloud build (preview APK):**
```bash
cd mobile
eas build --platform android --profile preview
```

---

## API Response Format

```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## Key Architecture Decisions

- **RTK Query** for server state — automatic caching, pagination merging, and optimistic updates (likes)
- **Redux Slice** for client state — auth credentials and loading state
- **Expo Router** for file-based navigation — similar to Next.js routing
- **expo-secure-store** over AsyncStorage — encrypted token storage
- **Zod validation** on backend — type-safe request validation
- **Token rotation** — refresh tokens are single-use for security
- **Rate limiting** — prevents brute force on auth and API abuse
