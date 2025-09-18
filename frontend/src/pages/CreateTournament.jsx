import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import TeamForm from '../components/TeamForm'

const CreateTournament = () => {
  const [tournamentName, setTournamentName] = useState('')
  const [sport, setSport] = useState('basketball')
  const [teams, setTeams] = useState([])
  const [currentTournament, setCurrentTournament] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const sports = [
    { value: 'basketball', emoji: '🏀', name: 'Basketball' },
    { value: 'football', emoji: '⚽', name: 'Football' },
    { value: 'badminton', emoji: '🏸', name: 'Badminton' },
    { value: 'tennis', emoji: '🎾', name: 'Tennis' },
    { value: 'volleyball', emoji: '🏐', name: 'Volleyball' },
  ]

  const handleCreateTournament = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.createTournament(tournamentName, sport)
      setCurrentTournament(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create tournament')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateBracket = async () => {
    if (teams.length < 2) {
      setError('Need at least 2 teams to generate bracket')
      return
    }

    setLoading(true)
    setError('')

    try {
      await api.generateBracket(currentTournament.id)
      navigate(`/tournament/${currentTournament.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate bracket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black text-gold mb-4">⚡ Create Tournament</h1>
        <p className="text-gray-400 text-lg">Set up your tournament in just a few steps</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Step 1: Tournament Setup */}
      {!currentTournament ? (
        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gold/20 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center font-bold mr-3">1</div>
            <h2 className="text-2xl font-bold text-gold">Tournament Details</h2>
          </div>

          <form onSubmit={handleCreateTournament}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Tournament Name */}
              <div>
                <label className="block text-sm font-medium text-gold mb-2">
                  Tournament Name
                </label>
                <input
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                  placeholder="Enter tournament name"
                  required
                />
              </div>

              {/* Sport Selection */}
              <div>
                <label className="block text-sm font-medium text-gold mb-2">
                  Sport
                </label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                >
                  {sports.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.emoji} {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-3 bg-gradient-to-r from-gold to-gold-light text-black font-bold text-lg rounded-lg hover:shadow-lg hover:shadow-gold/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? 'Creating...' : '🚀 Create Tournament'}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Tournament Info Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gold/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gold">{currentTournament.name}</h2>
                <p className="text-gray-400 capitalize flex items-center mt-1">
                  {sports.find(s => s.value === currentTournament.sport)?.emoji} {currentTournament.sport}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gold">{teams.length}</div>
                <div className="text-sm text-gray-400">Teams Added</div>
              </div>
            </div>
          </div>

          {/* Step 2: Team Management */}
          <TeamForm 
            tournamentId={currentTournament.id} 
            teams={teams} 
            setTeams={setTeams} 
          />

          {/* Step 3: Generate Bracket */}
          {teams.length >= 2 && (
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gold/20 shadow-xl text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center font-bold mr-3">3</div>
                <h3 className="text-2xl font-bold text-gold">Ready to Generate Bracket</h3>
              </div>
              
              <p className="text-gray-400 mb-6">
                Your tournament has {teams.length} teams. Click below to generate the bracket and start the tournament!
              </p>

              <button
                onClick={handleGenerateBracket}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-black font-bold text-xl rounded-lg hover:shadow-lg hover:shadow-gold/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? 'Generating...' : '🏆 Generate Bracket'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreateTournament
