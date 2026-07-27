import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getAccessToken, setSessionToken, clearSessionToken, logoutSession, refreshSession } from '../services/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(getAccessToken())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let ignore = false

        async function init() {
            const refreshedToken = await refreshSession()

            if (ignore) return

            if (refreshedToken) setToken(refreshedToken)
            setLoading(false)
        }
        init()

        return () => { ignore = true }
    }, [])

    const login = useCallback((accessToken) => {
        setSessionToken(accessToken)
        setToken(getAccessToken())
    }, [])

    const logout = useCallback(async () => {
        await logoutSession()
        setToken(getAccessToken())
    }, [])

    const clearAuth = useCallback(() => {
        clearSessionToken()
        setToken(getAccessToken())
    }, [])

    return (
        <AuthContext.Provider value={{ token, isAuthenticated: !!token, loading, login, logout, clearAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}