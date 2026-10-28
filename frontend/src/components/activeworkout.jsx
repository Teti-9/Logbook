import { useEffect } from "react";
import capitalizeEachWord from "../utils/capitalize.js";
import logbookService from "../services/logbookService.js";
import ExercisesService from "../services/exercisesService.js";
import HistoricalService from "../services/historicalService.js";

const ActiveWorkout = (props) => {
  const {
    logbook,
    currWorkout,
    division,
    previousByExercise,
    setPreviousByExercise,
    setLogbook,
    setDivision,
    setPage,
  } = props;
  const exercises = division?.exercises ?? [];

  async function loadPrevious() {
    if (!currWorkout?.id) return;
    const response = await HistoricalService("GET", "", currWorkout.id);
    if (!response?.success) return;

    const latest = {};
    for (const h of response.data || []) {
      const current = latest[h.exerciseId];
      if (!current || new Date(h.createdAt) > new Date(current.createdAt)) {
        latest[h.exerciseId] = h;
      }
    }
    setPreviousByExercise(latest);
  }

  useEffect(() => {
    loadPrevious();
  }, [currWorkout?.id, division?.id]);

  const handleLogChange = (exerciseId, field, value) => {
    setLogbook((current) => ({
      ...current,
      [exerciseId]: {
        ...current[exerciseId],
        [field]: value,
      },
    }));
  };

  async function createLogbook(e, id) {
    e.preventDefault();

    try {
      const data = {
        exerciseId: Number(id),
        topset_weight: Number(logbook[id].topset_weight),
        topset_reps: Number(logbook[id].topset_reps),
        extra: logbook[id].extra,
        divisionId: division.id,
      };

      const response = await logbookService("POST", data, currWorkout.id);

      if (response?.success) {
        setLogbook((current) => {
          const updated = { ...current };
          delete updated[id];
          return updated;
        });
        alert("Logbook successfully created.");
      } else {
        setLogbook((current) => {
          const updated = { ...current };
          delete updated[id];
          return updated;
        });
        alert(response?.message);
      }
    } catch (error) {
      if (error.message.startsWith("Cannot read properties of undefined")) {
        alert("Not all fields are filled, try again.");
      }
    }
  }

  async function deleteExercise(e, id) {
    e.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this exercise?",
    );

    if (confirmed) {
      const response = await ExercisesService(
        "DELETE",
        Number(id),
        currWorkout.id,
        division.id,
      );

      if (response?.success) {
        setDivision((current) => ({
          ...current,
          exercises: current.exercises.filter((ex) => ex.id !== id),
        }));
        alert("Exercise successfully deleted.");
      } else {
        alert(response?.message);
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans text-slate-900">
      <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-sm border-b border-slate-100 sticky top-0 z-30">
        <div>
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            {capitalizeEachWord(currWorkout?.name)}
          </div>
          <div className="text-xl font-black uppercase tracking-tight text-slate-900">
            {capitalizeEachWord(division?.name) ?? "Active Workout"} Day
          </div>
        </div>
        <button
          onClick={() => setPage(3)}
          className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
        >
          Dashboard
        </button>
      </nav>

      <main className="p-6 max-w-2xl mx-auto space-y-6 mt-2">
        {exercises.length > 0 ? (
          exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                    Exercise {index + 1}
                  </div>
                  <h2 className="text-xl font-black text-slate-900">
                    {capitalizeEachWord(exercise.name)}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">
                    Series: {exercise.series_reps}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteExercise(e, exercise.id)}
                  className="h-8 w-8 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl flex items-center justify-center transition cursor-pointer border border-slate-100"
                  title="Discard Exercise"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Top Set
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Weight
                      </label>
                      <input
                        type="number"
                        placeholder="20"
                        value={logbook[exercise.id]?.topset_weight ?? ""}
                        onChange={(e) =>
                          handleLogChange(
                            exercise.id,
                            "topset_weight",
                            e.target.value,
                          )
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      />
                      <label className="block text-xs font-bold text-slate-700 mt-3 mb-1">
                        Current Weight:
                      </label>
                      <div className="text-sm font-extrabold text-slate-500">
                        {previousByExercise[exercise.id]
                          ? `${previousByExercise[exercise.id].previous_topset_weight}kg`
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        placeholder="9"
                        value={logbook[exercise.id]?.topset_reps ?? ""}
                        onChange={(e) =>
                          handleLogChange(
                            exercise.id,
                            "topset_reps",
                            e.target.value,
                          )
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      />
                      <label className="block text-xs font-bold text-slate-700 mt-3 mb-1">
                        Current Reps:
                      </label>
                      <div className="text-sm font-extrabold text-slate-500">
                        {previousByExercise[exercise.id]
                          ? `${previousByExercise[exercise.id].previous_topset_reps} reps`
                          : "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50">
                  <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">
                    Extra Notes
                  </div>
                  <input
                    type="text"
                    placeholder="Optional notes or observations..."
                    value={logbook[exercise.id]?.extra ?? ""}
                    onChange={(e) =>
                      handleLogChange(exercise.id, "extra", e.target.value)
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-base font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              <button
                onClick={(e) => {
                  createLogbook(e, exercise.id);
                }}
                className="mt-6 w-full bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-2xl hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                Save {capitalizeEachWord(exercise.name)} Log
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-200 text-slate-500 font-medium">
            No exercises found for this workout.
          </div>
        )}
      </main>
    </div>
  );
};

export default ActiveWorkout;
