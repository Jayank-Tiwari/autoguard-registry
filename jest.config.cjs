const nextJest = require('next/jest')
const { execSync } = require('child_process')

// Generate Prisma client before running tests
try {
  execSync('npx prisma generate', { stdio: 'inherit' })
} catch (err) {
  console.warn('Prisma generate failed, continuing anyway...')
}

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx', '**/*.test.ts', '**/*.test.tsx'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'actions/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
