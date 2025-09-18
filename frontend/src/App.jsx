import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import CreateTournament from './pages/CreateTournament'
import BracketView from './pages/BracketView'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-tournament" element={<CreateTournament />} />
          <Route path="/tournament/:id" element={<BracketView />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
