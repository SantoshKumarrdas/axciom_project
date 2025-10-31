import { create } from 'zustand'

export type Role = 'ADMIN' | 'VENDOR' | 'USER'

export interface AuthState {
    isAuthenticated: boolean
    role: Role | null
    user: { id: string; name: string; email: string } | null
    token: string | null
    login: (payload: { role: Role; email: string; name?: string; token?: string }) => void
    logout: () => void
    hydrate: () => void
}

const storageKey = 'axciom_auth'

export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    role: null,
    user: null,
    token: null,
    login: ({ role, email, name, token }) => {
        const user = { id: crypto.randomUUID(), name: name ?? 'User', email }
        set({ isAuthenticated: true, role, user, token: token ?? null })
        localStorage.setItem(storageKey, JSON.stringify({ isAuthenticated: true, role, user, token }))
    },
    logout: () => {
        set({ isAuthenticated: false, role: null, user: null, token: null })
        localStorage.removeItem(storageKey)
    },
    hydrate: () => {
        const raw = localStorage.getItem(storageKey)
        if (!raw) return
        try {
            const data = JSON.parse(raw)
            set(data)
        } catch {
            /* noop */
        }
    },
}))


