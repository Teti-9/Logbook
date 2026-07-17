const API_BASE = 'http://localhost:8000/api'
let refreshInFlight = null

function normalizeAccessToken(token) {
    if (!token) {
        return null
    }

    return token.startsWith('Bearer ') ? token.split(' ')[1] : token
}

export function getAccessToken() {
    return localStorage.getItem('token')
}

export function getRefreshToken() {
    return localStorage.getItem('refreshToken')
}

export function setSessionTokens({ accessToken, refreshToken }) {
    const normalizedAccessToken = normalizeAccessToken(accessToken)

    if (normalizedAccessToken) {
        localStorage.setItem('token', normalizedAccessToken)
    }

    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
    }
}

export function clearSessionTokens() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
}

async function refreshSession() {
    if (refreshInFlight) {
        return refreshInFlight
    }

    refreshInFlight = (async () => {
        const refreshToken = getRefreshToken()

        if (!refreshToken) {
            return null
        }

        const response = await fetch(`${API_BASE}/refreshs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        })

        if (!response.ok) {
            clearSessionTokens()
            return null
        }

        const payload = await response.json()
        const accessToken = payload?.data?.accessToken
        const newRefreshToken = payload?.data?.refreshToken

        if (!accessToken || !newRefreshToken) {
            clearSessionTokens()
            return null
        }

        setSessionTokens({ accessToken, refreshToken: newRefreshToken })

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
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
        clearSessionTokens()
        return { success: true }
    }

    try {
        await fetch(`${API_BASE}/logouts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        })
    } finally {
        clearSessionTokens()
    }

    return { success: true }
}
