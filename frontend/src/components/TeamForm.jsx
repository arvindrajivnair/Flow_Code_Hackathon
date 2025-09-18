import React, { useState } from 'react'
import { api } from '../api/client'

const TeamForm = ({ tournamentId, teams, setTeams }) => {
  const [teamName, setTeamName] = useState('')
  const [seed, setSeed] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAddTeam = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.addTeam(
        tournamentId, 
        teamName, 
        seed ? parseInt(seed) : null
      )
      setTeams([...teams, response.data])
      setTeamName('')
      setSeed('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add team')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gold/20 shadow-xl">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center font-bold mr-3">2</div>
        <h3 className="text-2xl font-bold text-gold">Add Teams</h3>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Add Team Form */}
      <form onSubmit={handleAddTeam} className="mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gold mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-300"
              placeholder="Enter team name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gold mb-2">
              Seed (Optional)
            </label>
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-300"
              placeholder="1, 2, 3..."
              min="1"
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-gold/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? 'Adding...' : '➕ Add Team'}
            </button>
          </div>
        </div>
      </form>

      {/* Teams List */}
      {teams.length > 0 && (
        <div>
          <h4 className="text-xl font-bold text-gold mb-4 flex items-center">
            🏆 Teams Added ({teams.length})
          </h4>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {teams
              .sort((a, b) => (a.seed || 999) - (b.seed || 999))
              .map((team, index) => (
                <div
                  key={team.id}
                  className="p-4 bg-black/30 rounded-lg border border-gray-700 hover:border-gold/50 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gold/20 text-gold rounded-full flex items-center justify-center font-bold text-sm mr-3">
                        {team.seed || index + 1}
                      </div>
                      <span className="text-white font-medium group-hover:text-gold transition-colors">
                        {team.name}
                      </span>
                    </div>
                    {team.seed && (
                      <span className="text-gold text-xs font-bold px-2 py-1 bg-gold/20 rounded-full">
                        SEED #{team.seed}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {teams.length >= 2 && (
            <div className="mt-6 p-4 bg-gold/10 border border-gold/30 rounded-lg">
              <p className="text-gold text-center font-medium">
                ✅ Ready to generate bracket with {teams.length} teams!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TeamForm
