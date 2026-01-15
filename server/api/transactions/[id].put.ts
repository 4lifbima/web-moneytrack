import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const auth = requireAuth(event)
    const id = parseInt(event.context.params?.id || '')
    const body = await readBody(event)

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

    // Validate required fields
    if (!body.amount || !body.type || !body.category) {
        throw createError({
            statusCode: 400,
            message: 'Missing required fields: amount, type, category',
        })
    }

    // Validate type
    if (!['income', 'expense'].includes(body.type)) {
        throw createError({
            statusCode: 400,
            message: 'Type must be either "income" or "expense"',
        })
    }

    const updated = await prisma.transaction.update({
        where: { id },
        data: {
            amount: body.amount,
            type: body.type,
            category: body.category,
            note: body.note || null,
        },
    })

    return updated
})
