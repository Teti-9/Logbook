export default async function ExercisesService(method, body) {

    const EXERCISES_API = 'http://localhost:8000/api/exercises'
    const EXERCISES_API_ID = `http://localhost:8000/api/exercises/${body}`

    const token = localStorage.getItem('token')

    if (method === 'GET') {
        try {
            const response = await fetch(EXERCISES_API, {
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

    if (method === 'GETid') {
        try {
            const response = await fetch(EXERCISES_API_ID, {
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
            const response = await fetch(EXERCISES_API, {
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

}