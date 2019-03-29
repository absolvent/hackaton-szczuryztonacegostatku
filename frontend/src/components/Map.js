import React, { useState } from 'react';
import styles from './Wrapper.module.css';
import Element from './Element';
import cloneDeep from 'lodash/cloneDeep';

const ROWS = 10;
const ELEMENTS = 10;

const Map = (props) => {
  const players = props.players;
  if(!props.players) {
    return 'brak graczy w pokoju';
  }

  let tempEmptyMap = [];

  for (let i = 0; i < ROWS; i++) {
    let elements = [];
    for (let i = 0; i < ELEMENTS; i++) {
      elements.push(false);
    }

    tempEmptyMap.push(elements);
  }

  const [draftMode, setDraftMode] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState(players[0]);
  const [readyToStart, setReadyToStart] = useState(false);
  const [emptyMap, setEmptyMap] = useState(tempEmptyMap);
  const [ships, setShips] = useState(
    {
      [players[0].name] : cloneDeep(emptyMap),
      [players[1].name] : cloneDeep(emptyMap)
    }
  );
  const [shoots, setShoots] = useState(
    {
      [players[0].name] : cloneDeep(emptyMap),
      [players[1].name] : cloneDeep(emptyMap)
    }
  );
  const [canShoot, setCanShoot] = useState(true);

    //ships[player.name] = cloneDeep(emptyMap);

  const addShip = (isChecked, row, element) => {
    let tempShips = cloneDeep(ships);
    tempShips[currentPlayer.name][row][element] = isChecked;
    setShips(tempShips);

  };

  const shoot = (status, row, element) => {
    let tempShoots = cloneDeep(shoots);
    tempShoots[currentPlayer.name][row][element] = status;
    setShoots(tempShoots);
    console.log(currentPlayer.name);
    setCanShoot(false);
  };

  const renderElements = (row) => {
    const elements = [];

    for (let i = 0; i < ELEMENTS; i++) {
      elements.push(
        <Element
          abc={draftMode ? addShip : shoot}
          row={row}
          element={i}
          draftMode={draftMode}
          isChecked={ships[currentPlayer.name][row][i]}
          isShoot={shoots[currentPlayer.name][row][i]}
        />)
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

  const switchPlayer = () => {
    // console.log(currentPlayer !== players[1] ? 0 : 1);
    setCurrentPlayer(players[
      currentPlayer === players[1] ? 0 : 1
    ]);
    setCanShoot(true);
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
      {!draftMode && !canShoot && (
        <div className={styles.saveButton}>
          <button onClick={switchPlayer}>Nastepny</button>
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
