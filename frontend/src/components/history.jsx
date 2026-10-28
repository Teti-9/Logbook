import { useEffect } from "react";
import HistoricalService from "../services/historicalService.js";
import capitalizeEachWord from "../utils/capitalize.js";
import formatDate from "../utils/datestr.js";

const HistoryPage = (props) => {
  const { search, currWorkout, historical, setSearch, setHistorical, setPage } =
    props;

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setHistorical([]);
      setSearch("");
      const response = await HistoricalService("GET", "", currWorkout.id);

      if (cancelled) return;

      setHistorical(response?.success ? response.data || [] : []);
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [currWorkout.id]);

  async function getHistoryByName() {
    const response = await HistoricalService("GET", search, currWorkout.id);

    if (response?.success) {
      setHistorical(response.data || []);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
      <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-sm border-b border-slate-100 sticky top-0 z-30">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">
            Your Progress
          </h1>
        </div>
        <button
          onClick={() => setPage(3)}
          className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
        >
          Dashboard
        </button>
      </nav>

      <main className="p-6 max-w-2xl mx-auto space-y-6 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search exercise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
          <button
            onClick={() => getHistoryByName()}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-500 transition cursor-pointer shadow-md shadow-indigo-600/20"
          >
            Search
          </button>
        </div>

        <div className="space-y-4">
          {historical.length > 0 ? (
            historical.map((ex) => (
              <div
                key={ex.id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">
                    {capitalizeEachWord(ex.exercise.name)}
                  </h3>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {formatDate(ex.createdAt)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Previous Top Set
                    </div>
                    <div className="font-extrabold text-slate-800 text-sm">
                      {ex.previous_topset_weight}kg × {ex.previous_topset_reps}{" "}
                      reps
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Logbook Extra
                    </div>
                    <div className="font-extrabold text-slate-800 text-sm">
                      {ex.extra ?? "None"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400">Technique:</span>{" "}
                    {ex.exercise.advanced_technique ?? "None"}
                  </div>
                  <div>
                    <span className="text-slate-400">Observation:</span>{" "}
                    {ex.exercise.observation ?? "None"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-200 text-slate-400 font-medium">
              No history found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
