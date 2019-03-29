import React, { useState } from 'react';
import styles from './Wrapper.module.css';
import Element from './Element';

const ROWS = 10;
const ELEMENTS = 10;

const Map = (props) => {
  const players = props.players;
  if(!props.players) {
    return 'brak graczy w pokoju';
  }

  const [draftMode, setDraftMode] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState(players[0]);
  const [readyToStart, setReadyToStart] = useState(false);

  const emptyMap = [];
  const ships = [];

  for (let i = 0; i < ROWS; i++) {
    let elements = [];
    for (let i = 0; i < ELEMENTS; i++) {
      elements.push(false);
    }

    emptyMap.push(elements);
  }

  players.map(player => (
    ships[player.name] = emptyMap
  ));

  const addShip = (isChecked, row, element) => {
    console.log(ships[currentPlayer.name]);
    ships[currentPlayer.name][row][element] = isChecked;
  };

  const renderElements = (row) => {
    const elements = [];

    for (let i = 0; i < ELEMENTS; i++) {
      elements.push(<Element abc={addShip} row={row} element={i} draftMode={draftMode}/>)
    }

    return elements;
  };

  const renderRows = () => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
      rows.push(<tr>{renderElements(i)}</tr>)
    }

    return rows;
  };

  const nextPlayer = () => {
    if(currentPlayer !== players[1]) {
      setCurrentPlayer(players[1]);

      setReadyToStart(true);
    }
  };

  const startGame = () => {
    setDraftMode(false);
  };

  return (
    <div>
      <div className={styles.gameStatus}>
        Witaj {currentPlayer.name}<br/>
         {draftMode ? 'Proszę rozłożyć statki na mapie' : 'Gra rozpoczęta'}
      </div>
      {draftMode && (
        <div className={styles.saveButton}>
          {readyToStart ? (
            <button onClick={startGame}>Rozpocznij grę</button>
          ) : (
            <button onClick={nextPlayer}>Kolejny gracz ({players[1].name})</button>
          )}
        </div>
      )}
      <div className={styles.map}>
        <table className={styles.water} border="1">
          {renderRows()}
        </table>
      </div>
    </div>
  )
};

export default Map;
