import { useState, useEffect } from "react";
import { AuthProvider } from "./services/authContext.jsx";
import { useAuth } from "./services/authContext.jsx";
import Layout from "./components/layout.jsx";
import LogbookLanding from "./components/landingPage.jsx";
import RegisterPage from "./components/register.jsx";
import LoginPage from "./components/login.jsx";
import ActiveWorkout from "./components/activeworkout.jsx";
import DivisionBuilder from "./components/division.jsx";
import Dashboard from "./components/dashboard.jsx";
import SyncCenter from "./components/sync.jsx";
import HistoryPage from "./components/history.jsx";
import WorkoutBuilder from "./components/workout.jsx";
import "./App.css";

function App() {
  const [page, setPage] = useState(0);

  return (
    <AuthProvider>
      <AppShell page={page} setPage={setPage} />
    </AuthProvider>
  );
}

function AppShell({ page, setPage, ...rest }) {
  const [syncState, setSyncState] = useState("idle");
  const [workoutId, setWorkoutId] = useState(0);
  const [currWorkout, setCurrWorkout] = useState({
    name: "",
    id: 0,
  });
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [workout, setWorkout] = useState({
    name: "",
    observation: "",
    divisions: [],
  });
  const [division, setDivision] = useState({
    id: 0,
    name: "",
    day: "",
    exercises: [],
  });
  const [logbook, setLogbook] = useState({
    exerciseId: "",
    topset_weight: "",
    topset_reps: "",
    backoff_weight: "",
    backoff_reps: "",
  });
  const [pendingLogs, setPendingLogs] = useState([]);
  const [exercises, setExercises] = useState({
    name: "",
    target_muscle_group: "",
    series_reps: "",
    rest: "",
    advanced_technique: "",
    observation: "",
    divisionId: "",
  });
  const [historical, setHistorical] = useState([]);
  const [previousByExercise, setPreviousByExercise] = useState({});

  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && page === 0) {
      setPage(3);
    }
  }, [loading, isAuthenticated, page, setPage]);

  const pages = {
    0: <LogbookLanding setPage={setPage} />,

    1: (
      <RegisterPage
        name={name}
        setName={setName}
        email={email}
        password={password}
        setPassword={setPassword}
        setEmail={setEmail}
        setPage={setPage}
      />
    ),

    2: (
      <LoginPage
        email={email}
        password={password}
        setPassword={setPassword}
        setEmail={setEmail}
        setPage={setPage}
      />
    ),

    3: (
      <Dashboard
        workout={workout}
        workouts={workouts}
        workoutId={workoutId}
        currWorkout={currWorkout}
        setCurrWorkout={setCurrWorkout}
        division={division}
        setWorkoutId={setWorkoutId}
        setDivision={setDivision}
        setWorkouts={setWorkouts}
        setWorkout={setWorkout}
        setPage={setPage}
      />
    ),

    4: (
      <DivisionBuilder
        workouts={workouts}
        setWorkouts={setWorkouts}
        currWorkout={currWorkout}
        setCurrWorkout={setCurrWorkout}
        divisions={divisions}
        division={division}
        setDivision={setDivision}
        setDivisions={setDivisions}
        exercises={exercises}
        setExercises={setExercises}
        setPage={setPage}
      />
    ),

    5: (
      <ActiveWorkout
        logbook={logbook}
        division={division}
        previousByExercise={previousByExercise}
        setPreviousByExercise={setPreviousByExercise}
        currWorkout={currWorkout}
        setLogbook={setLogbook}
        setDivision={setDivision}
        setPage={setPage}
      />
    ),

    6: (
      <SyncCenter
        pendingLogs={pendingLogs}
        currWorkout={currWorkout}
        syncState={syncState}
        setPendingLogs={setPendingLogs}
        setSyncState={setSyncState}
        setPage={setPage}
      />
    ),

    7: (
      <HistoryPage
        search={search}
        currWorkout={currWorkout}
        historical={historical}
        setSearch={setSearch}
        setHistorical={setHistorical}
        setPage={setPage}
      />
    ),

    8: (
      <WorkoutBuilder
        workout={workout}
        setWorkout={setWorkout}
        setPage={setPage}
      />
    ),
  };

  return <Layout>{pages[page]}</Layout>;
}

export default App;
