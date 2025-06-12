import React, { useState, useEffect } from 'react';

function MatchForm({ onAddMatch, availablePlayers }) {
  const [tournament, setTournament] = useState('');
  const [date, setDate] = useState('');
  const [opponent, setOpponent] = useState('');
  const [totalFees, setTotalFees] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [feesPerPlayer, setFeesPerPlayer] = useState(0);

  useEffect(() => {
    if (selectedPlayers.length > 0 && totalFees) {
      setFeesPerPlayer((parseFloat(totalFees) / selectedPlayers.length).toFixed(2));
    } else {
      setFeesPerPlayer(0);
    }
  }, [selectedPlayers, totalFees]);

  const togglePlayer = (name) => {
    setSelectedPlayers((prev) => {
      const isSelected = prev.find((p) => p.name === name);
      if (isSelected) {
        return prev.filter((p) => p.name !== name);
      } else {
        return [...prev, { name, paid: false }];
      }
    });
  };

  const removePlayer = (index) => {
    const updated = [...selectedPlayers];
    updated.splice(index, 1);
    setSelectedPlayers(updated);
  };

  const handlePaidChange = (index, value) => {
    const updated = [...selectedPlayers];
    updated[index].paid = value === 'paid';
    setSelectedPlayers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMatch({
      matchId: Date.now().toString(),
      tournament,
      date,
      opponent,
      totalFees,
      feesPerPlayer,
      players: selectedPlayers,
    });
    setTournament('');
    setDate('');
    setOpponent('');
    setTotalFees('');
    setFeesPerPlayer(0);
    setSelectedPlayers([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Match</h2>
      <input
        type="text"
        placeholder="Tournament Name"
        value={tournament}
        onChange={(e) => setTournament(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Opponent"
        value={opponent}
        onChange={(e) => setOpponent(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Total Match Fees"
        value={totalFees}
        onChange={(e) => setTotalFees(e.target.value)}
        required
      />
      <p>Fees Per Player: ₹{feesPerPlayer}</p>

      <h3>Select Players</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {availablePlayers.map((name) => (
          <label key={name}>
            <input
              type="checkbox"
              checked={selectedPlayers.some((p) => p.name === name)}
              onChange={() => togglePlayer(name)}
            />{' '}
            {name}
          </label>
        ))}
      </div>

      {selectedPlayers.length > 0 && (
        <>
          <h3>Fee Status</h3>
          {selectedPlayers.map((player, i) => (
            <div key={i}>
              <strong>{player.name}</strong>
              <label style={{ marginLeft: '10px' }}>
                <input
                  type="checkbox"
                  checked={player.paid === true}
                  onChange={() => handlePaidChange(i, 'paid')}
                /> Paid
              </label>
              <label style={{ marginLeft: '10px' }}>
                <input
                  type="checkbox"
                  checked={player.paid === false}
                  onChange={() => handlePaidChange(i, 'unpaid')}
                /> Unpaid
              </label>
              <button style={{ marginLeft: '10px' }} type="button" onClick={() => removePlayer(i)}>
                ❌ Remove
              </button>
            </div>
          ))}
        </>
      )}

      <button type="submit">Save Match</button>
    </form>
  );
}

export default MatchForm;
