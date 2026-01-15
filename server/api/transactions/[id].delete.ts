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

    // Check if transaction exists and belongs to user
    const existing = await prisma.transaction.findFirst({
        where: { id, userId: auth.userId },
    })

    if (!existing) {
        throw createError({
            statusCode: 404,
            message: 'Transaction not found',
        })
    }

    await prisma.transaction.delete({
        where: { id },
    })

    return { success: true, message: 'Transaction deleted' }
})
