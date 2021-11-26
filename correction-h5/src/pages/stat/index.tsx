import React, { useEffect } from 'react';
import { history } from 'umi';

import styles from './index.less';
import { faChevronLeft, faSync } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '@/components/PageHeader';
import F2 from '@antv/f2';
import F2Chart from '@/components/F2Chart';
import StatGridItem from '@/components/StatGridItem';

const StatPage = (props: any) => {
  const data = [
    { genre: 'Sports', sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action', sold: 120 },
    { genre: 'Shooter', sold: 350 },
    { genre: 'Other', sold: 150 },
  ];

  const onInit = (chart: F2.Chart) => {
    chart.interval().position('genre*sold').color('genre');
    chart.render();
  };


  useEffect(() => {
  }, []);

  return (
    <>
      <PageHeader
        title={'统计'}
        leftIcon={faChevronLeft}
        onClickLeft={() => history.goBack()}
        rightIcon={faSync}
        onClickRight={() => console.log('resync')}
      />
      <div className={styles.statGrid}>
        <StatGridItem num={230} unit={'min'} title={'总时长'} desc={'今日'} />
        <StatGridItem
          num={12}
          numColor={'#2ecc71'}
          unit={'time'}
          title={'成功次数'}
          desc={'今日'}
        />
        <StatGridItem
          num={2}
          numColor={'#e74c3c'}
          unit={'time'}
          title={'失败次数'}
          desc={'今日'}
        />
        <StatGridItem num={230} unit={'min'} title={'总时长'} />
        <StatGridItem
          num={12}
          numColor={'#2ecc71'}
          unit={'time'}
          title={'成功次数'}
        />
        <StatGridItem
          num={2}
          numColor={'#e74c3c'}
          unit={'time'}
          title={'失败次数'}
        />
      </div>
      <F2Chart onInit={onInit} height={300} data={data} />
    </>
  );
};

export default StatPage;
