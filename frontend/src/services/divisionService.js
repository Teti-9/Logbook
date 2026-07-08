export default async function DivisionsService(method, body) {

    const DIVISION_API = 'http://localhost:8000/api/divisions'

    const token = localStorage.getItem('token')

    if (method === 'GET') {
        try {
            const response = await fetch(DIVISION_API, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            if (response.ok) {
                const payload = await response.json()
                return { sucess: true, data: payload.data }
            } else {
                const errorData = await response.json()
                let errorMessage = errorData.data

                return { sucess: false, message: errorMessage }
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    if (method === 'POST') {
        try {
            const response = await fetch(DIVISION_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body),
            })
            if (response.ok) {
                const data = await response.json()
                return { sucess: true, data: data }
            } else {
                const errorData = await response.json()
                let errorMessage = errorData.data

                return { sucess: false, message: errorMessage }
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

}
