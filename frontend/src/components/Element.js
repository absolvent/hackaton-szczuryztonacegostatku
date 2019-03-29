import React, { useState } from 'react';
import styles from './Wrapper.module.css';

const STATUS_WATER = 0;
const STATUS_MISS = 1;
const STATUS_HIT = 2;

const Element = (props) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isBoat, setIsBoat] = useState(false);
  const [status, setStatus] = useState(false);

  const elementClickHandler = () => {
    console.log('element click handler');
    if(props.draftMode) {
      // tryb draftu
      setIsChecked(!isChecked);
    } else {
      // tryb gry
        setStatus(isChecked ? STATUS_HIT : STATUS_MISS);
    }

    props.abc(!isChecked, props.row, props.element);
  };

  const renderStatus = () => {
    if(props.draftMode) {
      if(isChecked) {
        return styles.hit;
      }
    } else {
      if(status === STATUS_MISS) {
        console.log('pudło');
        return styles.miss;
      } else if (status === STATUS_HIT) {
        console.log('statek trafiony');
        return styles.hit;
      }
    }
  };

  return (
    <td onClick={elementClickHandler} className={renderStatus()}/>
  )
};

export default Element;
