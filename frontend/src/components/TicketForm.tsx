// components/TicketForm.tsx
import React, { useState } from 'react';

const TicketForm: React.FC = () => {
  const [vatin, setVatin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [qrCode, setQrCode] = useState('');  // Za pohranu generiranog QR koda
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/tickets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vatin, firstName, lastName }),
      });

      if (!response.ok) {
        throw new Error('Error creating ticket');
      }

      const data = await response.json();
      setQrCode(data.qrCode);  // Spremi QR kod
      setError('');
    } catch (error) {
      setError('Greška pri generiranju ulaznice. Provjerite podatke.');
    }
  };

  return (
    <div>
      <h2>Generiraj Ulaznicu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>OIB:</label>
          <input
            type="text"
            value={vatin}
            onChange={(e) => setVatin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Ime:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prezime:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Generiraj Ulaznicu</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {qrCode && (
        <div>
          <h3>Tvoj QR kod:</h3>
          <img src={qrCode} alt="QR Code" />  {/* Prikaz QR koda */}
        </div>
      )}
    </div>
  );
};

export default TicketForm;
