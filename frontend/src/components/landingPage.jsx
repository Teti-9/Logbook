import React from 'react'

const LogbookLanding = (props) => {
    const { setPage } = props

    async function userLogged() {
        const token = localStorage.getItem('token')
        const refreshToken = localStorage.getItem('refreshToken')

        if (!token && !refreshToken) {
            setPage(2)
        } else {
            setPage(3)
        }
    }

    return (
        <div className="font-sans text-slate-900 bg-slate-50 min-h-screen">
            <nav className="flex justify-between items-center p-6 bg-white shadow-sm border-b border-slate-100">
                <div className="text-2xl font-black uppercase tracking-widest text-slate-900">Logbook</div>
                <ul className="hidden md:flex space-x-8 text-sm font-bold text-slate-500">
                    <li><a href="#features" className="hover:text-indigo-600 transition">Placeholder</a></li>
                    <li><a href="#routines" className="hover:text-indigo-600 transition">Placeholder</a></li>
                    <li><a href="#pricing" className="hover:text-indigo-600 transition">Placeholder</a></li>
                </ul>
                <button
                    onClick={() => userLogged()}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition font-bold shadow-md shadow-indigo-200 cursor-pointer text-indigo-600">
                    Start Tracking
                </button>
            </nav>

            <header className="flex flex-col items-center justify-center text-center py-24 md:py-32 px-4">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm border border-indigo-100">
                    Level up your training 🏋️‍♂️
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 max-w-4xl tracking-tight text-slate-900">
                    Your gains, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">perfectly tracked.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl font-medium">
                    Personal project by Teti.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button className="bg-slate-900 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-800 transition shadow-xl flex items-center justify-center">
                        Placeholder
                    </button>
                    <button className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition">
                        Placeholder
                    </button>
                </div>
            </header>

            <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:-translate-y-1 transition duration-300">
                        <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                            📝
                        </div>
                        <h3 className="text-xl font-extrabold mb-3 text-slate-900">Effortless Logging</h3>
                        <p className="text-slate-500 font-medium">Log sets, reps, and weights with an intuitive interface designed for sweaty, one-handed use at the gym.</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:-translate-y-1 transition duration-300">
                        <div className="h-14 w-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                            📈
                        </div>
                        <h3 className="text-xl font-extrabold mb-3 text-slate-900">Data-Driven Insights</h3>
                        <p className="text-slate-500 font-medium">Visualize your muscle recovery, volume progression, and personal records with beautiful, easy-to-read charts.</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:-translate-y-1 transition duration-300">
                        <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                            ⚙️
                        </div>
                        <h3 className="text-xl font-extrabold mb-3 text-slate-900">Custom Routines</h3>
                        <p className="text-slate-500 font-medium">Build your own programs from scratch or choose from popular strength templates like PPL, 5/3/1, or Upper/Lower.</p>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-white border-y border-slate-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-extrabold mb-12">Trusted by lifters worldwide</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-4xl font-black text-indigo-600 mb-2">2M+</div>
                            <div className="text-slate-500 font-bold text-sm uppercase tracking-wide">Workouts Logged</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-indigo-600 mb-2">50k</div>
                            <div className="text-slate-500 font-bold text-sm uppercase tracking-wide">Active Users</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-indigo-600 mb-2">4.9</div>
                            <div className="text-slate-500 font-bold text-sm uppercase tracking-wide">App Store Rating</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-indigo-600 mb-2">100%</div>
                            <div className="text-slate-500 font-bold text-sm uppercase tracking-wide">Gains Kept</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-slate-900 text-white py-24 px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to crush your goals?</h2>
                <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto font-medium">
                    Join thousands of lifters who are tracking their way to a stronger self with Logbook today.
                </p>
                <button className="bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/30">
                    Placeholder
                </button>
            </section>

            <footer className="bg-slate-950 text-slate-400 text-center py-12 px-6">
                <div className="text-2xl font-black uppercase tracking-widest text-white mb-4">Logbook</div>
                <p className="mb-6 font-medium">Built for the dedicated.</p>
                <p className="text-slate-600 text-sm font-medium">© 2026 Logbook. All rights reserved</p>
            </footer>
        </div>
    )
}

export default LogbookLanding
