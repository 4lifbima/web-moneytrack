export default defineNuxtRouteMiddleware(async (to) => {
    // Skip auth check for login and register pages
    if (to.path === '/login' || to.path === '/register') {
        return
    }

    const { fetchUser, isAuthenticated, isLoading } = useAuth()

    // Fetch user if not yet loaded
    if (isLoading.value) {
        await fetchUser()
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated.value) {
        return navigateTo('/login')
    }
})
