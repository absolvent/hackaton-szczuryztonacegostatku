import React, { useState } from 'react';
import styles from './Wrapper.module.css';

const STATUS_WATER = 0;
const STATUS_MISS = 1;
const STATUS_HIT = 2;

const Element = (props) => {
  //const [isChecked, setIsChecked] = useState(false);
  const [isBoat, setIsBoat] = useState(false);

  const elementClickHandler = () => {
    if (props.isShoot) {
      return;
    }
    let status = false;
    if(props.draftMode) {
      // tryb draftu
      status = !props.isChecked;
    } else {
      // tryb gry
        // setStatus(props.isChecked ? STATUS_HIT : STATUS_MISS);
      status = props.isChecked ? STATUS_HIT : STATUS_MISS;
    }

    props.abc(status, props.row, props.element);
  };

  const renderStatus = () => {
    if(props.draftMode) {
      if(props.isChecked) {
        return styles.hit;
      }
    } else {
      if(props.isShoot && !props.isChecked) {
        console.log('pudło');
        return styles.miss;
      } else if (props.isShoot && props.isChecked) {
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
