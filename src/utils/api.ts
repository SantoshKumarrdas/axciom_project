import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

export function setAuthToken(token: string | null) {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    else delete api.defaults.headers.common['Authorization']
}

export async function simulateLatency<T>(value: T, ms = 400): Promise<T> {
    await new Promise(r => setTimeout(r, ms))
    return value
}

export async function addNewItem(item: unknown) {
    try {
        const res = await api.post('/items', item)
        return res.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function updateItem(id: string, patch: unknown) {
    try {
        const res = await api.put(`/items/${id}`, patch)
        return res.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function deleteItem(id: string) {
    try {
        const res = await api.delete(`/items/${id}`)
        return res.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function authLogin(payload: { email: string; password: string; role: 'ADMIN' | 'VENDOR' | 'USER' }) {
    const res = await api.post('/auth/login', payload)
    return res.data as { token: string; user: { id: string; email: string; name: string; role: 'ADMIN' | 'VENDOR' | 'USER' } }
}

export async function authSignup(payload: { name: string; email: string; password: string; role: 'ADMIN' | 'VENDOR' | 'USER' }) {
    const res = await api.post('/auth/signup', payload)
    return res.data as { token: string; user: { id: string; email: string; name: string; role: 'ADMIN' | 'VENDOR' | 'USER' } }
}


