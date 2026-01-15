import bcrypt from 'bcryptjs'
import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const auth = requireAuth(event)
    const body = await readBody(event)

    const updateData: { name?: string; password?: string } = {}

    // Update name if provided
    if (body.name && body.name.trim()) {
        updateData.name = body.name.trim()
    }

    // Update password if provided
    if (body.newPassword && body.newPassword.length >= 6) {
        // If changing password, verify current password
        if (!body.currentPassword) {
            throw createError({
                statusCode: 400,
                message: 'Current password is required to change password',
            })
        }

        const user = await prisma.user.findUnique({
            where: { id: auth.userId },
        })

        if (!user) {
            throw createError({
                statusCode: 404,
                message: 'User not found',
            })
        }

        const isValidPassword = await bcrypt.compare(body.currentPassword, user.password)
        if (!isValidPassword) {
            throw createError({
                statusCode: 400,
                message: 'Current password is incorrect',
            })
        }

        updateData.password = await bcrypt.hash(body.newPassword, 10)
    }

    if (Object.keys(updateData).length === 0) {
        throw createError({
            statusCode: 400,
            message: 'No valid fields to update',
        })
    }

    const updatedUser = await prisma.user.update({
        where: { id: auth.userId },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
        },
    })

    return {
        user: updatedUser,
        message: 'Profile updated successfully',
    }
})
