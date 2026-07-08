import { useState } from 'react'
import Layout from './components/layout.jsx'
import LogbookLanding from './components/landingPage.jsx'
import RegisterPage from './components/register.jsx'
import LoginPage from './components/login.jsx'
import ActiveWorkout from './components/activeworkout.jsx'
import DivisionBuilder from './components/division.jsx'
import './App.css'

function App() {

  const [page, setPage] = useState(3)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [divisions, setDivisions] = useState([])
  const [division, setDivision] = useState({ name: '', day: 'Monday' })
  const [exercises, setExercises] = useState({ name: '', series: '', topset_weight: '', topset_reps: '', divisionId: '' })

  const pages = {
    0: <LogbookLanding setPage={setPage} />,

    1: <RegisterPage email={email} password={password} setPassword={setPassword} setEmail={setEmail} setPage={setPage} />,

    2: <LoginPage email={email} password={password} setPassword={setPassword} setEmail={setEmail} setPage={setPage} />,

    3: <DivisionBuilder division={division} divisions={divisions} setDivisions={setDivisions} setDivision={setDivision} exercises={exercises} setExercises={setExercises} />,

    4: <ActiveWorkout />,
  }

  return (

    <Layout>
      {pages[page]}
    </Layout>
  )

}

export default App
