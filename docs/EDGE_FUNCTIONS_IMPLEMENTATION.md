# Edge Functions Implementation Guide

## Overview

This document describes the implementation of Akademy Edge Functions in the Zambia application, specifically in the agreements management module.

## What Was Implemented

### 1. Edge Functions Service (`AkademyEdgeFunctionsService`)

Updated the service in `libs/shared/data-access-generic/src/lib/akademy-edge-functions.service.ts` to:

- Correct function endpoints from `akademy` to `akademy-app` prefix
- Remove non-existent endpoints (getApiStatus, getHealth)
- Fix HTTP methods to use POST for all endpoints
- Return full `ApiResponse<T>` for better error handling
- Align response types with actual API responses

### 2. Agreements List Component

Enhanced `libs/zambia/feat-agreements/src/lib/components/smart/agreements-list.smart-component.ts` with:

#### Migration Button

- Added "Migrate from Strapi" button next to Export button
- Visible only to superadmin role using `HasRoleDirective`
- Calls `migrate()` edge function
- Shows success/error notifications with migration statistics

#### Table Actions

Added new actions to the enhanced table:

1. **Create User** (for pending/inactive agreements)

   - Visible to users with role level 30+
   - Creates a user from the agreement
   - Shows modal with generated password
   - Updates agreement status to active

2. **Deactivate User** (for active agreements with user_id)

   - Visible to users with role level 50+
   - Deactivates the associated user account
   - Updates agreement status to inactive

3. **Reset Password** (for active agreements with user_id)
   - Visible to all authenticated users (role level 1+)
   - Opens password reset form modal
   - Validates password strength
   - Requires matching confirmation

### 3. Modal Components

Created proper modal components for better UX:

#### User Creation Success Modal

- `user-creation-success-modal.component.ts`
- Displays user details and generated password
- Copy password functionality
- Security notice for password handling

#### Password Reset Modal

- `password-reset-modal.component.ts`
- Form validation with password requirements
- Password strength indicator
- Confirm password matching
- Loading state during submission

### 4. Type Definitions

Updated types in `akademy-edge-functions.types.ts` to match API responses:

- `UserCreationResponse` with success flag and user object
- `PasswordResetResponse` with success flag and message
- `DeactivateUserResponse` with success flag and message
- `MigrationResponse` with correct statistics structure

### 5. Translations

Added comprehensive translations in both English and Spanish:

- Edge function action labels
- Success/error messages
- Form field labels
- Modal titles and content

## Environment Variables

The edge functions use the existing Supabase configuration:

```typescript
// Local
API_URL=http://127.0.0.1:54321

// Production
API_URL=https://your-project.supabase.co
```

## Usage Examples

### Migration (Superadmin only)

```typescript
// Triggered by button click
await this.edgeFunctions.migrate();
```

### Create User (Role level 30+)

```typescript
// Triggered from table action on pending/inactive agreements
const response = await this.edgeFunctions.createUser({
  agreement_id: agreement.id,
});
```

### Deactivate User (Role level 50+)

```typescript
// Triggered from table action on active agreements
const response = await this.edgeFunctions.deactivateUser({
  user_id: agreement.userId,
});
```

### Reset Password (Role level 1+)

```typescript
// Opens modal, then on submit:
const response = await this.edgeFunctions.resetPassword({
  email: agreement.email,
  document_number: agreement.documentNumber,
  new_password: formData.newPassword,
  phone: agreement.phone,
  first_name: agreement.name,
  last_name: agreement.lastName,
});
```

## Security Considerations

1. **Role-based Access**: Each action respects minimum role levels
2. **JWT Authentication**: All requests include auth token automatically
3. **Password Security**: Generated passwords shown once with copy functionality
4. **Data Validation**: All inputs validated before API calls
5. **Error Handling**: Comprehensive error messages for debugging

## Testing the Implementation

1. **Migration**: Login as superadmin, click "Migrate from Strapi" button
2. **Create User**: Find a pending agreement, use table action "Create User"
3. **Deactivate User**: Find an active agreement, use table action "Deactivate User"
4. **Reset Password**: Find an active agreement, use table action "Reset Password"

## Future Improvements

1. Add confirmation dialogs for destructive actions
2. Implement batch operations for multiple agreements
3. Add audit logging for all edge function calls
4. Create dedicated pages for edge function management
5. Add role-based filtering for agreements list
