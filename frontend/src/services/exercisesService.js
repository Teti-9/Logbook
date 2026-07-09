export default async function ExercisesService(method, body) {

    const EXERCISES_API = 'http://localhost:8000/api/exercises'

    const token = localStorage.getItem('token')

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