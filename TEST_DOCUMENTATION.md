# Test Suite Documentation

## Overview

This document describes the comprehensive test suite for the AutoGuard Registry Next.js 16 application.

## Setup Instructions

### 1. Install Testing Dependencies

```bash
npm install
```

This installs:

- `jest` - Testing framework
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - DOM matchers for Jest
- `@testing-library/user-event` - User interaction simulation
- `jest-environment-jsdom` - DOM environment for Jest
- `@types/jest` - TypeScript types for Jest

### 2. Run Tests

#### Run all tests once

```bash
npm test
```

#### Run tests in watch mode

```bash
npm test:watch
```

#### Run tests with coverage report

```bash
npm test:coverage
```

## Test Structure

### `//__tests__/actions/createVehicle.test.ts`

**Purpose:** Unit tests for the createVehicle server action

**Test Cases:**

1. ✅ Should create a vehicle with valid data
   - Tests vehicle creation with proper Prisma calls
   - Verifies emergency contacts are passed correctly

2. ✅ Should throw error if emergency contacts are less than 1
   - Validates minimum contact requirement

3. ✅ Should throw error if emergency contacts exceed 10
   - Validates maximum contact limit

4. ✅ Should handle multiple emergency contacts
   - Tests creating vehicle with 3 emergency contacts

**What's Mocked:**

- `@/lib/prisma` - PrismaClient

---

### `//__tests__/actions/updateVehicle.test.ts`

**Purpose:** Unit tests for the updateVehicle server action

**Test Cases:**

1. ✅ Should update a vehicle with valid data and matching contact number
   - Tests full update flow with verification

2. ✅ Should throw error if vehicle not found
   - Tests error handling for non-existent vehicle

3. ✅ Should throw error if contact number does not match
   - Tests verification validation

4. ✅ Should throw error if emergency contacts are less than 1
   - Validates minimum contact requirement

5. ✅ Should throw error if emergency contacts exceed 10
   - Validates maximum contact limit

**What's Mocked:**

- `@/lib/prisma` - PrismaClient

---

### `//__tests__/app/create.test.tsx`

**Purpose:** Integration tests for the Create Vehicle page

**Test Cases:**

1. ✅ Should render the create form
   - Verifies all form fields are present

2. ✅ Should have default emergency contact (Police - 112)
   - Tests default values

3. ✅ Should add a new emergency contact
   - Tests "Add Emergency Contact" button functionality

4. ✅ Should remove an emergency contact
   - Tests "Remove" button functionality

5. ✅ Should not allow more than 10 emergency contacts
   - Tests max limit enforcement

6. ✅ Should submit form with valid data
   - Tests complete form submission flow
   - Verifies correct data passed to server action
   - Tests navigation to vehicle view page

7. ✅ Should show error if emergency contact is invalid
   - Tests validation before submission

8. ✅ Should show error on submission failure
   - Tests error handling from server action

**What's Mocked:**

- `@/actions/createVehicle` - Server action
- `next/navigation` - Router

---

### `//__tests__/app/update.test.tsx`

**Purpose:** Integration tests for the Update Vehicle page

**Test Cases:**

1. ✅ Should render the update form
   - Verifies all form fields are present

2. ✅ Should have default emergency contact (Police - 112)
   - Tests default values

3. ✅ Should add a new emergency contact
   - Tests "Add Emergency Contact" button functionality

4. ✅ Should remove an emergency contact
   - Tests "Remove" button functionality

5. ✅ Should not allow more than 10 emergency contacts
   - Tests max limit enforcement

6. ✅ Should submit form with valid data
   - Tests complete form submission flow
   - Verifies correct data passed to server action
   - Tests success message display

7. ✅ Should show error if emergency contact is invalid
   - Tests validation before submission

8. ✅ Should show error on submission failure
   - Tests error handling from server action

9. ✅ Should clear success message when new error occurs
   - Tests message state management

**What's Mocked:**

- `@/actions/updateVehicle` - Server action

---

### `//__tests__/app/vehicle-view.test.tsx`

**Purpose:** Tests for the Vehicle View page (server component)

**Test Cases:**

1. ✅ Should display vehicle information when found
   - Tests vehicle data display
   - Tests emergency contacts display

2. ✅ Should show "Vehicle not available" when vehicle not found
   - Tests 404-like behavior

3. ✅ Should show "Vehicle not available" when vehicle is disabled
   - Tests disabled vehicle handling

4. ✅ Should display all emergency contacts
   - Tests multiple emergency contacts rendering

5. ✅ Should fetch vehicle with correct vehicleNumber
   - Verifies correct Prisma query

**What's Mocked:**

- `@/lib/prisma` - PrismaClient

---

### `//__tests__/lib/prisma.test.ts`

**Purpose:** Unit tests for Prisma singleton

**Test Cases:**

1. ✅ Should export a PrismaClient instance
   - Verifies correct instance type

2. ✅ Should be the same instance when imported multiple times in development
   - Tests singleton pattern

3. ✅ Should have the necessary methods
   - Verifies vehicle model and connection methods

---

## Test Coverage Goals

The test suite aims for:

- **Unit Tests:** Server actions (createVehicle, updateVehicle)
- **Integration Tests:** Client components (create page, update page)
- **E2E-like Tests:** Server component (vehicle view page)
- **Library Tests:** Prisma singleton

### Coverage by Feature

- ✅ Vehicle creation with emergency contacts
- ✅ Vehicle updates with verification
- ✅ Vehicle viewing with disabled state handling
- ✅ Emergency contact management (add/remove/limits)
- ✅ Form validation and error handling
- ✅ Success/error message display
- ✅ Navigation after creation

## Running Specific Test Suites

```bash
# Test only server actions
npm test -- actions

# Test only create page
npm test -- create.test

# Test only update page
npm test -- update.test

# Test only vehicle view
npm test -- vehicle-view.test

# Test with verbose output
npm test -- --verbose

# Run tests matching a pattern
npm test -- createVehicle
```

## Debugging Tests

```bash
# Run tests with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Run a single test file
npm test -- __tests__/actions/createVehicle.test.ts

# Run tests matching a specific describe block
npm test -- -t "createVehicle"
```

## Best Practices for Testing

### For Server Actions

- Mock Prisma to avoid database dependencies
- Test error handling and validation
- Verify correct Prisma API calls

### For Client Components

- Mock server actions to test UI logic
- Use `userEvent` for realistic user interactions
- Test form submission and error/success states

### For Server Components

- Mock Prisma calls
- Test different data scenarios
- Test conditional rendering

## CI/CD Integration

To integrate tests into your CI/CD pipeline:

```bash
# In your GitHub Actions / CI configuration
npm install
npm run test:coverage
```

The coverage report will be generated in the `coverage/` directory.

## Future Test Expansion

Consider adding:

1. **E2E Tests** with Playwright/Cypress
   - Full user workflows
   - Database integration

2. **Performance Tests**
   - Load testing
   - Performance benchmarks

3. **Accessibility Tests**
   - ARIA labels
   - Keyboard navigation

4. **Visual Regression Tests**
   - Screenshot comparisons
