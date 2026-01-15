interface User {
    id: number
    name: string
    email: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
}

const authState = reactive<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
})

export const useAuth = () => {
    const fetchUser = async () => {
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
        }
    }

    const login = async (email: string, password: string) => {
        const response = await $fetch<{ user: User }>('/api/auth/login', {
            method: 'POST',
            body: { email, password },
        })
        authState.user = response.user
        authState.isAuthenticated = true
        return response
    }

    const register = async (name: string, email: string, password: string) => {
        const response = await $fetch<{ user: User }>('/api/auth/register', {
            method: 'POST',
            body: { name, email, password },
        })
        authState.user = response.user
        authState.isAuthenticated = true
        return response
    }

    const logout = async () => {
        await $fetch('/api/auth/logout', { method: 'POST' })
        authState.user = null
        authState.isAuthenticated = false
        navigateTo('/login')
    }

    return {
        user: computed(() => authState.user),
        isAuthenticated: computed(() => authState.isAuthenticated),
        isLoading: computed(() => authState.isLoading),
        fetchUser,
        login,
        register,
        logout,
    }
}
