import React, { useState, useEffect } from 'react';
import MatchForm from './MatchForm';
import MatchList from './MatchList';

const DEFAULT_PLAYERS = [
  'Abhijeet','Abhinash', 'Amit', 'Aniket', 'Anmol', 'Anmol Goel',
  'Anurag', 'Anurag Bist','Bisnoi', 'Harry', 'Harshit Pant',
  'Harshit Sharma', 'Rupinder', 'Kuldeep', 'Mithun', 'Monty', 'Nitesh', 'Nittoo', 'Peeyush', 'Prabhash',
  'Pranav', 'Puneet', 'Lenka', 'Rohit', 'Samal', 'Sahil', 'Shishir', 'Shivam Pahuja', 'Shivam Singh',
  'Shivraj', 'Shobhit', 'SK', 'SS', 'Swain','Tahir'
];

function App() {
  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('matchData');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastDeletedMatch, setLastDeletedMatch] = useState(null);

  const addMatch = (match) => {
    const updatedMatches = [...matches, match];
    setMatches(updatedMatches);
    localStorage.setItem('matchData', JSON.stringify(updatedMatches));
  };

  const deleteMatch = (matchId) => {
    const matchToDelete = matches.find((m) => m.matchId === matchId);
    const updated = matches.filter((match) => match.matchId !== matchId);
    setMatches(updated);
    localStorage.setItem('matchData', JSON.stringify(updated));
    setLastDeletedMatch(matchToDelete);
  };

  const undoDelete = () => {
    if (lastDeletedMatch) {
      const updated = [...matches, lastDeletedMatch];
      setMatches(updated);
      localStorage.setItem('matchData', JSON.stringify(updated));
      setLastDeletedMatch(null);
    }
  };

  const toggleFeeStatus = (matchId, playerIndex, status) => {
    const updatedMatches = matches.map((match) => {
      if (match.matchId === matchId) {
        const updatedPlayers = [...match.players];
        updatedPlayers[playerIndex].paid = status === 'paid';
        return { ...match, players: updatedPlayers };
      }
      return match;
    });
    setMatches(updatedMatches);
    localStorage.setItem('matchData', JSON.stringify(updatedMatches));
  };

  return (
    <div className="App">
      <h1>Cricket Match Fee Tracker</h1>
      <MatchForm onAddMatch={addMatch} availablePlayers={DEFAULT_PLAYERS} />
      <MatchList
        matches={matches}
        onDeleteMatch={deleteMatch}
        onToggleFeeStatus={toggleFeeStatus}
      />

      {lastDeletedMatch && (
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={undoDelete}
            style={{ backgroundColor: 'orange', color: 'white', padding: '8px 16px', border: 'none' }}
          >
            Undo Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
