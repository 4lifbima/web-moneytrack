import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../utils/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'dompetin-secret-key-2024'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Validate required fields
    if (!body.name || !body.email || !body.password) {
        throw createError({
            statusCode: 400,
            message: 'Name, email, and password are required',
        })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid email format',
        })
    }

    // Validate password length
    if (body.password.length < 6) {
        throw createError({
            statusCode: 400,
            message: 'Password must be at least 6 characters',
        })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: body.email },
    })

    if (existingUser) {
        throw createError({
            statusCode: 400,
            message: 'Email already registered',
        })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10)

    // Create user
    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: hashedPassword,
        },
    })

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
        message: 'Registration successful',
    }
})
