import { authFetch } from './auth.js'

export default async function ExercisesService(method, body) {

    const EXERCISES_API = 'http://localhost:8000/api/exercises'
    const EXERCISES_API_ID = `http://localhost:8000/api/exercises/${body}`

    if (method === 'GET') {
        try {
            const response = await authFetch(EXERCISES_API, {
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

    if (method === 'GETid') {
        try {
            const response = await authFetch(EXERCISES_API_ID, {
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
            const response = await authFetch(EXERCISES_API, {
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

}
