import React, { useEffect } from 'react'
import ExercisesService from '../services/exercisesService.js'
import DivisionsService from '../services/divisionService.js'
import capitalizeEachWord from '../utils/capitalize.js'

const DivisionBuilder = (props) => {
    const { division, exercises, divisions, setDivision, setDivisions, setExercises, setPage } = props

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    async function loadDivisions() {
        const response = await DivisionsService('GET', '')

        if (response?.success) {
            setDivisions(response.data.divisions || [])
        }
    }

    useEffect(() => {
        loadDivisions()
    }, [])

    async function getDivisions(e) {
        e.preventDefault()

        await loadDivisions()
    }

    async function createDivision(e) {

        e.preventDefault()

        const data = {
            name: division.name,
            day: division.day
        }

        if (!division.day) {
            data.day = 'Monday'
        }

        const response = await DivisionsService('POST', data)

        if (response?.success) {
            setDivision({ name: '', day: 'Monday' })
            await loadDivisions()
            alert('Training split successfully created.')
        } else {
            alert(response?.message)
        }
    }

    async function createExercise(e) {

        e.preventDefault()

        const data = {
            name: exercises.name,
            series: Number(exercises.series),
            topset_weight: Number(exercises.topset_weight),
            topset_reps: Number(exercises.topset_reps),
            backoff_weight: Number(exercises.backoff_weight),
            backoff_reps: Number(exercises.backoff_reps),
            divisionId: Number(exercises.divisionId)
        }

        const response = await ExercisesService('POST', data)

        if (response?.success) {
            setExercises({ name: '', series: '', topset_weight: '', topset_reps: '', backoff_weight: '', backoff_reps: '', divisionId: '' })
            alert('Exercise successfully created.')
        } else {
            alert(response?.message)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-32 font-sans text-slate-900">

            <nav className="flex justify-between items-center p-6 bg-white shadow-sm border-b border-slate-100">
                <div className="text-2xl font-black uppercase tracking-widest text-slate-900">Logbook</div>
                <button
                    onClick={() => setPage(3)}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition font-bold shadow-md shadow-indigo-200 cursor-pointer text-indigo-600">
                    Dashboard
                </button>
            </nav>

            <header className="bg-white border-b border-slate-200 pt-12 pb-8 px-6 shadow-sm sticky top-0 z-20">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-black tracking-tight mb-6">Build Routine</h1>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Division Name</label>
                            <input
                                type="text"
                                placeholder="e.g., Heavy Pull Day"
                                value={division.name || ''}
                                onChange={(e) => setDivision((current) => ({ ...current, name: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Day</label>
                            <select
                                value={division.day || ''}
                                onChange={(e) => setDivision((current) => ({ ...current, day: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none cursor-pointer"
                            >
                                {daysOfWeek.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-6 space-y-6 max-w-2xl mx-auto mt-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-extrabold text-slate-900">Exercises</h2>
                </div>

                <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 relative group transition-all hover:shadow-md">

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Exercise</label>
                        <input
                            type="text"
                            placeholder="e.g., Barbell Bench Press"
                            value={exercises.name}
                            onChange={(e) => setExercises((current) => ({ ...current, name: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Series</label>
                            <input
                                type="number"
                                placeholder="3"
                                value={exercises.series}
                                onChange={(e) => setExercises((current) => ({ ...current, series: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-center text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Top Set Weight</label>
                            <input
                                type="number"
                                placeholder="kg"
                                value={exercises.topset_weight}
                                onChange={(e) => setExercises((current) => ({ ...current, topset_weight: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-center text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Top Set Reps</label>
                            <input
                                type="number"
                                placeholder="kg"
                                value={exercises.topset_reps}
                                onChange={(e) => setExercises((current) => ({ ...current, topset_reps: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-center text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>
                        <div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Back-off Weight</label>
                            <input
                                type="number"
                                placeholder="kg"
                                value={exercises.backoff_weight}
                                onChange={(e) => setExercises((current) => ({ ...current, backoff_weight: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-center text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Back-off Reps</label>
                            <input
                                type="number"
                                placeholder="kg"
                                value={exercises.backoff_reps}
                                onChange={(e) => setExercises((current) => ({ ...current, backoff_reps: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-center text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black text-slate-900">Available Divisions</h3>
                        <button
                            onClick={getDivisions}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer text-indigo-600"
                        >
                            Refresh
                        </button>
                    </div>

                    {divisions.length > 0 ? (
                        <div className="grid gap-3">
                            {divisions.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setExercises((current) => ({ ...current, divisionId: String(item.id) }))}
                                    className={`w-full text-left rounded-2xl border px-4 py-3 transition ${Number(exercises.divisionId) === item.id
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="font-bold text-slate-900">{capitalizeEachWord(item.name)}</span>
                                        <span className="text-sm font-semibold text-slate-500">{capitalizeEachWord(item.day)}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500">Create a division first, then pick it for the exercise.</p>
                    )}
                </div>

                <button
                    onClick={createExercise}
                    className="w-full py-4 border-2 border-dashed border-slate-300 rounded-3xl text-slate-500 font-bold hover:bg-slate-100 hover:border-slate-400 hover:text-slate-700 transition flex items-center justify-center space-x-2"
                >
                    <span className="text-xl">+</span>
                    <span>Add Exercise</span>
                </button>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-12 z-20">
                <button
                    onClick={createDivision}
                    className="w-full max-w-2xl mx-auto flex justify-center items-center py-4 px-6 rounded-2xl shadow-xl shadow-indigo-200 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition transform"
                >
                    Save Division
                </button>
            </div>

        </div>
    )
}

export default DivisionBuilder
