// Runs before every integration test file, before your app reads process.env.
process.env.DATABASE_URL = 'postgresql://app:app@localhost:5433/app_test';
process.env.DIRECT_URL = 'postgresql://app:app@localhost:5433/app_test';
process.env.JWT_SECRET = 'test-secret-key-12345';
process.env.PORT = '3001';
process.env.NODE_ENV = 'test';
