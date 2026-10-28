const LogbookLanding = (props) => {
  const { setPage } = props;

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen">
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm border-b border-slate-100 sticky top-0 z-30">
        <div className="text-xl font-black uppercase tracking-widest text-slate-900">
          Logbook
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-bold text-slate-500">
          <a href="#features" className="hover:text-indigo-600 transition">
            Features
          </a>
          <a href="#routines" className="hover:text-indigo-600 transition">
            Routines
          </a>
          <a href="#pricing" className="hover:text-indigo-600 transition">
            About
          </a>
        </div>
        <button
          onClick={() => setPage(2)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-500 transition font-bold shadow-lg shadow-indigo-600/20 cursor-pointer text-xs"
        >
          Start Tracking
        </button>
      </nav>

      <header className="flex flex-col items-center justify-center text-center py-24 md:py-32 px-4">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
          Level up your training 🏋️‍♂️
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-3xl tracking-tight text-slate-900">
          Your gains,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            perfectly tracked.
          </span>
        </h1>
        <p className="text-base md:text-lg text-slate-500 mb-10 max-w-xl font-medium">
          Built for dedicated lifters to log sets, monitor progress, and crush
          goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setPage(2)}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-base font-bold hover:bg-slate-800 transition shadow-xl cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:-translate-y-1 transition duration-300">
            <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">
              📝
            </div>
            <h3 className="text-lg font-black mb-2 text-slate-900">
              Effortless Logging
            </h3>
            <p className="text-slate-500 font-medium text-sm">
              Log sets, reps, and weights with an intuitive interface designed
              for quick gym use.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:-translate-y-1 transition duration-300">
            <div className="h-14 w-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">
              📈
            </div>
            <h3 className="text-lg font-black mb-2 text-slate-900">
              Data-Driven Insights
            </h3>
            <p className="text-slate-500 font-medium text-sm">
              Visualize your volume progression and historical lifts easily.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:-translate-y-1 transition duration-300">
            <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">
              ⚙️
            </div>
            <h3 className="text-lg font-black mb-2 text-slate-900">
              Custom Routines
            </h3>
            <p className="text-slate-500 font-medium text-sm">
              Build your own programs from scratch and organize divisions
              seamlessly.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 text-center py-12 px-6">
        <div className="text-xl font-black uppercase tracking-widest text-white mb-2">
          Logbook
        </div>
        <p className="mb-4 font-medium text-sm text-slate-400">
          Built for the dedicated.
        </p>
        <p className="text-slate-600 text-xs font-semibold">
          © 2026 Logbook. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LogbookLanding;
