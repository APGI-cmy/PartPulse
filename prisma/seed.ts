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

  console.log({ admin, technician })
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
