import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const auth = requireAuth(event)

    const transactions = await prisma.transaction.findMany({
        where: { userId: auth.userId },
        orderBy: { createdAt: 'desc' },
    })

    return transactions
})
