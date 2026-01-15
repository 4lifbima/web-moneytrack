import jwt from 'jsonwebtoken'
import prisma from '../../utils/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'dompetin-secret-key-2024'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')

    if (!token) {
        throw createError({
            statusCode: 401,
            message: 'Not authenticated',
        })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        })

        if (!user) {
            throw createError({
                statusCode: 401,
                message: 'User not found',
            })
        }

        return { user }
    } catch (error) {
        throw createError({
            statusCode: 401,
            message: 'Invalid or expired token',
        })
    }
})
