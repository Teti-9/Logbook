import React from 'react'
import capitalizeEachWord from '../utils/capitalize.js'
import logbookService from '../services/logbookService.js'
import ExercisesService from '../services/exercisesService.js'

const ActiveWorkout = (props) => {
    const { logbook, division, setLogbook, setDivision, setPage } = props
    const exercises = division?.exercises ?? []

    const handleLogChange = (exerciseId, field, value) => {
        setLogbook((current) => ({
            ...current,
            [exerciseId]: {
                ...current[exerciseId],
                [field]: value
            }
        }))
    }

    async function createLogbook(e, id) {

        e.preventDefault()

        try {
            const data = {
                exerciseId: Number(id),
                topset_weight: Number(logbook[id].topset_weight),
                topset_reps: Number(logbook[id].topset_reps),
                backoff_weight: Number(logbook[id].backoff_weight),
                backoff_reps: Number(logbook[id].backoff_reps)
            }

            const response = await logbookService('POST', data)

            if (response?.success) {
                setLogbook((current) => {
                    const updated = { ...current }
                    delete updated[id]
                    return updated
                })
                alert('Logbook successfully created.')
            } else {
                setLogbook((current) => {
                    const updated = { ...current }
                    delete updated[id]
                    return updated
                })
                alert(response?.message)
            }

        } catch (error) {
            if (error.message.startsWith('Cannot read properties of undefined')) {
                alert('Not all fields are filled, try again.')
            }
        }
    }

    async function deleteExercise(e, id) {

        e.preventDefault()

        const confirmed = window.confirm("Are you sure you want to delete this exercise?")

        if (confirmed) {
            const response = await ExercisesService('DELETE', Number(id))

            if (response?.success) {
                setDivision((current) => ({
                    ...current,
                    exercises: current.exercises.filter((ex) => ex.id !== id)
                }))
                alert('Exercise successfully deleted.')
            } else {
                alert(response?.message)
            }
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans">
            <header className="bg-slate-900 text-white pt-12 pb-6 px-6 sticky top-0 z-10 shadow-md">
                <div className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-1">
                    {division?.day ?? 'No day selected'}
                </div>
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-black tracking-tight">{capitalizeEachWord(division?.name) ?? 'Active Workout'} Day</h1>
                    <div className="mt-6 text-center">
                        <a onClick={() => setPage(3)} className="uppercase bg-slate-900 font-bold text-white pt-12 pb-6 px-6 sticky top-0 z-10 shadow-md cursor-pointer text-indigo-600" >
                            Dashboard
                        </a>
                    </div>
                </div>
            </header>

            <main className="p-4 space-y-6 max-w-2xl mx-auto mt-4">
                {exercises.length > 0 ? (
                    exercises.map((exercise, index) => (
                        <div key={exercise.id} className="relative bg-white rounded-3xl p-5 shadow-sm border border-slate-100">

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900 mb-1">
                                        {index + 1}. {capitalizeEachWord(exercise.name)}
                                    </h2>
                                    <p className="text-sm font-medium text-slate-500">
                                        Series: {exercise.series}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={(e) => deleteExercise(e, exercise.id)}
                                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition cursor-pointer"
                                title="Discard Exercise"
                            >
                                ✕
                            </button>

                            <div className="space-y-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Top Set</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Weight</label>
                                            <input
                                                type="number"
                                                placeholder={exercise.topset_weight}
                                                value={logbook[exercise.id]?.topset_weight ?? ''}
                                                onChange={(e) => handleLogChange(exercise.id, 'topset_weight', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Reps</label>
                                            <input
                                                type="number"
                                                placeholder={exercise.topset_reps}
                                                value={logbook[exercise.id]?.topset_reps ?? ''}
                                                onChange={(e) => handleLogChange(exercise.id, 'topset_reps', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50">
                                    <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">Back-off Set</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Weight</label>
                                            <input
                                                type="number"
                                                placeholder={exercise.backoff_weight ?? '0'}
                                                value={logbook[exercise.id]?.backoff_weight ?? ''}
                                                onChange={(e) => handleLogChange(exercise.id, 'backoff_weight', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Reps</label>
                                            <input
                                                type="number"
                                                placeholder={exercise.backoff_reps ?? '0'}
                                                value={logbook[exercise.id]?.backoff_reps ?? ''}
                                                onChange={(e) => handleLogChange(exercise.id, 'backoff_reps', e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <button
                                onClick={(e) => { createLogbook(e, exercise.id) }}
                                className="mt-6 w-full bg-indigo-50 text-indigo-700 font-extrabold py-4 px-6 rounded-xl hover:bg-indigo-100 transition active:scale-95 border border-indigo-100 cursor-pointer text-indigo-600"
                            >
                                Save {capitalizeEachWord(exercise.name)} Log
                            </button>

                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 text-slate-500 font-medium">
                        No exercises found for this workout.
                    </div>
                )}
            </main>
        </div>
    )
}

export default ActiveWorkout