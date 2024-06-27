import { PrismaClient } from '@prisma/client'

export const createDb = ():PrismaClient => {
    console.log('Initialising Database')
    const db = new PrismaClient()
    return db
}
