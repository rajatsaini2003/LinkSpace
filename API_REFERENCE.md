# LinkSpace API Reference

**Base URL:** `http://localhost:3030`

All responses follow the standard envelope:

```json
{
  "success": true,
  "message": "...",
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 100, "hasNextPage": true }  // optional
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [...]  // optional validation errors
}
```

---

## Auth

### POST /api/auth/signup

Create new account.

**Request:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123",
  "displayName": "John Doe"  // optional
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "displayName": "John Doe",
      "createdAt": "2026-02-22T..."
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### POST /api/auth/login

**Request:**

```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "displayName": "John Doe",
      "bio": null,
      "avatarUrl": null,
      "isPublic": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### POST /api/auth/refresh

**Request:**

```json
{
  "refreshToken": "eyJ..."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### POST /api/auth/logout

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**

```json
{
  "refreshToken": "eyJ..."
}
```

**Response (200):**

```json
{ "success": true, "message": "Logged out successfully", "data": null }
```

---

## Users

### GET /api/users/me

Get current authenticated user.

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**

```json
{
  "success": true,
  "message": "Current user retrieved",
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "displayName": "John Doe",
    "bio": "...",
    "avatarUrl": "...",
    "isPublic": true,
    "email": "john@example.com",
    "createdAt": "...",
    "updatedAt": "...",
    "_count": {
      "bookmarks": 5,
      "followers": 12,
      "following": 8
    }
  }
}
```

### GET /api/users/:username

Get public profile. Optional auth for `isFollowing` status.

**Response (200):**

```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "displayName": "John Doe",
    "bio": "...",
    "avatarUrl": "...",
    "isPublic": true,
    "createdAt": "...",
    "_count": {
      "bookmarks": 5,
      "followers": 12,
      "following": 8
    },
    "isFollowing": false
  }
}
```

### PUT /api/users/profile

Update own profile.

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**

```json
{
  "displayName": "John",      // optional
  "bio": "Hello world",       // optional
  "avatarUrl": "https://...", // optional
  "isPublic": true            // optional
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated",
  "data": { "id": "...", "username": "...", "displayName": "...", "bio": "...", "avatarUrl": "...", "isPublic": true, "createdAt": "..." }
}
```

### POST /api/users/follow/:id

Toggle follow/unfollow a user.

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**

```json
{ "success": true, "message": "Now following user", "data": { "following": true } }
```

### GET /api/users/:username/followers?page=1&limit=20

**Response (200):**

```json
{
  "success": true,
  "data": {
    "followers": [ { "id": "...", "username": "...", "displayName": "...", "avatarUrl": "..." } ],
    "total": 50,
    "page": 1,
    "limit": 20,
    "hasNextPage": true
  }
}
```

### GET /api/users/:username/following?page=1&limit=20

Same shape as followers.

---

## Bookmarks

### GET /api/bookmarks/me?page=1&limit=20&tag=javascript&search=react

Get the authenticated user's own bookmarks (includes both public and private).

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):** Same shape as `GET /api/bookmarks`.

### GET /api/bookmarks?page=1&limit=20&tag=javascript&search=react&userId=uuid

List bookmarks. Optional auth.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "bookmarks": [
      {
        "id": "uuid",
        "url": "https://...",
        "title": "...",
        "description": "...",
        "imageUrl": "...",
        "isPublic": true,
        "userId": "uuid",
        "createdAt": "...",
        "updatedAt": "...",
        "user": { "id": "...", "username": "...", "displayName": "...", "avatarUrl": "..." },
        "tags": [ { "id": "...", "name": "javascript" } ],
        "_count": { "likes": 5, "comments": 3 },
        "isLiked": false
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "hasNextPage": true
  }
}
```

### GET /api/bookmarks/:id

Get single bookmark with comments.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "...",
    "title": "...",
    "description": "...",
    "imageUrl": "...",
    "isPublic": true,
    "userId": "uuid",
    "user": { ... },
    "tags": [ { "id": "...", "name": "..." } ],
    "_count": { "likes": 5, "comments": 3 },
    "isLiked": false,
    "comments": [
      {
        "id": "uuid",
        "content": "Great link!",
        "userId": "uuid",
        "bookmarkId": "uuid",
        "createdAt": "...",
        "updatedAt": "...",
        "user": { "id": "...", "username": "...", "displayName": "...", "avatarUrl": "..." }
      }
    ]
  }
}
```

