import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const auth = requireAuth(event)
    const body = await readBody(event)

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

    // Validate amount is a positive number
    if (typeof body.amount !== 'number' || body.amount <= 0) {
        throw createError({
            statusCode: 400,
            message: 'Amount must be a positive number',
        })
    }

    const transaction = await prisma.transaction.create({
        data: {
            amount: body.amount,
            type: body.type,
            category: body.category,
            note: body.note || null,
            userId: auth.userId,
        },
    })

    return transaction
})
