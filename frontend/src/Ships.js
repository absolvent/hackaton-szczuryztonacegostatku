import React from 'react';
import Map from './components/Map';

const players = [
  {
    id: 1,
    name: 'Marcin',
    isReady: false
  },
  {
    id: 2,
    name: 'Mateusz',
    isReady: false
  }
];

const Ships = () => {
  return (
    <div>
      <Map players={players}/>
    </div>
  );
};

export default Ships;
