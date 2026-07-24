export default async function loginUser(body) {

    const LOGIN_API = 'http://localhost:8000/api/auth/logins'

    try {
        const response = await fetch(LOGIN_API, {
            method: 'POST',
            credentials: 'include',
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
