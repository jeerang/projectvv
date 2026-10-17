const tsJest = {
  '^.+\\.ts$': [
    'ts-jest',
    { tsconfig: { module: 'commonjs', esModuleInterop: true, types: ['node', 'jest'] } },
  ],
};

/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: 'unit',
      testEnvironment: 'node',
      transform: tsJest,
      testMatch: ['<rootDir>/test/unit/**/*.test.[jt]s'],
    },
    {
      displayName: 'integration',
      testEnvironment: 'node',
      transform: tsJest,
      testMatch: ['<rootDir>/test/integration/**/*.test.[jt]s'],
      setupFiles: ['<rootDir>/test/integration/env.ts'],
    },
  ],
};
