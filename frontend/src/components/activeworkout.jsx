import React from 'react'
import capitalizeEachWord from '../utils/capitalize.js'

const ActiveWorkout = (props) => {
    const { division, setDivision, setPage } = props
    const exercises = division?.exercises ?? []

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
                        <div key={exercise.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">

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

                            <div className="space-y-4">

                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Top Set</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Weight</label>
                                            <input
                                                type="number"
                                                placeholder='0'
                                                // value={exercise.topset_weight}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Reps</label>
                                            <input
                                                type="number"
                                                placeholder='0'
                                                // value={exercise.topset_reps}
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
                                                placeholder='0'
                                                // value={exercise.backoff_weight}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Reps</label>
                                            <input
                                                type="number"
                                                placeholder='0'
                                                // value={exercise.backoff_reps}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 text-slate-500 font-medium">
                        No exercises found for this workout.
                    </div>
                )}
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-12">
                <button
                    className="w-full max-w-2xl mx-auto flex justify-center items-center py-4 px-6 rounded-2xl shadow-xl shadow-indigo-200 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition transform"
                >
                    Finish & Sync Workout
                </button>
            </div>
        </div>
    )
}

export default ActiveWorkout
