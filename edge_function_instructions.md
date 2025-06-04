# Akademy-App Edge Function API Documentation

## Base URL

```
Local: http://localhost:54321/functions/v1/akademy-app
Production: https://your-project.supabase.co/functions/v1/akademy-app
```

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

## Endpoints

### 1. Migrate from Strapi

**URL:** `/akademy-app/migrate`  
**Method:** `POST`  
**Minimum Role Level:** 95 (general_director, superadmin)

**Request Body:** None required

**Response:**

```typescript
{
  success: boolean;
  statistics: {
    strapiAgreementsFetched: number;
    supabaseInserted: number;
    supabaseSkippedDuplicates: number;
    supabaseErrors: number;
  };
  data?: {
    inserted: any[];
    errors: any[];
  };
  error?: string;
}
```

**Middleware:**

- JWT token validation
- Role level check (requires level 95+)
- CORS enabled

---

### 2. Create User from Agreement

**URL:** `/akademy-app/create-user`  
**Method:** `POST`  
**Minimum Role Level:** 30 (manager_assistant and above)

**Request Body:**

```typescript
{
  agreement_id: string; // UUID of the prospect agreement
}
```

**Response:**

```typescript
{
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
    password: string; // Auto-generated password
    user_metadata: {
      agreement_id: string;
      role_level: number;
      first_name: string;
      last_name: string;
      document_number: string;
      phone: string;
    };
  };
  error?: string;
}
```

**Middleware:**

- JWT token validation
- Role level check (requires level 30+)
- Request body validation (Zod schema)
- CORS enabled

**Business Logic:**

- Only creates users from agreements with 'prospect' status
- Cannot create users with role level higher than your own
- Auto-generates secure passwords
- Updates agreement status to 'active' after user creation

---

### 3. Reset User Password

**URL:** `/akademy-app/reset-password`  
**Method:** `POST`  
**Minimum Role Level:** 1 (all authenticated users)

**Request Body:**

```typescript
{
  email: string;
  document_number: string;
  new_password: string;
  phone: string;
  first_name: string;
  last_name: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  message: string;
  error?: string;
}
```

**Middleware:**

- JWT token validation
- Role level check (requires level 1+)
- Request body validation (Zod schema)
- CORS enabled

**Business Logic:**

- Verifies user identity using multiple data points (email, document, phone, names)
- All provided fields must match the user's metadata
- Uses service role to update password

---

### 4. Deactivate User

**URL:** `/akademy-app/deactivate-user`  
**Method:** `POST`  
**Minimum Role Level:** 50 (headquarter_manager and above)

**Request Body:**

```typescript
{
  user_id: string; // UUID of the user to deactivate
}
```

**Response:**

```typescript
{
  success: boolean;
  message: string;
  error?: string;
}
```

**Middleware:**

- JWT token validation
- Role level check (requires level 50+)
- Request body validation (Zod schema)
- CORS enabled

**Business Logic:**

- Bans the user account for 100 years
- Updates associated agreement status to 'inactive'
- Cannot deactivate users with role level higher than your own

---

## Role Levels Reference

```typescript
const roleLevels = {
  superadmin: 100,
  general_director: 95,
  executive_leader: 90,
  pedagogical_leader: 90,
  communication_leader: 90,
  coordination_leader: 90,
  innovation_leader: 80,
  community_leader: 80,
  utopik_foundation_user: 80,
  coordinator: 80,
  legal_advisor: 80,
  konsejo_member: 80,
  headquarter_manager: 50,
  pedagogical_manager: 50,
  communication_manager: 50,
  companion_director: 50,
  manager_assistant: 30,
  companion: 20,
  facilitator: 20,
  student: 1,
};
```

## Example Usage with Supabase Client

```typescript
// Assuming you already have a Supabase client instance
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Get the current session
const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  throw new Error('User not authenticated');
}

// Example: Create a user from agreement
const response = await fetch(`${SUPABASE_URL}/functions/v1/akademy-app/create-user`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    agreement_id: 'your-agreement-uuid',
  }),
});

const result = await response.json();

if (!response.ok) {
  console.error('Error:', result.error || result.message);
} else {
  console.log('User created:', result.user);
  console.log('Generated password:', result.user.password);
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (invalid input)
- `401`: Unauthorized (missing or invalid JWT)
- `403`: Forbidden (insufficient role level)
- `404`: Resource not found
- `500`: Internal server error

Error responses include a descriptive message in the response body.

## CORS Configuration

All endpoints have CORS enabled with the following settings:

- Origin: `*` (all origins allowed)
- Methods: `GET, POST, OPTIONS`
- Headers: `Content-Type, Authorization`

## Important Notes

1. The JWT token must contain `role_level` in the `user_metadata` for role-based access control
2. All timestamps are handled in ISO 8601 format
3. UUIDs are used for all entity IDs
4. Password requirements should be enforced on the frontend before sending to the API
5. The auto-generated passwords from create-user should be securely communicated to the user
