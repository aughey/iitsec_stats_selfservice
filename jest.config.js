module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/app/$1',
    },
    testMatch: ['**/*.test.ts', '**/*.test.tsx'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}; 