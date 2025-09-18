import React, { useMemo } from 'react';
import MatchCard from './MatchCard';

const labelFor = (roundNumber, totalRounds) => {
  const r = Number(roundNumber);
  if (r === totalRounds) return 'FINAL';
  if (r === totalRounds - 1) return 'CONFERENCE FINALS';
  if (r === totalRounds - 2) return 'CONF. SEMIFINALS';
  return 'FIRST ROUND';
};

const Bracket = ({ matches, teams, isHost, onMatchUpdate }) => {
  // group by round
  const byRound = useMemo(() => {
    const m = {};
    for (const match of matches) {
      (m[match.round] ||= []).push(match);
    }
    // stable sort by match_idx for layout
    for (const k of Object.keys(m)) m[k].sort((a,b)=>a.match_idx-b.match_idx);
    return m;
  }, [matches]);

  const rounds = useMemo(
    () => Object.keys(byRound).map(Number).sort((a,b)=>a-b),
    [byRound]
  );

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px] xl:min-w-full flex gap-10">
        {rounds.map((round, idx) => (
          <div key={round} className="flex-1">
            <div className="mb-3 text-center">
              <span className="inline-block rounded-full border border-primary-gold/60 px-3 py-1 text-[10px] tracking-widest text-primary-gold">
                {labelFor(round, rounds.length)}
              </span>
            </div>

            {/* column */}
            <div className="flex flex-col">
              {byRound[round].map((match, i) => {
                // create visual breathing room between series like the NBA graphic
                const blockGap = Math.pow(2, idx);               // grows each round
                const marginTop = i > 0 && i % 1 === 0 ? (blockGap * 6) : 0; // tweak 6 -> vertical rhythm
                return (
                  <div key={match.id} style={{ marginTop }}>
                    <MatchCard
                      match={match}
                      teams={teams}
                      isHost={isHost}
                      onMatchUpdate={onMatchUpdate}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bracket;
