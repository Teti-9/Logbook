import React, { useEffect, useState } from 'react'
import logbookService from '../services/logbookService.js'
import syncLogbookService from '../services/syncLogbookService.js'
import capitalizeEachWord from '../utils/capitalize.js'
import Day from '../utils/day.js'

const SyncCenter = (props) => {
    const { pendingLogs, setPendingLogs, syncState, setSyncState, setPage } = props

    async function loadLogbooks() {
        const response = await logbookService('GET', '')

        if (response?.success) {
            setPendingLogs(response.data.data || [])
        }
    }

    useEffect(() => {
        loadLogbooks()
    }, [])

    async function getLogbooks(e) {
        e.preventDefault()

        await loadLogbooks()
    }

    async function syncLogbook(e) {

        e.preventDefault()

        setSyncState('syncing')

        setTimeout(async () => {

            const data = {
                logbooks: pendingLogs.map(log => log.id)
            }

            const response = await syncLogbookService(data)

            if (response?.success) {
                setPendingLogs([])
                setSyncState('success')
            } else {
                alert(response?.message)
            }

            setTimeout(() => setSyncState('idle'), 3000)
        }, 2000)
    }

    async function deleteLogbook(e, id) {

        e.preventDefault()

        const confirmed = window.confirm("Are you sure you want to delete this logbook?")

        if (confirmed) {
            const response = await logbookService('DELETE', id)

            if (response?.success) {
                setPendingLogs(prev => prev.filter(log => log.id !== id))
                alert('Logbook successfully deleted.')
            } else {
                alert(response?.message)
            }
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-32 font-sans text-slate-900">

            <header className="bg-white border-b border-slate-200 pt-12 pb-6 px-6 shadow-sm sticky top-0 z-10">
                <div className="max-w-2xl mx-auto flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight mb-1">Sync Center</h1>
                        <p className="text-slate-500 font-medium">Manage your logs.</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center space-x-2 ${pendingLogs.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                        {pendingLogs.length > 0 && <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></span>}
                        <span>{pendingLogs.length} Pending</span>
                    </div>
                    <a onClick={() => setPage(3)} className="font-bold cursor-pointer text-indigo-600" >
                        Dashboard
                    </a>
                </div>
            </header>

            <main className="p-6 max-w-2xl mx-auto mt-2">

                {syncState === 'success' && (
                    <div className="bg-green-100 border border-green-200 text-green-800 p-6 rounded-3xl mb-8 flex flex-col items-center justify-center text-center animate-fade-in-down">
                        <div className="text-4xl mb-2">✅</div>
                        <h2 className="text-xl font-black">Sync Complete!</h2>
                        <p className="text-sm font-medium mt-1 text-green-700">All your hard work is safely backed up.</p>
                    </div>
                )}

                {pendingLogs.length === 0 && syncState === 'idle' && (
                    <div className="bg-white border border-slate-200 p-12 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm">
                        <div className="text-5xl opacity-50 mb-4">☁️</div>
                        <h2 className="text-xl font-black text-slate-400 mb-2">Everything is up to date</h2>
                        <p className="text-sm font-medium text-slate-400 max-w-xs">You have no pending workouts to sync. Go hit the gym!</p>
                    </div>
                )}

                {pendingLogs.length > 0 && syncState !== 'success' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-2 mb-2">
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ready to Upload</h2>
                        </div>

                        {pendingLogs.map((log) => (
                            <div key={log.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 relative group">

                                <button
                                    onClick={(e) => deleteLogbook(e, log.id)}
                                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition cursor-pointer text-indigo-600"
                                    title="Discard Log"
                                >
                                    ✕
                                </button>

                                <div className="mb-3 pr-8">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{Day(log.createdAt)}</span>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900">{capitalizeEachWord(log.exercise.name)}</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Top Set</div>
                                        <div className="font-bold text-slate-700">{log.topset_weight}kg × {log.topset_reps}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Back-off</div>
                                        <div className="font-bold text-slate-700">{log.backoff_weight}lbs × {log.backoff_reps}</div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </main>

            {pendingLogs.length > 0 && syncState !== 'success' && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-12 z-20">
                    <button
                        onClick={syncLogbook}
                        disabled={syncState === 'syncing'}
                        className={`w-full max-w-2xl mx-auto flex justify-center items-center py-4 px-6 rounded-2xl shadow-xl text-lg font-bold text-white transition transform cursor-pointer text-indigo-600 ${syncState === 'syncing'
                            ? 'bg-indigo-400 cursor-not-allowed shadow-indigo-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200'
                            }`}
                    >
                        {syncState === 'syncing' ? (
                            <span className="flex items-center space-x-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Syncing Data...</span>
                            </span>
                        ) : (
                            <span>Sync {pendingLogs.length} Workout(s) →</span>
                        )}
                    </button>
                </div>
            )}

        </div>
    )
}

export default SyncCenter