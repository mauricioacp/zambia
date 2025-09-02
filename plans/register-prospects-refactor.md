# Register Prospects Feature - Refactor Plan

## Overview

This document outlines the file structure and implementation plan for refactoring the register-prospects feature to follow modern Angular best practices, improve separation of concerns, and enhance maintainability.

## File Structure Plan

## first we create a route /register-prospect

## we are refactoring a feature from another project: /home/mcpo/developer/akademia-org/libs/academy/feat-auth/src/lib/ui-components/register-form/register-form.ui-component.ts you can also use /home/mcpo/developer/zambia/plans/.\_06222025_1750606294.txt

### 1. Feature Library Structure

```
libs/zambia/feat-register-prospects/
├── src/
│   ├── lib/
│   │   ├── register-page/
│   │   │   └── register-page.component.ts (Container Component)
│   │   ├── components/
│   │   │   ├── register-prospect-form/
│   │   │   │   ├── register-prospect-form.smart-component.ts (Presenter Component)
│   │   │   └── ui/
│   │   │       ├── personal-info-section/
│   │   │       │   └── personal-info-section.component.ts // name, lastname, gender, birhtDay,documentNumber
│   │   │       ├── contact-details-section/ // email , phone, address
│   │   │       │   └── contact-details-section.component.ts
│   │   │       ├── role-selector/ // role code
│   │   │       │   └── role-headquarter-selector.component.ts
|                ├── headquarter-selector/
                │   └── headquarter-selector.component.ts
│   │   │       └── agreements-section/ age-verification, mailing-agreement (optional), ethical_document_agreement , volunteering_agreement
│   │   │           └── agreements-section.component.ts
│   │   ├── services/
│   │   │   ├── register.state.service.ts (Signal-based State Service) // can inject headquarter, role, other facades... to obtain data.
│   │   │   ├── prospect-registration.service.ts // creates a prospect agreement.
│   │   │   └── prospect-pdf.service.ts // consumes necessary data to create agreement pdf by role.
│   │   ├── constants/
│   │   │   ├── agreement-text.constants.ts
```

### 3. Shared UI Components

```
libs/shared/ui-components/src/lib/
└── signature-pad/
    └── signature-pad.component.ts (Inline component)
```

## Key Files Description

### Container Component (`register-page.component.ts`)

- **Purpose**: Acts as the smart component that orchestrates the feature
- **Responsibilities**:
  - Provides RegisterStateService
  - Connects state to presenter component
  - Handles routing logic
- **Key Features**:
  - Uses signals for reactive state
  - Minimal template, delegates to presenter

### State Service (`register.state.service.ts`)

- **Purpose**: Manages all state and business logic for the registration feature
- **Responsibilities**:
  - Signal-based state management
  - Orchestrates the registration flow
  - Manages loading and error states
  - Coordinates between services
- **Key Features**:
  - Uses Angular signals instead of RxJS subjects
  - Provides computed signals for derived state
  - Handles all side effects (notifications, navigation)

### Presenter Component (`register-prospect-form.smart-component.ts`)

- **Purpose**: Pure presentation component for the registration form
- **Responsibilities**:
  - Display form UI
  - Handle user interactions
  - Emit events to parent
- **Key Features**:
  - No service dependencies
  - Uses input() and output() functions
  - OnPush change detection

### Sub-components (UI folder)

Break down the large form into manageable sections:

#### `personal-info-section.component.ts`

name, lastname, gender, birhtDay

#### `contact-details-section.component.ts`

- email
- Phone number with international selector
- Address field
- Country detection from phone

#### `role-selector.component.ts`

- Role selection (filtered to level ≤ 70)
- Dynamic options loading

#### `headquarter-selector.component.ts`

- should select country first then the headquarter
- Dynamic options loading

#### `agreements-section.component.ts`

- Volunteering agreement checkbox
- Ethical document agreement
- Age verification
- Mailing preferences

### Service Files

#### `prospect-registration.service.ts`

- **Purpose**: Handle API communication for prospect registration
- **Methods**:
  - `createProspectAgreement()`: Save prospect data
  - `getAvailableRoles()`: Fetch roles with level ≤ 70 we also have a ROLE CONSTANTS file in the project already
  - `validateProspectData()`: we only validate data client side

#### `prospect-pdf.service.ts`

- **Purpose**: Generate PDFs from prospect data
- **Methods**:
  - `generatePdf()`: Create PDF from template and data
  - `downloadPdf()`: Trigger browser download
  - Uses constants for static content

### Constants Files

#### `agreement-text.constants.ts`

- All static legal text for agreements
- Separated by agreement type (student/collaborator)
- Reduces PDF service complexity

### Type Definitions

#### `prospect-agreement.types.ts`

```typescript
export interface ProspectAgreement {
  // Personal info
  status = 'prospect'
  name: string;
  lastName: string;
  email: string;
  documentNumber: string;
  phone: string;
  address: string;

  // Selection
  headquarterId: string;
  roleId: string;
  seasonId: string //(default current season of the headquarter)
  // Agreements
  volunteeringAgreement: boolean;
  ethicalDocumentAgreement: boolean;
  ageVerification: boolean;
  mailingAgreement: boolean;

  // Signature
  signatureData: string; // this is base 64 btw

  // Metadata
  agreementType: 'student' | 'collaborator';
  createdAt?: Date;
}
```

#### `form.types.ts`

- Form-specific interfaces
- Validation types
- Form state types

#### `pdf-template.types.ts`

- PDF structure interfaces
- Template configuration types
- Layout constants

## Architecture Benefits

### Separation of Concerns

- **State Management**: Centralized in state service
- **Business Logic**: Isolated from UI components
- **Presentation**: Pure components with no side effects
- **Data**: Clear type definitions and constants

### Testability

- Components can be tested without mocking services
- State service can be tested independently
- PDF generation can be tested with mock data
- Form sections can be tested in isolation

### Maintainability

- Small, focused files
- Clear responsibility boundaries
- Consistent patterns throughout
- Easy to locate and update specific functionality

### Modern Angular Practices

- Signals for state management
- input()/output() functions
- OnPush change detection
- Standalone components
- Container/Presenter pattern

## Migration Strategy

1. **Phase 1**: Create new library structure
2. **Phase 2**: Implement types and constants
3. **Phase 3**: Build presenter components
4. **Phase 4**: Implement state service
5. **Phase 5**: Create container component
6. **Phase 6**: Refactor PDF service
7. **Phase 7**: Testing and validation
