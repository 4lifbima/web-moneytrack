import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const type = query.type as string | undefined

    const where = type ? { type } : {}

    const categories = await prisma.category.findMany({
        where,
        orderBy: { name: 'asc' },
    })

    return categories
})
