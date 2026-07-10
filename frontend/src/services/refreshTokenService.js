export default async function refreshTokenService(body) {

    const REFRESH_API = 'http://localhost:8000/api/refreshs'

    try {
        const response = await fetch(REFRESH_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        if (response.ok) {
            const data = await response.json()
            return { success: true, data: data }
        } else {
            const errorData = await response.json()
            let errorMessage = errorData.data

            return { success: false, message: errorMessage }
        }
    } catch (error) {
        console.error('Error:', error)
    }

}