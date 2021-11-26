import React, { useEffect } from 'react';
import { history } from 'umi';

import styles from './index.less';
import { faChevronLeft, faSync } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '@/components/PageHeader';
import F2 from '@antv/f2';
import F2Chart from '@/components/F2Chart';

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
      <F2Chart onInit={onInit} height={300} data={data}/>
    </>
  );
};

export default StatPage;
