import { useEffect } from "react";
import { useAuth } from "../services/authContext.jsx";
import WorkoutsService from "../services/workoutService.js";
import capitalizeEachWord from "../utils/capitalize.js";

const Dashboard = (props) => {
  const {
    workouts,
    setWorkouts,
    workoutId,
    setWorkoutId,
    setCurrWorkout,
    setDivision,
    setPage,
  } = props;
  const { clearAuth, logout } = useAuth();

  var today = [];
  var nottoday = [];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const now = new Date();
  const dayName = days[now.getDay()];

  useEffect(() => {
    let ignore = false;

    async function loadWorkouts() {
      const response = await WorkoutsService("GET", "");

      if (ignore) return;

      if (response?.success) {
        setWorkouts(response.data.workouts || []);
      }

      if (response?.message === "Unauthorized.") {
        setWorkouts([]);
        setPage(0);
      }
    }

    loadWorkouts();

    return () => {
      ignore = true;
    };
  }, [setWorkouts, setPage, clearAuth]);

  const workoutsMap = workouts.map((item) => ({
    id: item.id,
    name: item.name,
    observation: item.obersvation,
    divisions: item.divisions,
  }));

  const workout = workoutsMap[workoutId];

  workout?.divisions.forEach((division) => {
    if (capitalizeEachWord(division.day) === dayName) {
      today.push({
        id: division.id,
        name: division.name,
        day: division.day,
        workoutId: division.workoutId,
        exercises: division.exercises,
      });
    }

    if (capitalizeEachWord(division.day) !== dayName) {
      nottoday.push({
        id: division.id,
        name: division.name,
        day: division.day,
        workoutId: division.workoutId,
        exercises: division.exercises,
      });
    }
  });

  const totalDivisions = workout?.divisions?.length || 0;
  const allExercises =
    workout?.divisions?.flatMap((d) => d.exercises || []) || [];
  const totalExercises = allExercises.length;

  const muscleGroupCounts = allExercises.reduce((acc, ex) => {
    const mg = capitalizeEachWord(ex.target_muscle_group || "General");
    acc[mg] = (acc[mg] || 0) + 1;
    return acc;
  }, {});

  const muscleGroupArray = Object.entries(muscleGroupCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage:
        totalExercises > 0 ? ((count / totalExercises) * 100).toFixed(1) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const uniqueMuscleGroupsCount = Object.keys(muscleGroupCounts).length;

  function changeWorkout() {
    if (workoutsMap.length === 0) return;
    setWorkoutId((prev) => (prev + 1) % workoutsMap.length);
  }

  async function logoutUser() {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;
    try {
      await logout();
    } finally {
      setWorkouts([]);
      setWorkoutId(0);
      setCurrWorkout({
        name: "",
        id: 0,
      });
      setPage(0);
      alert("User logged out.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans text-slate-900">
      <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-sm border-b border-slate-100 sticky top-0 z-30">
        <div className="text-xl font-black uppercase tracking-widest text-slate-900">
          Logbook
        </div>
        <div
          onClick={() => {
            logoutUser();
          }}
          className="h-10 w-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold border border-indigo-200 cursor-pointer shadow-sm hover:bg-indigo-200 transition"
          title="Logout"
        >
          RC
        </div>
      </nav>

      <main className="p-6 max-w-4xl mx-auto space-y-8 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">
              Let's get to work.
            </h1>
            <p className="text-sm font-semibold text-slate-500">
              Active Routine:{" "}
              <span className="text-indigo-600">
                {capitalizeEachWord(workoutsMap[workoutId]?.name ?? "") ||
                  "No Workout Selected"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(8)}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-100 transition cursor-pointer shadow-sm"
            >
              + New Workout
            </button>
            <button
              onClick={() => changeWorkout()}
              className="bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-100 transition cursor-pointer shadow-sm"
            >
              ⟲ Change Workout
            </button>
          </div>
        </div>

        {today.length > 0 ? (
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Scheduled For Today
              </h2>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 -mt-6 -mr-6 h-40 w-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="space-y-2">
                  <div className="text-indigo-400 font-bold text-xs uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full w-fit">
                    {dayName}
                  </div>
                  <h3 className="text-3xl font-black tracking-tight">
                    {capitalizeEachWord(today[0].name)}
                  </h3>
                  <p className="text-slate-400 font-medium text-sm">
                    {today[0].exercises?.length || 0} Exercise(s) configured
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCurrWorkout({
                      name: workout.name,
                      id: workout.id,
                    });
                    setDivision({
                      id: today[0].id,
                      name: today[0].name,
                      day: today[0].day,
                      exercises: today[0].exercises,
                    });
                    setPage(5);
                  }}
                  className="bg-indigo-600 text-white px-7 py-3.5 rounded-2xl text-base font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 cursor-pointer w-full sm:w-auto"
                >
                  <span>Check Workout</span>
                  <span className="text-lg">→</span>
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <span className="h-3 w-3 bg-amber-500 rounded-full"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Scheduled For Today
              </h2>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 -mt-6 -mr-6 h-40 w-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                <div className="text-indigo-400 font-bold text-xs uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full w-fit mb-2">
                  {dayName}
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-1">
                  Rest Day
                </h3>
                <p className="text-slate-400 font-medium text-sm">
                  No divisions scheduled for today. Enjoy your recovery!
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900">
              Your Splits & Tools
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setCurrWorkout({
                    name: workout.name,
                    id: workout.id,
                  });
                  setPage(4);
                }}
                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                + Division | Exercise
              </button>
              <button
                onClick={() => {
                  setCurrWorkout({
                    name: workout.name,
                    id: workout.id,
                  });
                  setPage(6);
                }}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                Sync Logbooks
              </button>
              <button
                onClick={() => {
                  setCurrWorkout({
                    name: workout.name,
                    id: workout.id,
                  });
                  setPage(7);
                }}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                History
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {nottoday.map((division) => (
              <div
                key={division.id}
                className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                        {division.day}
                      </div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition">
                        {capitalizeEachWord(division.name)}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {division.exercises?.length || 0} Exercises assigned
                  </span>
                  <button
                    onClick={() => {
                      setCurrWorkout({
                        name: workout.name,
                        id: workout.id,
                      });
                      setDivision({
                        id: division.id,
                        name: division.name,
                        day: division.day,
                        exercises: division.exercises,
                      });
                      setPage(5);
                    }}
                    className="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition transform cursor-pointer"
                    title="Configure Division"
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 mb-1">
              Plan Analysis
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Review exercise volume and distribution across your routines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-2xl font-black text-slate-900">
                {totalDivisions}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase mt-1">
                Divisions in Plan
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-2xl font-black text-indigo-600">
                {totalExercises}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase mt-1">
                Total Exercises
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-2xl font-black text-slate-900">
                {uniqueMuscleGroupsCount}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase mt-1">
                Muscle Groups
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
                Muscle Group Distribution
              </h3>
              {muscleGroupArray.length > 0 ? (
                <div className="space-y-3">
                  {muscleGroupArray.map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-700">{item.name}</span>
                        <span className="text-slate-500">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  No exercises added to analyze yet.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
