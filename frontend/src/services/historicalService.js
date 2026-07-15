export default async function HistoricalService(method, body) {

    const HISTORICAL_API = 'http://localhost:8000/api/historicals'

    const token = localStorage.getItem('token')

    if (method === 'GET') {
        try {
            const response = await fetch(HISTORICAL_API, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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