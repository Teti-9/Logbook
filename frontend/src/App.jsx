import { useState, useEffect } from 'react'
import Layout from './components/layout.jsx'
import LogbookLanding from './components/landingPage.jsx'
import RegisterPage from './components/register.jsx'
import LoginPage from './components/login.jsx'
import './App.css'

function App() {

  const [page, setPage] = useState(0)

  const pages = {
    0: <LogbookLanding setPage={setPage} />,

    1: <RegisterPage setPage={setPage} />,

    2: <LoginPage setPage={setPage} />
  }

  return (

    <Layout>
      {pages[page]}
    </Layout>
  )

}

export default App
