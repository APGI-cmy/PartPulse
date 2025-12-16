// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Set up in-memory SQLite database for CI tests
// This ensures tests can run without requiring a production DATABASE_URL
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file::memory:?cache=shared'
}
