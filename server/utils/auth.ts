import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

const JWT_SECRET = process.env.JWT_SECRET || 'dompetin-secret-key-2024'

export interface AuthUser {
    userId: number
    email: string
}

export const getAuthUser = (event: H3Event): AuthUser | null => {
    const token = getCookie(event, 'auth_token')

    if (!token) {
        return null
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
        return decoded
    } catch {
        return null
    }
}

export const requireAuth = (event: H3Event): AuthUser => {
    const user = getAuthUser(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Authentication required',
        })
    }

    return user
}
