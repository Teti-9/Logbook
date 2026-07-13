import React, { useEffect } from 'react'
import ExercisesService from '../services/exercisesService.js'
import DivisionsService from '../services/divisionService.js'
import capitalizeEachWord from '../utils/capitalize.js'

const Dashboard = (props) => {
    const { division, divisions, setDivision, setDivisions, setPage } = props

    var today = []
    var nottoday = []
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const now = new Date()
    const dayName = days[now.getDay()]

    async function loadDivisions() {
        const response = await DivisionsService('GET', '')

        if (response?.success) {
            setDivisions(response.data || [])
        }

        if (response?.message === 'Expired token.' || response?.message === 'Invalid token.') {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            setPage(0)
        }
    }

    useEffect(() => {
        loadDivisions()
    }, [])

    async function getDivisions(e) {
        e.preventDefault()

        await loadDivisions()
    }

    const dayDivisions = divisions.map(item => ({
        id: item.id,
        name: item.name,
        day: item.day,
        exercises: item.exercises
    }))

    dayDivisions.forEach(item => {
        if (capitalizeEachWord(item.day) === dayName) {
            today.push({
                id: item.id,
                name: item.name,
                day: item.day,
                exercises: item.exercises,
            })
        }

        if (capitalizeEachWord(item.day) !== dayName) {
            nottoday.push({
                id: item.id,
                name: item.name,
                day: item.day,
                exercises: item.exercises,
            })
        }
    })


    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">

            <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-sm border-b border-slate-100">
                <div className="text-xl font-black uppercase tracking-widest text-slate-900">Logbook</div>
                <div
                    onClick={() => {
                        setPage(0)
                    }}
                    className="h-10 w-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold border border-indigo-200 cursor-pointer text-indigo-600">
                    RC
                </div>
            </nav>

            <main className="p-6 max-w-4xl mx-auto space-y-10 mt-4">

                <div>
                    <h1 className="text-3xl font-extrabold mb-1">Let's get to work.</h1>
                </div>

                {today.length > 0 && (
                    <section>
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Up Next Today</h2>
                        </div>

                        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="text-indigo-400 font-bold text-sm mb-2 uppercase tracking-wide">{capitalizeEachWord(today[0].day)}</div>
                                <h3 className="text-3xl font-black text-white mb-2">{capitalizeEachWord(today[0].name)}</h3>
                                <p className="text-slate-400 font-medium mb-8">
                                    • {today[0].exercises.length} Exercises
                                </p>
                                <button
                                    onClick={() => {
                                        setDivision({
                                            name: today[0].name,
                                            day: today[0].day,
                                            exercises: today[0].exercises,
                                        })
                                        setPage(5)
                                    }}
                                    className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2 cursor-pointer text-indigo-600">
                                    <span>Check Workout</span>
                                    <span className="text-xl">→</span>
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {today.length === 0 && (
                    <section>
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Up Next Today</h2>
                        </div>

                        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="text-indigo-400 font-bold text-sm mb-2 uppercase tracking-wide">{dayName}</div>
                                <h3 className="text-3xl font-black text-white mb-2">{'Rest Day'}</h3>
                                <p className="text-slate-400 font-medium mb-8">
                                    • {'0'} Exercises
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                <section>
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-xl font-extrabold text-slate-900">Your Split</h2>
                        <button
                            onClick={() => setPage(4)}
                            className="text-indigo-600 font-bold text-sm hover:text-indigo-500 transition cursor-pointer text-indigo-600">
                            + Add Data
                        </button>
                        <button
                            onClick={() => setPage(6)}
                            className="text-indigo-600 font-bold text-sm hover:text-indigo-500 transition cursor-pointer text-indigo-600">
                            + Sync Logbooks
                        </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        {nottoday.map((division, index) => (
                            <div key={division.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">{division.day}</div>
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition">
                                            {capitalizeEachWord(division.name)}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setDivision({
                                                name: division.name,
                                                day: division.day,
                                                exercises: division.exercises,
                                            })
                                            setPage(5)
                                        }}
                                        className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-lg cursor-pointer text-indigo-600">
                                        ⚙️
                                    </button>
                                </div>
                                <p className="text-slate-400 font-medium mb-8">
                                    • {division.exercises.length} Exercises
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    )
}

export default Dashboard
