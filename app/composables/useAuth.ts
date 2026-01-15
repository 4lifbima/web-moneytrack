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

// Use useState for SSR compatibility
export const useAuth = () => {
    const authState = useState<AuthState>('auth', () => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
    }))

    const fetchUser = async () => {
        // Skip if already authenticated
        if (authState.value.isAuthenticated && authState.value.user) {
            return
        }

        authState.value.isLoading = true
        try {
            const response = await $fetch<{ user: User }>('/api/auth/me', {
                credentials: 'include',
            })
            authState.value.user = response.user
            authState.value.isAuthenticated = true
        } catch {
            authState.value.user = null
            authState.value.isAuthenticated = false
        } finally {
            authState.value.isLoading = false
        }
    }

    const login = async (email: string, password: string) => {
        const response = await $fetch<{ user: User }>('/api/auth/login', {
            method: 'POST',
            body: { email, password },
            credentials: 'include',
        })
        authState.value.user = response.user
        authState.value.isAuthenticated = true
        return response
    }

    const register = async (name: string, email: string, password: string) => {
        const response = await $fetch<{ user: User }>('/api/auth/register', {
            method: 'POST',
            body: { name, email, password },
            credentials: 'include',
        })
        authState.value.user = response.user
        authState.value.isAuthenticated = true
        return response
    }

    const logout = async () => {
        await $fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        })
        authState.value.user = null
        authState.value.isAuthenticated = false
        navigateTo('/login')
    }

    const updateUser = (user: User) => {
        authState.value.user = user
    }

    return {
        user: computed(() => authState.value.user),
        isAuthenticated: computed(() => authState.value.isAuthenticated),
        isLoading: computed(() => authState.value.isLoading),
        fetchUser,
        login,
        register,
        logout,
        updateUser,
    }
}
