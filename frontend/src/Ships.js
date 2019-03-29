import React from 'react';
import Map from './components/Map';

const players = [
  {
    id: 1,
    name: 'Marcin',
    score: 0
  },
  {
    id: 2,
    name: 'Mateusz',
    score: 0
  }
];

// TODO zabezpieczenie aby gracz przed rozpoczęciem gry zaznaczył kilka swoich statków
// TODO dodać efekt na klikniecie w pole mapy (trafienie statku, puste pole)
const Ships = () => {
  return (
    <div>
      <Map players={players}/>
    </div>
  );
};

export default Ships;
