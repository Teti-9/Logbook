import React, { useEffect } from 'react'
import HistoricalService from '../services/historicalService.js'
import capitalizeEachWord from '../utils/capitalize.js'
import Day from '../utils/day.js'

const HistoryPage = (props) => {
    const { historical, setHistorical, setPage } = props

    async function loadHistory() {
        const response = await HistoricalService('GET', '')

        if (response?.success) {
            setHistorical(response.data || [])
        }
    }

    useEffect(() => {
        loadHistory()
    }, [])

    async function getHistorys() {

        await loadHistory()
    }


    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">

            <header className="bg-white border-b border-slate-200 pt-12 pb-6 px-6 shadow-sm sticky top-0 z-10">
                <div className="max-w-2xl mx-auto flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight mb-1">Your Progress</h1>
                        <p className="text-slate-500 font-medium">Data doesn't lie.</p>
                    </div>
                    <a onClick={() => setPage(3)} className="font-bold cursor-pointer text-indigo-600" >
                        Dashboard
                    </a>
                </div>
            </header>

            <main className="p-6 max-w-2xl mx-auto space-y-8 mt-2">

                <section>
                    <h2 className="text-lg font-extrabold text-slate-900 mb-4 px-2">Workout Log</h2>
                    <div className="space-y-4">
                        {historical.length > 0 ? (
                            historical.map((ex, index) => (
                                <div key={ex.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer flex items-center justify-between group">

                                    <div className="flex items-center space-x-10">
                                        <div className="h-12 w-12 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition">
                                            <span className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">Updated</span>
                                            <span className="text-sm font-black text-slate-700 leading-none ">{Day(ex.exercise.updatedAt)}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition mb-0.5">
                                                {capitalizeEachWord(ex.name)}
                                            </h3>
                                            <div className="flex items-center text-xs font-medium text-slate-500 space-x-3">
                                                <span>Previous Top Set : {ex.previous_topset_weight} x {ex.previous_topset_reps}</span>
                                                <span>Updated Top Set : {ex.exercise.topset_weight} x {ex.exercise.topset_reps}</span>
                                            </div>
                                            <div className="flex items-center text-xs font-medium text-slate-500 space-x-3">
                                                <span>Previous Back-off Set : {ex.previous_backoff_weight || 0} x {ex.previous_backoff_reps || 0}</span>
                                                <span>Updated Back-off Set : {ex.exercise.backoff_weight || 0} x {ex.exercise.backoff_reps || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : null}
                    </div>
                </section>

            </main>
        </div>
    )
}

export default HistoryPage