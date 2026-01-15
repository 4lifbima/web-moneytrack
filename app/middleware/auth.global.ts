export default defineNuxtRouteMiddleware(async (to) => {
    // Skip auth check for login and register pages
    const publicPaths = ['/login', '/register']
    if (publicPaths.includes(to.path)) {
        return
    }

    const { fetchUser, isAuthenticated } = useAuth()

    // Always fetch user on page load to verify session
    await fetchUser()

    // Redirect to login if not authenticated
    if (!isAuthenticated.value) {
        return navigateTo('/login')
    }
})
