import WorkoutsService from "../services/workoutService.js";

const WorkoutBuilder = (props) => {
  const { workout, setWorkout, setPage } = props;

  async function createWorkout(e) {
    e.preventDefault();

    const data = {
      name: workout.name,
      observation: workout.observation,
    };

    const response = await WorkoutsService("POST", data);

    if (response?.success) {
      setWorkout({ name: "", observation: "" });
      alert("Training split successfully created.");
    } else {
      alert(response?.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans text-slate-900">
      <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-sm border-b border-slate-100 sticky top-0 z-30">
        <div className="text-xl font-black uppercase tracking-widest text-slate-900">
          Logbook
        </div>
        <button
          onClick={() => setPage(3)}
          className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
        >
          Dashboard
        </button>
      </nav>

      <main className="p-6 max-w-2xl mx-auto space-y-6 mt-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">
              Build Workout Split
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              Create a new training program routine.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Workout Name
              </label>
              <input
                type="text"
                placeholder="e.g., Push Pull Legs"
                value={workout.name || ""}
                onChange={(e) =>
                  setWorkout((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Observation
              </label>
              <input
                type="text"
                placeholder="e.g., Hypertrophy focused block"
                value={workout.observation || ""}
                onChange={(e) =>
                  setWorkout((current) => ({
                    ...current,
                    observation: e.target.value,
                  }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-12 z-20">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={createWorkout}
            className="w-full flex justify-center items-center py-4 px-6 rounded-2xl shadow-xl shadow-indigo-600/30 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition cursor-pointer"
          >
            Save Workout Split
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutBuilder;