### POST /api/bookmarks

Create bookmark.

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**

```json
{
  "url": "https://example.com",
  "title": "Example Site",
  "description": "A great resource",     // optional
  "imageUrl": "https://img.example.com", // optional
  "isPublic": true,                      // default: true
  "tags": ["javascript", "tutorial"],    // default: []
  "collectionIds": ["uuid"]             // default: []
}
```

**Response (201):** Full bookmark object.

### PUT /api/bookmarks/:id

Update bookmark (owner only).

**Headers:** `Authorization: Bearer <accessToken>`

**Request:** Same fields as create, all optional.

**Response (200):** Full bookmark object.

### DELETE /api/bookmarks/:id

Permanently delete a bookmark. **Cascade deletes** all associated likes, comments, tag associations, and collection entries.

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**

```json
{ "success": true, "message": "Bookmark deleted", "data": null }
```

> **Note:** Only the bookmark owner can delete it. All related data (likes, comments, tags, collection memberships) is automatically removed.

### POST /api/bookmarks/:id/like

Toggle like/unlike.

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**

```json
{ "success": true, "message": "Bookmark liked", "data": { "liked": true, "count": 6 } }
```

### GET /api/bookmarks/:id/comments?page=1&limit=20

Get comments for a bookmark.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "comments": [ { "id": "...", "content": "...", "user": { ... }, "createdAt": "..." } ],
    "total": 10,
    "page": 1,
    "limit": 20,
    "hasNextPage": false
  }
}
```

### POST /api/bookmarks/:id/comments

Add comment.

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**

```json
{ "content": "Great link!" }
```

**Response (201):** Comment object with user.

---

## Collections

### GET /api/collections?userId=uuid

List collections. Optional auth.

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My Collection",
      "description": "...",
      "isPublic": true,
      "userId": "uuid",
      "user": { ... },
      "_count": { "bookmarks": 5 }
    }
  ]
}
```

### GET /api/collections/:id

Get collection with bookmarks.

### POST /api/collections

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**

```json
{
  "name": "Frontend Tools",
  "description": "Useful tools",  // optional
  "isPublic": true                // default: true
}
```

**Response (201):** Collection object.

### PUT /api/collections/:id

**Headers:** `Authorization: Bearer <accessToken>`

**Request:** Same fields, all optional.

### DELETE /api/collections/:id

**Headers:** `Authorization: Bearer <accessToken>`

### GET /api/collections/me

Get all collections for the authenticated user (including private).

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):** Same shape as `GET /api/collections`.

### GET /api/collections/share/:slug

Get a collection by its public share slug. Returns the collection with all bookmarks. Works without authentication for public collections.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Collection",
    "description": "...",
    "isPublic": true,
    "shareSlug": "abc123",
    "user": { "id": "uuid", "username": "johndoe", "displayName": "John", "avatarUrl": null },
    "_count": { "bookmarks": 5 },
    "bookmarks": [
      {
        "id": "uuid",
        "url": "https://...",
        "title": "...",
        "description": "...",
        "imageUrl": "...",
        "tags": [{ "id": "uuid", "name": "react" }],
        "user": { ... },
        "_count": { "likes": 3, "comments": 1 },
        "addedAt": "2026-02-22T..."
      }
    ]
  }
}
```

### POST /api/collections/:id/clone

Clone a public collection into the authenticated user's account. The cloned collection is set to private by default and includes all the same bookmarks.

**Headers:** `Authorization: Bearer <accessToken>`

**Response (201):** Collection object.

> **Note:** You cannot clone your own collection.

### POST /api/collections/:id/regenerate-slug

Regenerate the share slug for a collection you own. Invalidates the old share link.

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):** Updated collection object with new `shareSlug`.

### POST /api/collections/:id/bookmarks

Add bookmark to collection.

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**

```json
{ "bookmarkId": "uuid" }
```

### DELETE /api/collections/:id/bookmarks/:bookmarkId

Remove bookmark from collection.

**Headers:** `Authorization: Bearer <accessToken>`

---

## Tags

### GET /api/tags?search=java&limit=50

Search/list tags.

**Response (200):**

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "javascript", "createdAt": "...", "bookmarkCount": 42 }
  ]
}
```

### GET /api/tags/trending?limit=20

Get popular tags.

### GET /api/tags/:name

Get single tag by name.

---

## Comments (standalone routes)

### PUT /api/comments/:commentId

Update own comment.

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**

