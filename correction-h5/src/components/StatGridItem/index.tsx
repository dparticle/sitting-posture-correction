import React from 'react';

import styles from './index.less';

interface StatGridItemProp {
  num: number;
  numColor?: string;
  unit: string;
  title: string;
  desc?: string;
}

const StatGridItem = (props: StatGridItemProp) => {
  return (
    <div className={styles.container}>
      <div>
        <span
          className={styles.num}
          style={{ color: props.numColor || '#2c3e50' }}
        >
          {props.num}
        </span>
        <span className={styles.unit}> {props.unit}</span>
      </div>
      <span className={styles.title}>{props.title}</span>
      {props.desc && <span className={styles.desc}>（{props.desc}）</span>}
    </div>
  );
};

export default StatGridItem;
