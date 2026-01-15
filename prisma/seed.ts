import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clear existing categories
    await prisma.category.deleteMany()

    // Income categories
    const incomeCategories = [
        { name: 'Salary', icon: 'ph-money', type: 'income' },
        { name: 'Freelance', icon: 'ph-laptop', type: 'income' },
        { name: 'Investment', icon: 'ph-chart-line-up', type: 'income' },
        { name: 'Gift', icon: 'ph-gift', type: 'income' },
        { name: 'Other', icon: 'ph-dots-three-circle', type: 'income' },
    ]

    // Expense categories
    const expenseCategories = [
        { name: 'Food', icon: 'ph-hamburger', type: 'expense' },
        { name: 'Transport', icon: 'ph-car', type: 'expense' },
        { name: 'Shopping', icon: 'ph-shopping-bag', type: 'expense' },
        { name: 'Bills', icon: 'ph-receipt', type: 'expense' },
        { name: 'Entertainment', icon: 'ph-game-controller', type: 'expense' },
        { name: 'Health', icon: 'ph-first-aid-kit', type: 'expense' },
        { name: 'Education', icon: 'ph-graduation-cap', type: 'expense' },
        { name: 'Other', icon: 'ph-dots-three-circle', type: 'expense' },
    ]

    // Insert all categories
    for (const category of [...incomeCategories, ...expenseCategories]) {
        await prisma.category.create({ data: category })
    }

    console.log('✅ Database seeded successfully!')
    console.log(`   Created ${incomeCategories.length} income categories`)
    console.log(`   Created ${expenseCategories.length} expense categories`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
