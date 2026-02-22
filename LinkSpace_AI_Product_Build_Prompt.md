# 🚀 LinkSpace -- Product-Level Full Stack Social Bookmarking Platform

## 🎯 Objective

Build a production-ready, scalable, cross-platform Social Bookmarking
Platform called **LinkSpace**.\
The platform must support Web (Next.js) and Mobile (React Native with
Expo) clients using a single Node.js backend API.

The system should be cleanly architected, modular, secure, and scalable.

------------------------------------------------------------------------

# 🧱 Tech Stack Requirements

## Backend

-   Node.js (TypeScript)
-   Express.js
-   Prisma ORM
-   PostgreSQL
-   JWT Authentication (Access + Refresh Tokens)
-   Bcrypt for password hashing
-   Zod or Joi for validation
-   Centralized error handling middleware
-   Environment-based configuration
-   Docker-ready

## Web App

-   Next.js (App Router)
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   Axios or Fetch for API calls
-   Protected routes with JWT handling

## Mobile App

-   React Native (Expo)
-   TypeScript
-   Expo Router
-   Axios for API calls
-   AsyncStorage for token persistence
-   Push notifications (Firebase Cloud Messaging ready)

------------------------------------------------------------------------

# 📌 Core Product Features

## 1️⃣ Authentication

-   User Signup
-   User Login
-   JWT Access & Refresh Tokens
-   Token rotation
-   Secure password hashing
-   Protected routes

## 2️⃣ User System

-   Public profile page
-   Bio and profile picture
-   Followers & Following system
-   Follow / Unfollow functionality

## 3️⃣ Bookmark System

Users must be able to: - Add a bookmark (URL required) - Edit bookmark -
Delete bookmark - Toggle public/private visibility - View bookmark
details

Each bookmark should store: - URL - Title - Description - Thumbnail
URL - Tags - Collections - Like count - Comment count

## 4️⃣ Collections

-   Create collection
-   Add bookmarks to collection
-   Remove bookmarks
-   View collection page

## 5️⃣ Tags

-   Add tags to bookmarks
-   Search by tag
-   Tag filtering endpoint

## 6️⃣ Social Features

-   Like / Unlike bookmarks
-   Comment on bookmarks
-   View trending feed
-   View following feed

Trending logic should consider: - Likes - Comments - Recency

## 7️⃣ AI Integration (Optional but Structured)

-   Endpoint: POST /ai/summarize
-   Accepts URL
-   Returns:
    -   Generated title
    -   Short summary
    -   Suggested tags

------------------------------------------------------------------------

# 🗄️ Database Design Requirements

Must include relational models for: - User - Bookmark - Tag -
BookmarkTag (many-to-many) - Collection - BookmarkCollection
(many-to-many) - Comment - Like - Follow

Use UUID as primary keys. Add proper indexing for performance. Use
createdAt timestamps.

------------------------------------------------------------------------

# 🧩 Backend Architecture Structure

Follow modular architecture:

src/ - config/ - middlewares/ - modules/ - auth/ - users/ - bookmarks/ -
collections/ - tags/ - comments/ - follows/ - ai/ - utils/ - app.ts -
server.ts

Each module must contain: - Controller - Service - Routes - Validation
schema

------------------------------------------------------------------------

# 🔐 Security Requirements

-   Hash passwords with bcrypt
-   Validate request bodies
-   Rate limit auth routes
-   Sanitize inputs
-   CORS configuration
-   Secure HTTP headers
-   Proper error handling

------------------------------------------------------------------------

# 🌐 API Endpoints Required

Auth: POST /auth/signup POST /auth/login POST /auth/refresh

Bookmarks: GET /bookmarks POST /bookmarks GET /bookmarks/:id PUT
/bookmarks/:id DELETE /bookmarks/:id

Feed: GET /feed/trending GET /feed/following

Social: POST /bookmarks/:id/like POST /bookmarks/:id/comment

User: GET /user/:username POST /user/follow/:id

AI: POST /ai/summarize

------------------------------------------------------------------------

# 💻 Web App Requirements

Pages: - Landing page - Login / Signup - Dashboard - Feed (Trending +
Following) - Bookmark detail page - User profile page - Collection
page - Search page

UI Requirements: - Responsive layout - Card-based bookmark UI - Infinite
scroll feed - Dark/light mode - Clean SaaS-level design

------------------------------------------------------------------------

# 📱 Mobile App Requirements

Screens: - Login / Signup - Feed - Add Bookmark - Bookmark Detail -
Profile - Search

Must: - Persist JWT securely - Handle token refresh - Use reusable API
client - Support pull-to-refresh

------------------------------------------------------------------------

# 🚀 Deployment Requirements

-   Dockerfile for backend
-   Environment variable configuration
-   Production build scripts
-   Database migration setup
-   Ready for deployment on:
    -   Render / Fly.io (Backend)
    -   Vercel (Web)
    -   Expo EAS (Mobile)

------------------------------------------------------------------------

# 📊 Scalability Considerations

-   Use pagination on feeds
-   Add database indexes
-   Modular architecture
-   Separation of concerns
-   Easy to extend into microservices later

------------------------------------------------------------------------

# 🎯 Final Deliverables

The AI must generate:

1.  Full backend codebase
2.  Prisma schema
3.  API routes
4.  Web frontend project structure
5.  Mobile app structure
6.  Environment setup instructions
7.  Docker setup
8.  README with setup steps

The result should be clean, production-grade, and scalable.
