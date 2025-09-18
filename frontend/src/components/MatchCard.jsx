// Enhanced MatchCard Component
import React, { useState } from 'react'
import { api } from '../api/client'

const MatchCard = ({ match, teams, isHost, onMatchUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [score1, setScore1] = useState(match.score1 || '')
  const [score2, setScore2] = useState(match.score2 || '')
  const [loading, setLoading] = useState(false)

  const team1 = teams.find(t => t.id === match.team1_id)
  const team2 = teams.find(t => t.id === match.team2_id)
  const winner = teams.find(t => t.id === match.winner_id)

  const handleUpdateScore = async () => {
    if (!score1 || !score2) return

    setLoading(true)
    try {
      const response = await api.updateMatchScore(match.id, parseInt(score1), parseInt(score2))
      await onMatchUpdate(response.data) // Ensure this completes before continuing
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update score', err)
      alert('Failed to update score. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setScore1(match.score1 || '')
    setScore2(match.score2 || '')
    setIsEditing(false)
  }

  return (
    <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
      winner 
        ? 'bg-gradient-to-br from-gold/20 to-gold-light/10 border-gold shadow-lg shadow-gold/20' 
        : 'bg-gray-800/50 border-gray-600 hover:border-gold/50'
    } ${isHost ? 'cursor-pointer hover:shadow-lg' : ''}`}>
      
      {/* Match Header */}
      <div className="text-center mb-4">
        <div className="text-xs text-gold font-bold mb-1">
          Round {match.round}
        </div>
        <div className="text-lg font-black text-white">
          Match #{match.match_idx + 1}
        </div>
      </div>

      {/* Teams */}
      <div className="space-y-3">
        {/* Team 1 */}
        <div className={`flex justify-between items-center p-3 rounded-lg transition-all ${
          match.winner_id === match.team1_id 
            ? 'bg-gold text-black font-bold shadow-md' 
            : 'bg-gray-700/50 text-white'
        }`}>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold mr-2">
              1
            </div>
            <span className="font-semibold">{team1?.name || 'TBD'}</span>
          </div>
          
          {isEditing ? (
            <input
              type="number"
              value={score1}
              onChange={(e) => setScore1(e.target.value)}
              className="w-16 px-2 py-1 bg-black/50 text-white rounded text-center border border-gray-500 focus:border-gold"
              min="0"
            />
          ) : (
            <span className="text-xl font-mono font-bold">
              {match.score1 ?? '-'}
            </span>
          )}
        </div>

        {/* VS Divider */}
        <div className="text-center">
          <span className="text-gold font-bold">VS</span>
        </div>

        {/* Team 2 */}
        <div className={`flex justify-between items-center p-3 rounded-lg transition-all ${
          match.winner_id === match.team2_id 
            ? 'bg-gold text-black font-bold shadow-md' 
            : 'bg-gray-700/50 text-white'
        }`}>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold mr-2">
              2
            </div>
            <span className="font-semibold">{team2?.name || 'TBD'}</span>
          </div>
          
          {isEditing ? (
            <input
              type="number"
              value={score2}
              onChange={(e) => setScore2(e.target.value)}
              className="w-16 px-2 py-1 bg-black/50 text-white rounded text-center border border-gray-500 focus:border-gold"
              min="0"
            />
          ) : (
            <span className="text-xl font-mono font-bold">
              {match.score2 ?? '-'}
            </span>
          )}
        </div>
      </div>

      {/* Host Actions */}
      {isHost && team1 && team2 && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleUpdateScore}
                disabled={loading || !score1 || !score2}
                className="flex-1 py-2 bg-gold text-black font-bold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                {loading ? '💾 Saving...' : '💾 Save Score'}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2 border-2 border-gold text-gold font-semibold rounded-lg hover:bg-gold hover:text-black transition-all duration-300"
            >
              {match.score1 !== null && match.score2 !== null ? '✏️ Edit Score' : '➕ Add Score'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default MatchCard
