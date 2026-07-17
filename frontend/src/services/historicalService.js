import { authFetch } from './auth.js'

export default async function HistoricalService(method) {

    const HISTORICAL_API = 'http://localhost:8000/api/historicals'

    if (method === 'GET') {
        try {
            const response = await authFetch(HISTORICAL_API, {
                method: 'GET',
            })
            if (response.ok) {
                const payload = await response.json()
                return { success: true, data: payload.data }
            } else {
                const errorData = await response.json()
                let errorMessage = errorData.data

                return { success: false, message: errorMessage }
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }
}