```json
{ "content": "Updated comment" }
```

### DELETE /api/comments/:commentId

Delete own comment.

**Headers:** `Authorization: Bearer <accessToken>`

---

## Feed

### GET /api/feed/trending?page=1&limit=20

Public trending feed (last 7 days, sorted by likes → comments → recency). Optional auth for `isLiked`.

**Response:** Same shape as bookmarks list.

### GET /api/feed/following?page=1&limit=20

Bookmarks from followed users.

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** Same shape as bookmarks list.

---

## AI

### POST /api/ai/summarize

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**

```json
{
  "url": "https://example.com",
  "title": "Example",       // optional
  "content": "Page text..." // optional
}
```

**Response (200):**

```json
{ "success": true, "data": { "summary": "...", "url": "https://example.com" } }
```

### POST /api/ai/suggest-tags

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**

```json
{
  "title": "Learn React Hooks",
  "description": "A tutorial...", // optional
  "url": "https://..."           // optional
}
```

**Response (200):**

```json
{ "success": true, "data": { "tags": ["react", "hooks", "javascript", "tutorial"] } }
```

---

## Chat

### POST /api/chat

Create or retrieve an existing 1-on-1 conversation with another user.

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**

```json
{
  "participantId": "uuid-of-other-user"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "createdAt": "2026-02-22T...",
    "updatedAt": "2026-02-22T...",
    "participants": [
      { "user": { "id": "uuid", "username": "alice", "displayName": "Alice", "avatarUrl": null }, "joinedAt": "..." },
      { "user": { "id": "uuid", "username": "bob", "displayName": "Bob", "avatarUrl": null }, "joinedAt": "..." }
    ]
  }
}
```

### GET /api/chat

Get all conversations for the authenticated user. Returns conversations sorted by most recent message.

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "createdAt": "...",
      "updatedAt": "...",
      "participants": [
        { "user": { "id": "uuid", "username": "alice", "displayName": "Alice", "avatarUrl": null }, "joinedAt": "..." }
      ],
      "lastMessage": {
        "id": "uuid",
        "content": "Hey!",
        "senderId": "uuid",
        "createdAt": "..."
      },
      "unreadCount": 2
    }
  ]
}
```

### GET /api/chat/:conversationId/messages

Get paginated messages for a conversation (newest first).

**Headers:** `Authorization: Bearer <accessToken>`

**Query:** `?page=1&limit=50`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "content": "Hello!",
        "conversationId": "uuid",
        "senderId": "uuid",
        "createdAt": "...",
        "isRead": true,
        "sender": { "id": "uuid", "username": "alice", "displayName": "Alice", "avatarUrl": null }
      }
    ],
    "meta": { "page": 1, "limit": 50, "total": 120, "totalPages": 3 }
  }
}
```

### POST /api/chat/:conversationId/messages

Send a message in a conversation. User must be a participant.

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**

```json
{
  "content": "Hello there!"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "Hello there!",
    "conversationId": "uuid",
    "senderId": "uuid",
    "createdAt": "...",
    "isRead": false,
    "sender": { "id": "uuid", "username": "bob", "displayName": "Bob", "avatarUrl": null }
  }
}
```

### PUT /api/chat/:conversationId/read

Mark all messages in a conversation as read.

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**

```json
{ "success": true, "message": "Messages marked as read" }
```

### POST /api/bookmarks/:id/toggle-collection

Toggle whether a bookmark is saved in a specific collection. If the bookmark is already in the collection it gets removed; otherwise it gets added.

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**

```json
{ "collectionId": "uuid" }
```

**Response (200):**

```json
{ "success": true, "message": "Bookmark saved to collection", "data": { "saved": true } }
```

---

## Bookmark Collections

### GET /api/bookmarks/:id/collections

Get user's collections with a `isSaved` flag for whether the bookmark is in each collection. Used for the save-to-collection modal.

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Design Inspiration",
      "description": "Collection of design links",
      "isPublic": true,
      "_count": { "bookmarks": 12 },
      "isSaved": true
    },
    {
      "id": "uuid",
      "name": "Dev Resources",
      "description": null,
      "isPublic": false,
      "_count": { "bookmarks": 5 },
      "isSaved": false
    }
  ]
}
```

---

## Authentication

All protected routes require:

```
Authorization: Bearer <accessToken>
```

Access tokens expire in 15 minutes. Use refresh token to get new ones via `POST /api/auth/refresh`.
