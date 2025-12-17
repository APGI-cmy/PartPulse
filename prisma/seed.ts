/**
 * Prisma seed script
 * 
 * IMPORTANT:
 * - Requires DATABASE_URL to be present in process.env
 * - Loads .env explicitly (tsx does NOT auto-load it)
 * - Safe to run multiple times (uses upsert)
 */

import 'dotenv/config'              // 👈 CRITICAL: loads .env
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // -----------------------------
  // Admin user (default system admin)
  // -----------------------------
  const adminPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@partpulse.com' },
    update: {},
    create: {
      email: 'admin@partpulse.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  })

  // -----------------------------
  // Technician user
  // -----------------------------
  const techPassword = await bcrypt.hash('tech123', 10)

  const technician = await prisma.user.upsert({
    where: { email: 'tech@partpulse.com' },
    update: {},
    create: {
      email: 'tech@partpulse.com',
      name: 'Technician User',
      password: techPassword,
      role: 'technician',
    },
  })

  // -----------------------------
  // Johan Ras – Admin account (bootstrap / recovery)
  // -----------------------------
  // NOTE:
  // - Intended for dev/demo or controlled recovery
  // - Password MUST be changed after first login
  const johanPassword = await bcrypt.hash('TemporaryPassword123!@#', 10)

  const johan = await prisma.user.upsert({
    where: { email: 'johan.ras2@outlook.com' },
    update: {},
    create: {
      email: 'johan.ras2@outlook.com',
      name: 'Johan Ras',
      password: johanPassword,
      role: 'admin',
    },
  })

  console.log('✅ Seed completed successfully')
  console.log({
    admin: admin.email,
    technician: technician.email,
    johan: johan.email,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('❌ Seed failed:', error)
    await prisma.$disconnect()
    process.exit(1)
  })
