# Agreements Visibility Fix Summary

## Issues Fixed

### 1. **Increased Data Fetching**

- Changed default page size from 10 to 100 records in the facade service
- Added page size options [10, 25, 50, 100] to the table
- Set default table display to 25 records

### 2. **Fixed Actions Column**

- Added 'actions' column to the table columns array
- The enhanced table component now properly displays action buttons

### 3. **Fixed Role-Based Visibility**

- Corrected the migrate button to use `ROLE.SUPERADMIN` constant
- Fixed the HasRoleDirective usage with proper role codes
- Updated visibility logic for edge function actions:
  - Create User: Role level 30+ for pending/inactive agreements without users
  - Deactivate User: Role level 50+ for active agreements with users
  - Reset Password: Role level 1+ for active agreements with users

### 4. **Status Mapping**

- Added 'prospect' status mapping to 'pending' for UI consistency
- This ensures agreements with 'prospect' status show appropriate actions

### 5. **Debug Logging Added**

- Console logs for user role information on component init
- Logs for fetched agreements count and total
- Logs for available actions per agreement

## How to Verify

1. **Check Console Logs**:

   - Look for "Current user role: superadmin"
   - Look for "Current role level: 100"
   - Look for "Fetched agreements: X total: Y"

2. **Check UI**:

   - Migrate button should be visible next to Export button (superadmin only)
   - Actions column should show appropriate buttons based on agreement status
   - Table should show up to 25 records by default

3. **Test Actions**:
   - For pending/inactive agreements: "Create User" button
   - For active agreements with users: "Deactivate User" and "Reset Password" buttons
   - All agreements: "View" button

## Database Considerations

The `get_agreements_with_role_paginated` RPC function doesn't filter by role/HQ by default. It only filters if parameters are explicitly passed. Make sure:

1. The frontend is not passing unwanted filter parameters
2. The user has proper RLS policies to see all agreements if needed

## Next Steps

If you still can't see all agreements:

1. Check browser Network tab to see what parameters are being sent to the RPC
2. Verify RLS policies in Supabase allow superadmin to see all records
3. Check if there are any headquarters or season filters being applied
4. Verify the total count returned by the RPC matches expected records
