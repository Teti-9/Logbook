import React, { useEffect } from 'react'
import registerUser from '../services/registerService.js'

const RegisterPage = (props) => {
    const { email, password, setEmail, setPassword, setPage } = props

    useEffect(() => {
        setEmail('')
        setPassword('')
    }, [setEmail, setPassword])

    async function register(e) {

        e.preventDefault()

        const data = {
            email: email,
            password: password
        }

        const response = await registerUser(data)

        if (response.success) {
            setEmail('')
            setPassword('')
            setPage(2)
            alert('User successfully created.')
        } else {
            alert(response.message)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="text-3xl font-black uppercase tracking-widest text-slate-900 mb-6">Logbook</div>
                <h2 className="text-center text-3xl font-extrabold text-slate-900">
                    Join the crew
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600 font-medium">
                    Ditch the pen and paper forever.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
                    <form className="space-y-6" onSubmit={register}>

                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-medium transition"
                                    placeholder="lifter@example.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-medium transition"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600 font-medium">
                            Already have an account?{' '}
                            <a onClick={() => setPage(2)} className="font-bold text-indigo-600 hover:text-indigo-500 transition cursor-pointer text-indigo-600">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
