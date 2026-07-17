import { authFetch } from './auth.js'

export default async function logbookService(method, body) {

    const LOGBOOK_API = 'http://localhost:8000/api/logbooks'
    const LOGBOOK_API_DELETE = `http://localhost:8000/api/logbooks/${body}`

    if (method === 'GET') {
        try {
            const response = await authFetch(LOGBOOK_API, {
                method: 'GET',
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

    if (method === 'POST') {
        try {
            const response = await authFetch(LOGBOOK_API, {
                method: 'POST',
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

    if (method === 'DELETE') {
        try {
            const response = await authFetch(LOGBOOK_API_DELETE, {
                method: 'DELETE',
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

}
