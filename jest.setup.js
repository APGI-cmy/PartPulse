// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Ensure DATABASE_URL is set for all tests
// This must match the database created in globalSetup
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./.ci-test-db.sqlite'
}

