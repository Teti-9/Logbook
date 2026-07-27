import { currentAccessToken, setAccessToken } from '../utils/token.js'

const API_BASE = 'http://localhost:8000/api/auth'
let refreshInFlight = null

function normalizeAccessToken(token) {
    if (!token) {
        return null
    }

    return token.startsWith('Bearer ') ? token.split(' ')[1] : token
}

export function getAccessToken() {
    return currentAccessToken()
}

export function setSessionToken(accessToken) {
    const normalizedAccessToken = normalizeAccessToken(accessToken)

    if (normalizedAccessToken) {
        setAccessToken(normalizedAccessToken)
    }
}

export function clearSessionToken() {
    setAccessToken('')
}

export async function refreshSession() {
    if (refreshInFlight) {
        return refreshInFlight
    }

    refreshInFlight = (async () => {
        const response = await fetch(`${API_BASE}/refreshs`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            clearSessionToken()
            return null
        }

        const payload = await response.json()
        const accessToken = payload?.data?.accessToken

        if (!accessToken) {
            clearSessionToken()
            return null
        }

        setSessionToken(accessToken)

        return getAccessToken()
    })()

    try {
        return await refreshInFlight
    } finally {
        refreshInFlight = null
    }
}

export async function authFetch(url, options = {}) {
    const token = getAccessToken()
    const baseHeaders = options.headers ?? {}

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...baseHeaders,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })

    if (response.status !== 401 && response.status !== 403) {
        return response
    }

    const refreshedToken = await refreshSession()

    if (!refreshedToken) {
        return response
    }

    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...baseHeaders,
            Authorization: `Bearer ${refreshedToken}`,
        },
    })
}

export async function logoutSession() {

    try {
        await fetch(`${API_BASE}/logouts`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } finally {
        clearSessionToken()
    }

    return { success: true }
}
