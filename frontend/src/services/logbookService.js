export default async function logbookService(method, body) {

    const LOGBOOK_API = 'http://localhost:8000/api/logbooks'
    const LOGBOOK_API_DELETE = `http://localhost:8000/api/logbooks/${body}`

    const token = localStorage.getItem('token')

    if (method === 'GET') {
        try {
            const response = await fetch(LOGBOOK_API, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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

    if (method === 'DELETE') {
        try {
            const response = await fetch(LOGBOOK_API_DELETE, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
