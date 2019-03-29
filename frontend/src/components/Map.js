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
  const [enemyPlayer, setEnemyPlayer] = useState(null);
  const [readyToStart, setReadyToStart] = useState(false);
  const [emptyMap, setEmptyMap] = useState(tempEmptyMap);
  const [ships, setShips] = useState(
    {
      [players[0].id] : cloneDeep(emptyMap),
      [players[1].id] : cloneDeep(emptyMap)
    }
  );
  const [shoots, setShoots] = useState(
    {
      [players[0].id] : cloneDeep(emptyMap),
      [players[1].id] : cloneDeep(emptyMap)
    }
  );
  const [canShoot, setCanShoot] = useState(true);

  const addShip = (isChecked, row, element) => {
    let tempShips = cloneDeep(ships);
    tempShips[currentPlayer.id][row][element] = isChecked;
    setShips(tempShips);
  };

  const shoot = (status, row, element) => {
    if(!canShoot) {
      return false;
    }
    let tempShoots = cloneDeep(shoots);
    tempShoots[currentPlayer.id][row][element] = status;
    setShoots(tempShoots);
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
          isChecked={ships[draftMode ? currentPlayer.id : enemyPlayer.id][row][i]}
          isShoot={shoots[currentPlayer.id][row][i]}
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
    const newCurrentPlayerIndex = currentPlayer === players[1] ? 0 : 1;
    const newEnemyPlayerIndex = newCurrentPlayerIndex === 0 ? 1 : 0;

    setCurrentPlayer(players[
      newCurrentPlayerIndex
    ]);
    setEnemyPlayer(players[
      newEnemyPlayerIndex
    ]);

    setCanShoot(true);
  };

  const startGame = () => {
    switchPlayer();
    setDraftMode(false);
  };

  return (
    <div>
      <div className={styles.gameStatus}>
        Witaj {currentPlayer.name}<br/>
         {draftMode ? 'Proszę rozłożyć statki na mapie' : 'Gra została rozpoczęta, wybierz pole i kliknij dalej'}
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
          <button onClick={switchPlayer}>Ruch kolejnego gracza</button>
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
