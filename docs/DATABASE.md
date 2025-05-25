# Database Schema

The application uses Supabase as its backend with the following main entities:

## Core Entities

### 1. agreements

Stores participant agreements with personal info

- Links to headquarters, roles, and seasons
- Tracks various agreement statuses and permissions

### 2. headquarters

Regional/local centers of the organization

- Connected to countries
- Contains address and contact information

### 3. roles

Defines user roles and permissions

- Includes code, name, description, and permission levels
- Contains JSON permissions field for access control

### 4. seasons

Program cycles or academic periods

- Connected to headquarters
- Has start and end dates

### 5. collaborators

Staff members with specific roles

- Connected to headquarters and roles
- Tracks status (active, inactive, standby)

### 6. students

Program participants

- Connected to headquarters and seasons
- Tracks enrollment status and progress

### 7. workshops

Educational sessions

- Connected to facilitators, headquarters, and seasons
- Has scheduling information and attendance tracking

## Key Relationships

- Headquarters belong to countries
- Seasons operate within headquarters
- Agreements are linked to specific roles and headquarters
- Collaborators are assigned to headquarters with specific roles
- Students are associated with headquarters and seasons
- Workshops are led by facilitator collaborators at headquarters

## Role-Based Access Control

The application uses a sophisticated role-based access control system with hierarchical roles, each with specific permission levels (numbers in comments indicate hierarchy level):

- **Administration (100)**: Superadmin
- **Top Management (90)**: General Director, Executive Leader
- **Leadership Team (80)**: Various leader roles (Pedagogical, Innovation, Communication, Community, Coordination, Legal Advisor)
- **Coordination Team (70)**: Coordinator, Konsejo Member
- **Headquarters Management (50)**: Headquarter Manager
- **Local Management (40)**: Pedagogical Manager, Communication Manager, Companion Director
- **Assistants (30)**: Manager Assistant
- **Field Staff (20)**: Companion, Facilitator
- **Students (1)**: Student role

Roles are organized into groups that determine access to features and data throughout the application. The role system is implemented with guards and directives for UI elements.

## Database Operations

### Generating Types

```bash
# Generate TypeScript types from Supabase database
npm run supabase:gen:types:local
```

This command generates TypeScript type definitions from your Supabase database schema and saves them to `libs/shared/types-supabase/src/lib/types/supabase.type.ts`.
