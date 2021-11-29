import React, { useEffect, useState } from 'react';
import { history } from 'umi';

import styles from './index.less';
import { faChevronLeft, faSync } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '@/components/PageHeader';
import F2 from '@antv/f2';
import F2Chart from '@/components/F2Chart';
import StatGridItem from '@/components/StatGridItem';
import request from 'umi-request';

const StatPage = (props: any) => {
  const [dataToday, setDataToday] = useState<
    { time: number; okNum: number; failNum: number } | undefined
  >(undefined);
  const [dataTotal, setDataTotal] = useState<
    { time: number; okNum: number; failNum: number } | undefined
  >(undefined);
  const [dataMin, setDataMin] = useState<
    { date: string; min: number }[] | undefined
  >(undefined);
  const [dataNum, setDataNum] = useState<
    { date: string; num: number; type: string }[] | undefined
  >(undefined);

  const onInitMin = (chart: F2.Chart) => {
    chart.tooltip({
      showCrosshairs: true,
    });
    chart.scale({
      date: {
        range: [0, 1],
      },
      min: {
        tickCount: 5,
        min: 0,
      },
    });
    chart.axis('date', {
      label: function label(text, index, total) {
        const textCfg: any = {};
        if (index === 0) {
          textCfg.textAlign = 'left';
        } else if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      },
    });
    chart
      .area()
      .position('date*min')
      .color('l(90) 0:#1890FF 1:#f7f7f7')
      .shape('smooth');
    chart
      .line()
      .position('date*min')
      .color('l(90) 0:#1890FF 1:#f7f7f7')
      .shape('smooth');
    chart.render();
  };

  const onInitNum = (chart: F2.Chart) => {
    chart.scale({
      date: {
        range: [0, 1],
      },
      num: {
        tickCount: 5,
        min: 0,
      },
    });
    // 显示 legend
    chart.legend('type', {
      // position: 'bottom',
      align: 'right',
      itemWidth: 50,
    });
    chart.axis('date', {
      label: function label(text, index, total) {
        const textCfg: any = {};
        if (index === 0) {
          textCfg.textAlign = 'left';
        } else if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      },
    });
    chart
      .line()
      .position('date*num')
      .color('type', (type: string) => {
        if (type === '成功') {
          return '#2ecc71';
        }
        return '#e74c3c';
      });
    chart
      .point()
      .position('date*num')
      .color('type', (type: string) => {
        if (type === '成功') {
          return '#2ecc71';
        }
        return '#e74c3c';
      })
      .style('type', {
        lineWidth: 1,
        fill: '#fff',
        stroke: function stroke(type) {
          if (type === '成功') {
            return '#2ecc71';
          }
          return '#e74c3c';
        },
      });
    chart.render();
  };

  const sync = () => {
    request
      .post('/v1/stat/get_today')
      .then((res: any) => {
        // console.log('dataToday', res);
        setDataToday(res);
      })
      .catch((err: any) => {
        console.error('get dataToday error', err);
      });
    request
      .post('/v1/stat/get_total')
      .then((res: any) => {
        // console.log('dataTotal', res);
        setDataTotal(res);
      })
      .catch((err: any) => {
        console.error('get dataTotal error', err);
      });
    request
      .post('/v1/stat/get_seven_time')
      .then((res: any) => {
        // console.log('dataMin', res);
        setDataMin(res);
      })
      .catch((err: any) => {
        console.error('get dataMin error', err);
      });
    request
      .post('/v1/stat/get_seven_num')
      .then((res: any) => {
        // console.log('dataNum', res);
        setDataNum(res);
      })
      .catch((err: any) => {
        console.error('get dataNum error', err);
      });
  };

  useEffect(() => {
    sync();
    return () => {
      console.log('componentWillUnMount');
    };
  }, []);

  return (
    <>
      <PageHeader
        title={'统计'}
        leftIcon={faChevronLeft}
        onClickLeft={() => history.goBack()}
        rightIcon={faSync}
        onClickRight={() => sync()}
      />
      <div className={styles.statGrid}>
        {dataToday && (
          <>
            <StatGridItem
              num={dataToday.time}
              unit={'min'}
              title={'总时长'}
              desc={'今日'}
            />
            <StatGridItem
              num={dataToday.okNum}
              numColor={'#2ecc71'}
              unit={'time'}
              title={'成功次数'}
              desc={'今日'}
            />
            <StatGridItem
              num={dataToday.failNum}
              numColor={'#e74c3c'}
              unit={'time'}
              title={'失败次数'}
              desc={'今日'}
            />
          </>
        )}
        {dataTotal && (
          <>
            <StatGridItem num={dataTotal.time} unit={'hour'} title={'总时长'} />
            <StatGridItem
              num={dataTotal.okNum}
              numColor={'#2ecc71'}
              unit={'time'}
              title={'成功次数'}
            />
            <StatGridItem
              num={dataTotal.failNum}
              numColor={'#e74c3c'}
              unit={'time'}
              title={'失败次数'}
            />
          </>
        )}
      </div>
      <div className={styles.chart}>
        <div className={styles.chartTitle}>近 7 日总时长</div>
        {dataMin && (
          <F2Chart
            onInit={onInitMin}
            width={window.innerWidth - 34}
            height={250}
            data={dataMin}
          />
        )}
      </div>
      <div className={styles.chart}>
        <div className={styles.chartTitle}>近 7 日成功 / 失败次数</div>
        {dataNum && (
          <F2Chart
            onInit={onInitNum}
            width={window.innerWidth - 34}
            height={250}
            data={dataNum}
          />
        )}
      </div>
    </>
  );
};

export default StatPage;
