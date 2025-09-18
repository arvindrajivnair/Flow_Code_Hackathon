import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { auth } from '../utils/auth';
import Bracket from '../components/Bracket';

const BracketView = () => {
  const { id } = useParams();
  const [tournamentData, setTournamentData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTournamentData();
    loadUserData();
  }, [id]);

  const loadTournamentData = async () => {
    try {
      const response = await api.getTournament(id);
      setTournamentData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load tournament');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    if (auth.isAuthenticated()) {
      try {
        const response = await api.getMe();
        setUser(response.data);
      } catch (err) {
        console.error('Failed to load user data:', err);
      }
    }
  };

  const handleMatchUpdate = (updatedMatch) => {
    setTournamentData(prev => ({
      ...prev,
      matches: prev.matches.map(match => 
        match.id === updatedMatch.id ? updatedMatch : match
      )
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-primary-gold text-xl">Loading tournament...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="bg-red-500 text-white p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!tournamentData) {
    return (
      <div className="text-center">
        <div className="text-gray-400">Tournament not found</div>
      </div>
    );
  }

  const { tournament, teams, matches } = tournamentData;
  const isHost = user?.role === 'host';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary-gold">
          {tournament.name}
        </h1>
        <p className="text-gray-400 capitalize mt-1">
          Sport: {tournament.sport}
        </p>
        <p className="text-gray-400 mt-1">
          Teams: {teams.length} | Matches: {matches.length}
        </p>
        {!isHost && (
          <p className="text-primary-gold-light mt-2 text-sm">
            👁️ Viewing as spectator - scores update live
          </p>
        )}
        {isHost && (
          <p className="text-primary-gold mt-2 text-sm">
            🏆 Host mode - click matches to update scores
          </p>
        )}
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">No bracket generated yet</div>
          {isHost && (
            <p className="text-sm text-gray-500">
              Add teams and generate bracket from the tournament creation page
            </p>
          )}
        </div>
      ) : (
        <Bracket
          matches={matches}
          teams={teams}
          isHost={isHost}
          onMatchUpdate={handleMatchUpdate}
        />
      )}
    </div>
  );
};

export default BracketView;
