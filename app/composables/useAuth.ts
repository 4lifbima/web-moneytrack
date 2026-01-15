interface User {
    id: number
    name: string
    email: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    isFetched: boolean
}

const authState = reactive<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isFetched: false,
})

export const useAuth = () => {
    const fetchUser = async () => {
        // Skip if already fetched in this session
        if (authState.isFetched && authState.isAuthenticated) {
            return
        }

        authState.isLoading = true
        try {
            const response = await $fetch<{ user: User }>('/api/auth/me')
            authState.user = response.user
            authState.isAuthenticated = true
        } catch {
            authState.user = null
            authState.isAuthenticated = false
        } finally {
            authState.isLoading = false
            authState.isFetched = true
        }
    }

    const login = async (email: string, password: string) => {
        const response = await $fetch<{ user: User }>('/api/auth/login', {
            method: 'POST',
            body: { email, password },
        })
        authState.user = response.user
        authState.isAuthenticated = true
        authState.isFetched = true
        return response
    }

    const register = async (name: string, email: string, password: string) => {
        const response = await $fetch<{ user: User }>('/api/auth/register', {
            method: 'POST',
            body: { name, email, password },
        })
        authState.user = response.user
        authState.isAuthenticated = true
        authState.isFetched = true
        return response
    }

    const logout = async () => {
        await $fetch('/api/auth/logout', { method: 'POST' })
        authState.user = null
        authState.isAuthenticated = false
        authState.isFetched = false
        navigateTo('/login')
    }

    const updateUser = (user: User) => {
        authState.user = user
    }

    return {
        user: computed(() => authState.user),
        isAuthenticated: computed(() => authState.isAuthenticated),
        isLoading: computed(() => authState.isLoading),
        fetchUser,
        login,
        register,
        logout,
        updateUser,
    }
}
