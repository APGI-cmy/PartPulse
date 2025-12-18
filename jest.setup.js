// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util';

// Force NODE_ENV to 'test' for all tests
// This must happen before any module imports to ensure proper isolation
process.env.NODE_ENV = 'test';

// Polyfill for TextEncoder/TextDecoder (required by PDFKit)
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Ensure DATABASE_URL is set for all tests
// This must match the database created in globalSetup
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./.ci-test-db.sqlite'
}
