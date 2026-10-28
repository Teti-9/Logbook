import { useEffect } from "react";
import logbookService from "../services/logbookService.js";
import syncLogbookService from "../services/syncLogbookService.js";
import capitalizeEachWord from "../utils/capitalize.js";
import Day from "../utils/day.js";

const SyncCenter = (props) => {
  const {
    pendingLogs,
    currWorkout,
    setPendingLogs,
    syncState,
    setSyncState,
    setPage,
  } = props;

  useEffect(() => {
    let cancelled = false;

    async function loadLogbooks() {
      setPendingLogs([]);
      const response = await logbookService("GET", "", currWorkout.id);

      if (cancelled) return;

      setPendingLogs(response?.success ? response.data.data || [] : []);
    }

    loadLogbooks();

    return () => {
      cancelled = true;
    };
  }, [currWorkout.id]);

  async function syncLogbook(e) {
    e.preventDefault();

    setSyncState("syncing");

    setTimeout(async () => {
      const data = {
        exercises: pendingLogs.map((log) => Number(log.exerciseId)),
      };

      const response = await syncLogbookService(data, currWorkout.id);

      if (response?.success) {
        setPendingLogs([]);
        setSyncState("success");
      } else {
        alert(response?.message);
      }

      setTimeout(() => setSyncState("idle"), 3000);
    }, 2000);
  }

  async function deleteLogbook(e, id) {
    e.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this logbook?",
    );

    if (confirmed) {
      const response = await logbookService("DELETE", id);

      if (response?.success) {
        setPendingLogs((prev) => prev.filter((log) => log.id !== id));
        alert("Logbook successfully deleted.");
      } else {
        alert(response?.message);
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans text-slate-900">
      <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-sm border-b border-slate-100 sticky top-0 z-30">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">
            Sync Center
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-2 ${
              pendingLogs.length > 0
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {pendingLogs.length > 0 && (
              <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></span>
            )}
            <span>{pendingLogs.length} Pending</span>
          </div>
          <button
            onClick={() => setPage(3)}
            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </nav>

      <main className="p-6 max-w-2xl mx-auto space-y-6 mt-2">
        {syncState === "success" && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-6 rounded-3xl text-center shadow-sm">
            <div className="text-3xl mb-2">✅</div>
            <h2 className="text-xl font-black">Sync Complete!</h2>
            <p className="text-xs font-semibold mt-1 text-emerald-600">
              All your workout logs are successfully synchronized.
            </p>
          </div>
        )}

        {pendingLogs.length === 0 && syncState === "idle" && (
          <div className="bg-white border border-slate-200 p-12 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm">
            <div className="text-4xl opacity-50 mb-3">☁️</div>
            <h2 className="text-lg font-black text-slate-700 mb-1">
              Everything is up to date
            </h2>
            <p className="text-xs font-semibold text-slate-400 max-w-xs">
              You have no pending workouts to sync.
            </p>
          </div>
        )}

        {pendingLogs.length > 0 && syncState !== "success" && (
          <div className="space-y-4">
            {pendingLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative group"
              >
                <button
                  onClick={(e) => deleteLogbook(e, log.id)}
                  className="absolute top-6 right-6 h-8 w-8 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl flex items-center justify-center transition cursor-pointer border border-slate-100"
                  title="Discard Log"
                >
                  ✕
                </button>

                <div className="mb-4 pr-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md mb-2 inline-block">
                    {Day(log.createdAt)}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    {capitalizeEachWord(log.exercise.name)}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {capitalizeEachWord(log.exercise.division.name)} •{" "}
                    {capitalizeEachWord(log.exercise.division.workout.name)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Top Set
                    </div>
                    <div className="font-extrabold text-slate-800 text-sm">
                      {log.topset_weight}kg × {log.topset_reps} reps
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Extra
                    </div>
                    <div className="font-extrabold text-slate-800 text-sm">
                      {log.extra || "None"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {pendingLogs.length > 0 && syncState !== "success" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-12 z-20">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={syncLogbook}
              disabled={syncState === "syncing"}
              className={`w-full flex justify-center items-center py-4 px-6 rounded-2xl shadow-xl text-base font-bold text-white transition cursor-pointer ${
                syncState === "syncing"
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
              }`}
            >
              {syncState === "syncing"
                ? "Syncing Data..."
                : `Sync ${pendingLogs.length} Workout(s) →`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncCenter;
