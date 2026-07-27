import { useState, useEffect } from 'react'
import { AuthProvider } from './services/authContext.jsx'
import { useAuth } from './services/authContext.jsx'
import Layout from './components/layout.jsx'
import LogbookLanding from './components/landingPage.jsx'
import RegisterPage from './components/register.jsx'
import LoginPage from './components/login.jsx'
import ActiveWorkout from './components/activeworkout.jsx'
import DivisionBuilder from './components/division.jsx'
import Dashboard from './components/dashboard.jsx'
import SyncCenter from './components/sync.jsx'
import HistoryPage from './components/history.jsx'
import './App.css'

function App() {

  const [page, setPage] = useState(0)

  return (
    <AuthProvider>
      <AppShell page={page} setPage={setPage} />
    </AuthProvider>
  )
}

function AppShell({ page, setPage, ...rest }) {
  const [syncState, setSyncState] = useState('idle')
  const [search, setSearch] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [divisions, setDivisions] = useState([])
  const [division, setDivision] = useState({ name: '', day: '', exercises: [] })
  const [logbook, setLogbook] = useState({ exerciseId: '', topset_weight: '', topset_reps: '', backoff_weight: '', backoff_reps: '' })
  const [pendingLogs, setPendingLogs] = useState([])
  const [exercises, setExercises] = useState({ name: '', series: '', topset_weight: '', topset_reps: '', backoff_weight: '', backoff_reps: '', divisionId: '' })
  const [historical, setHistorical] = useState([])
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated && page === 0) {
      setPage(3)
    }
  }, [loading, isAuthenticated, page, setPage])

  if (loading) return null

  const pages = {
    0: <LogbookLanding setPage={setPage} />,

    1: <RegisterPage email={email} password={password} setPassword={setPassword} setEmail={setEmail} setPage={setPage} />,

    2: <LoginPage email={email} password={password} setPassword={setPassword} setEmail={setEmail} setPage={setPage} />,

    3: <Dashboard division={division} divisions={divisions} setDivisions={setDivisions} setDivision={setDivision} setPage={setPage} />,

    4: <DivisionBuilder division={division} divisions={divisions} setDivisions={setDivisions} setDivision={setDivision} exercises={exercises} setExercises={setExercises} setPage={setPage} />,

    5: <ActiveWorkout logbook={logbook} division={division} divisions={divisions} setLogbook={setLogbook} setDivisions={setDivisions} setDivision={setDivision} setPage={setPage} />,

    6: <SyncCenter pendingLogs={pendingLogs} syncState={syncState} setPendingLogs={setPendingLogs} setSyncState={setSyncState} setPage={setPage} />,

    7: <HistoryPage search={search} historical={historical} setSearch={setSearch} setHistorical={setHistorical} setPage={setPage} />,
  }

  return (
    <Layout>
      {pages[page]}
    </Layout>
  )
}

export default App