import { useEffect } from "react";
import ExercisesService from "../services/exercisesService.js";
import DivisionsService from "../services/divisionService.js";
import WorkoutsService from "../services/workoutService.js";
import capitalizeEachWord from "../utils/capitalize.js";

const DivisionBuilder = (props) => {
  const {
    workouts,
    setWorkouts,
    currWorkout,
    division,
    exercises,
    divisions,
    setDivision,
    setDivisions,
    setExercises,
    setPage,
  } = props;

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const ADVANCED_TECHNIQUES = [
    {
      value: "backoff",
      label: "Backoff",
      description: "remove 30% weight, rest for 30 seconds and do another set.",
    },
  ];

  async function loadWorkouts() {
    const response = await WorkoutsService("GET", "");

    if (response?.success) {
      setWorkouts(response.data.workouts || []);
    }
  }

  async function loadDivisions() {
    const response = await DivisionsService("GET", "", currWorkout.id);

    if (response?.success) {
      setDivisions(response.data.divisions || []);
    }
  }

  useEffect(() => {
    setDivision({ name: "", day: "Monday" });
    loadWorkouts();
    loadDivisions();
  }, []);

  async function getWorkouts(e) {
    e.preventDefault();
    await loadWorkouts();
  }

  async function getDivisions(e) {
    e.preventDefault();
    await loadDivisions();
  }

  async function createDivision(e) {
    e.preventDefault();

    const data = {
      name: division.name,
      day: division.day.toLowerCase(),
      workoutId: Number(division.workoutId),
    };

    if (!division.day) {
      data.day = "Monday";
    }

    const response = await DivisionsService("POST", data, currWorkout.id);

    if (response?.success) {
      setDivision({ name: "", day: "Monday" });
      await loadWorkouts();
      await loadDivisions();
      alert("Division successfully created.");
    } else {
      alert(response?.message);
    }
  }

  async function createExercise(e) {
    e.preventDefault();

    const data = {
      name: exercises.name,
      target_muscle_group: exercises.target_muscle_group,
      series_reps: exercises.series_reps,
      rest: Number(exercises.rest),
      advanced_technique: exercises.advanced_technique,
      observation: exercises.observation,
      divisionId: Number(exercises.divisionId),
    };

    const response = await ExercisesService("POST", data, currWorkout.id);

    if (response?.success) {
      setExercises({
        name: "",
        target_muscle_group: "",
        series_reps: "",
        rest: "",
        advanced_technique: "",
        observation: "",
        divisionId: "",
      });
      alert("Exercise successfully created.");
    } else {
      alert(response?.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-40 font-sans text-slate-900">
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b border-slate-100 sticky top-0 z-30">
        <div className="text-2xl font-black uppercase tracking-widest text-slate-900">
          Logbook
        </div>
        <button
          onClick={() => setPage(3)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition font-bold shadow-md shadow-indigo-200 cursor-pointer text-sm"
        >
          Dashboard
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-8 space-y-8">
        <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <h1 className="text-2xl font-black tracking-tight">Build Division</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Division Name
              </label>
              <input
                type="text"
                placeholder="e.g., Push"
                value={division.name || ""}
                onChange={(e) =>
                  setDivision((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Target Day
              </label>
              <select
                value={division.day || ""}
                onChange={(e) =>
                  setDivision((current) => ({
                    ...current,
                    day: e.target.value,
                  }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">
                Available Workouts
              </h3>
              <button
                onClick={getWorkouts}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Refresh
              </button>
            </div>

            {workouts.length > 0 ? (
              <div className="grid gap-2.5 max-h-56 overflow-y-auto pr-1">
                {workouts.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setDivision((current) => ({
                        ...current,
                        workoutId: String(item.id),
                      }))
                    }
                    className={`w-full text-left rounded-xl border px-4 py-3 transition ${
                      Number(division.workoutId) === item.id
                        ? "border-indigo-500 bg-indigo-50/80 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold text-slate-900 text-sm">
                        {capitalizeEachWord(item.name)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {capitalizeEachWord(
                          item.observation ?? "No observation",
                        )}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Create a workout first to assign it to this division.
              </p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-extrabold text-slate-900">Exercises</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Exercise Name
              </label>
              <input
                type="text"
                placeholder="e.g., Barbell Bench Press"
                value={exercises.name}
                onChange={(e) =>
                  setExercises((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Muscle Group
                </label>
                <input
                  type="text"
                  placeholder="Chest"
                  value={exercises.target_muscle_group}
                  onChange={(e) =>
                    setExercises((current) => ({
                      ...current,
                      target_muscle_group: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-center text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Series & Reps
                </label>
                <input
                  type="text"
                  placeholder="3x10"
                  value={exercises.series_reps}
                  onChange={(e) =>
                    setExercises((current) => ({
                      ...current,
                      series_reps: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-center text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Rest (sec)
                </label>
                <input
                  type="number"
                  placeholder="120"
                  value={exercises.rest}
                  onChange={(e) =>
                    setExercises((current) => ({
                      ...current,
                      rest: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-center text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Advanced Technique
                </label>
                <select
                  value={exercises.advanced_technique}
                  onChange={(e) =>
                    setExercises((c) => ({
                      ...c,
                      advanced_technique: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                >
                  <option value="">None</option>
                  {ADVANCED_TECHNIQUES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label} — {t.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Observation
                </label>
                <input
                  type="text"
                  placeholder="Machine / Notes"
                  value={exercises.observation}
                  onChange={(e) =>
                    setExercises((current) => ({
                      ...current,
                      observation: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-center text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">
                Select Target Division
              </h3>
              <button
                onClick={getDivisions}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Refresh
              </button>
            </div>

            {divisions.length > 0 ? (
              <div className="grid gap-2.5 max-h-52 overflow-y-auto pr-1">
                {divisions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setExercises((current) => ({
                        ...current,
                        divisionId: String(item.id),
                      }))
                    }
                    className={`w-full text-left rounded-xl border px-4 py-3 transition ${
                      Number(exercises.divisionId) === item.id
                        ? "border-indigo-500 bg-indigo-50/80 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold text-slate-900 text-sm">
                        {capitalizeEachWord(item.name)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {`${capitalizeEachWord(item.workout.name)} - ${capitalizeEachWord(item.day)}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Create a division first, then pick it for the exercise.
              </p>
            )}
          </div>

          <button
            onClick={createExercise}
            className="w-full py-3.5 border-2 border-dashed border-slate-300 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 hover:border-slate-400 hover:text-slate-900 transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
          >
            <span className="text-lg">+</span>
            <span>Add Exercise</span>
          </button>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-100 via-slate-100/90 to-transparent pt-8 z-20">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={createDivision}
            className="w-full flex justify-center items-center py-4 px-6 rounded-2xl shadow-xl shadow-indigo-200 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition transform cursor-pointer"
          >
            Save Division
          </button>
        </div>
      </div>
    </div>
  );
};

export default DivisionBuilder;
