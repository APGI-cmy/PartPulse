#!/usr/bin/env tsx
/**
 * CLI script to manually create a user in the database
 * Usage: npx tsx scripts/create-user.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      rl.question(query, resolve)
    } catch (error) {
      reject(error)
    }
  })
}

async function main() {
  console.log('=== PartPulse User Creation Tool ===\n')
  
  // Get user details
  const email = await question('Email address: ')
  const name = await question('Full name: ')
  const roleInput = await question('Role (admin/technician) [technician]: ')
  const role = roleInput.toLowerCase() === 'admin' ? 'admin' : 'technician'
  const password = await question('Temporary password (min 16 chars): ')

  // Validate inputs
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    console.error('❌ Error: Invalid email address')
    rl.close()
    process.exit(1)
  }

  if (!name || name.trim().length === 0) {
    console.error('❌ Error: Name is required')
    rl.close()
    process.exit(1)
  }

  if (password.length < 16) {
    console.error('❌ Error: Password must be at least 16 characters')
    rl.close()
    process.exit(1)
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.log(`\n⚠️  User with email ${email} already exists`)
    const updateConfirm = await question('Do you want to update their password? (yes/no): ')
    
    if (updateConfirm.toLowerCase() === 'yes' || updateConfirm.toLowerCase() === 'y') {
      const hashedPassword = await bcrypt.hash(password, 10)
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      })
      
      console.log('\n✅ Password updated successfully!')
      console.log(`   Email: ${updatedUser.email}`)
      console.log(`   Name: ${updatedUser.name}`)
      console.log(`   Role: ${updatedUser.role}`)
    } else {
      console.log('\n❌ Operation cancelled')
    }
    rl.close()
    return
  }

  // Create user
  console.log('\nCreating user...')
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
    },
  })

  console.log('\n✅ User created successfully!')
  console.log(`   Email: ${user.email}`)
  console.log(`   Name: ${user.name}`)
  console.log(`   Role: ${user.role}`)
  console.log(`   ID: ${user.id}`)
  console.log('\nThe user can now:')
  console.log('1. Sign in with the provided password')
  console.log('2. Reset their password via the "Forgot Password" link')
  
  rl.close()
}

main()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (e) => {
    console.error('❌ Error:', e instanceof Error ? e.message : String(e))
    await prisma.$disconnect()
    rl.close()
    process.exit(1)
  })
