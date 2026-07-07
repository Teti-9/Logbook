import React from 'react'
import createDivision from '../services/division.js'

const DivisionBuilder = (props) => {
    const { division, setDivision } = props

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    async function Create(e) {

        e.preventDefault()

        const data = {
            name: division.name,
            day: division.day
        }

        const response = await createDivision(data)

        if (response?.sucess) {
            alert('Training split successfully created.')
        } else {
            alert(response?.message)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-32 font-sans text-slate-900">

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
                                value={division.day || 'Monday'}
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

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-12 z-20">
                <button
                    onClick={Create}
                    className="w-full max-w-2xl mx-auto flex justify-center items-center py-4 px-6 rounded-2xl shadow-xl shadow-indigo-200 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition transform"
                >
                    Save Division
                </button>
            </div>

        </div>
    )
}

export default DivisionBuilder
