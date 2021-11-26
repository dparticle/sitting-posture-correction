import { icon, IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import styles from './index.less';

interface PageHeaderProp {
  leftIcon?: IconProp;
  rightIcon?: IconProp;
  title: string;
  onClickLeft?: () => void;
  onClickRight?: () => void;
}

const PageHeader = (props: PageHeaderProp) => {
  return (
    <div className={styles.row}>
      <div className={styles.left}>
        {props.leftIcon && (
          <div className={styles.btn} onClick={props.onClickLeft}>
            <FontAwesomeIcon className={styles.icon} icon={props.leftIcon} />
          </div>
        )}
      </div>
      <div className={styles.title}>
        <span>{props.title}</span>
      </div>
      <div className={styles.right}>
        {props.rightIcon && (
          <div className={styles.btn} onClick={props.onClickRight}>
            <FontAwesomeIcon className={styles.icon} icon={props.rightIcon} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
