import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const auth = requireAuth(event)
    const id = parseInt(event.context.params?.id || '')

    if (isNaN(id)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid transaction ID',
        })
    }

    const transaction = await prisma.transaction.findFirst({
        where: { id, userId: auth.userId },
    })

    if (!transaction) {
        throw createError({
            statusCode: 404,
            message: 'Transaction not found',
        })
    }

    return transaction
})
