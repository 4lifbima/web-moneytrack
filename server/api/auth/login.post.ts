import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../utils/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'dompetin-secret-key-2024'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Validate required fields
    if (!body.email || !body.password) {
        throw createError({
            statusCode: 400,
            message: 'Email and password are required',
        })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email: body.email },
    })

    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Invalid email or password',
        })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(body.password, user.password)

    if (!isValidPassword) {
        throw createError({
            statusCode: 401,
            message: 'Invalid email or password',
        })
    }

    // Generate JWT token
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
    )

    // Set cookie
    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    })

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        message: 'Login successful',
    }
})
