import { icon, IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import styles from './index.less';

interface IconRoundButtonProp {
  icon: IconProp;
  color: string;
  disabled?: boolean;
  onClick: () => void;
}

const IconRoundButton = (props: IconRoundButtonProp) => {
  return (
    <button className={styles.btn} onClick={props.onClick} disabled={props.disabled || false}>
      <FontAwesomeIcon
        className={styles.icon}
        icon={props.icon}
        style={{ color: props.color, fontSize: '24px' }}
      />
    </button>
  );
};

export default IconRoundButton;
