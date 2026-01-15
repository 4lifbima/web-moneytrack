import prisma from '../utils/prisma'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
    const auth = requireAuth(event)

    // Get all transactions for this user
    const transactions = await prisma.transaction.findMany({
        where: { userId: auth.userId },
        orderBy: { createdAt: 'desc' },
    })

    // Create CSV content
    const headers = ['ID', 'Type', 'Category', 'Amount', 'Note', 'Date']
    const rows = transactions.map(t => [
        t.id,
        t.type,
        t.category,
        t.amount,
        t.note || '',
        new Date(t.createdAt).toISOString(),
    ])

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Set headers for CSV download
    setHeader(event, 'Content-Type', 'text/csv')
    setHeader(event, 'Content-Disposition', 'attachment; filename=dompetin-transactions.csv')

    return csvContent
})
