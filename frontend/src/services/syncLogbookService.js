export default async function syncLogbookService(body) {

    const LOGBOOK_API = 'http://localhost:8000/api/sinclogbooks'

    const token = localStorage.getItem('token')

    try {
        const response = await fetch(LOGBOOK_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
