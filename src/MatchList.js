import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

function MatchList({ matches, onDeleteMatch, onToggleFeeStatus }) {
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);

  // Function to filter players based on 'unpaid' status
  const getFilteredPlayers = (players) => {
    return players.filter((player) => !showUnpaidOnly || !player.paid);
  };

  // Function to generate and download the PDF
  const generatePDF = (match) => {
    const doc = new jsPDF();
    const date = new Date(match.date).toLocaleDateString();
    const title = `${match.tournament} vs ${match.opponent} (${date})`;

    doc.setFontSize(16);
    doc.text(title, 20, 20);

    // Match details
    doc.setFontSize(12);
    doc.text(`Total Fees: ₹${match.totalFees}`, 20, 30);
    doc.text(`Fees Per Player: ₹${match.feesPerPlayer}`, 20, 40);

    // Player details
    let yPosition = 50;
    getFilteredPlayers(match.players).forEach((player) => {
      doc.text(`${player.name} — ${player.paid ? 'Paid' : 'Unpaid'}`, 20, yPosition);
      yPosition += 10;
    });

    // Save the PDF
    doc.save(`${match.matchId}_match_history.pdf`);
  };

  return (
    <div>
      <h2>Match History</h2>

      <label>
        <input
          type="checkbox"
          checked={showUnpaidOnly}
          onChange={(e) => setShowUnpaidOnly(e.target.checked)}
        />
        Show only <b><u>Unpaid Players</u></b>
      </label>

      {matches.map((match) => (
        <div key={match.matchId} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>
            {match.date} — {match.tournament} vs {match.opponent}
            <button
              onClick={() => onDeleteMatch(match.matchId)}
              style={{ marginLeft: '20px', background: 'red', color: 'white' }}
            >
              Delete Match
            </button>
            <button
              onClick={() => generatePDF(match)}
              style={{ marginLeft: '10px', background: 'green', color: 'white' }}
            >
              Save as PDF
            </button>
          </h3>
          <p>Total Fees: ₹{match.totalFees} | Fees Per Player: ₹{match.feesPerPlayer}</p>

          {/* Render the filtered list of players */}
          <div className="player-list-table">
  {getFilteredPlayers(match.players).map((player, i) => (
    <div className="player-row" key={i}>
      <div className="player-cell">{player.name}</div>
      <div className="player-cell">
        <label>
          <input
            type="checkbox"
            checked={player.paid === true}
            onChange={() => onToggleFeeStatus(match.matchId, i, 'paid')}
          /> Paid
        </label>
      </div>
      <div className="player-cell">
        <label>
          <input
            type="checkbox"
            checked={player.paid === false}
            onChange={() => onToggleFeeStatus(match.matchId, i, 'unpaid')}
          /> Unpaid
        </label>
      </div>
    </div>
  ))}
</div>

        </div>
      ))}
    </div>
  );
}

export default MatchList;
