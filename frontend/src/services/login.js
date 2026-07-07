export default async function loginUser(body) {

    const LOGIN_API = 'http://localhost:8000/api/logins'

    try {
        const response = await fetch(LOGIN_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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