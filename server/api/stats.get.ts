import prisma from '../utils/prisma'
import { requireAuth } from '../utils/auth'

interface Transaction {
    id: number
    amount: number
    type: string
    category: string
    note: string | null
    createdAt: Date
    userId: number
}

export default defineEventHandler(async (event) => {
    const auth = requireAuth(event)

    // Get current month's start and end dates
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

    // Get all transactions for current month
    const transactions: Transaction[] = await prisma.transaction.findMany({
        where: {
            userId: auth.userId,
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
        },
    })

    // Calculate totals
    const income = transactions
        .filter((t: Transaction) => t.type === 'income')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

    const expense = transactions
        .filter((t: Transaction) => t.type === 'expense')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

    const balance = income - expense

    // Get all-time totals for this user
    const allTransactions: Transaction[] = await prisma.transaction.findMany({
        where: { userId: auth.userId },
    })

    const totalIncome = allTransactions
        .filter((t: Transaction) => t.type === 'income')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

    const totalExpense = allTransactions
        .filter((t: Transaction) => t.type === 'expense')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

    const totalBalance = totalIncome - totalExpense

    // Get monthly breakdown for chart (last 6 months)
    const monthlyStats = []
    for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999)

        const monthTransactions = allTransactions.filter((t: Transaction) => {
            const date = new Date(t.createdAt)
            return date >= monthStart && date <= monthEnd
        })

        const monthIncome = monthTransactions
            .filter((t: Transaction) => t.type === 'income')
            .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

        const monthExpense = monthTransactions
            .filter((t: Transaction) => t.type === 'expense')
            .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

        monthlyStats.push({
            month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
            year: monthDate.getFullYear(),
            income: monthIncome,
            expense: monthExpense,
        })
    }

    return {
        currentMonth: {
            income,
            expense,
            balance,
            month: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        },
        total: {
            income: totalIncome,
            expense: totalExpense,
            balance: totalBalance,
        },
        monthlyStats,
    }
})
