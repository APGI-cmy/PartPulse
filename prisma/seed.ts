import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@partpulse.com' },
    update: {},
    create: {
      email: 'admin@partpulse.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  })

  // Create technician user
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

  // Create Johan's admin user account
  // NOTE: This is a development/demo seed. In production, remove this user or use environment variables
  // for passwords. The temporary password should be changed immediately after first login.
  // Using a temporary password that will be reset via password reset flow
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

  console.log({ admin, technician, johan })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
