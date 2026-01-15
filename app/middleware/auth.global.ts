export default defineNuxtRouteMiddleware(async (to) => {
    // Skip auth check for public pages
    const publicPaths = ['/login', '/register']
    if (publicPaths.includes(to.path)) {
        return
    }

    // Only run on client side to avoid hydration issues
    if (import.meta.server) {
        return
    }

    const { fetchUser, isAuthenticated } = useAuth()

    // Always fetch user to verify session
    await fetchUser()

    // Redirect to login if not authenticated
    if (!isAuthenticated.value) {
        return navigateTo('/login')
    }
})
