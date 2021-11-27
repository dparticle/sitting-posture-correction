import React, { useEffect } from 'react';
import { history } from 'umi';

import styles from './index.less';
import { faChevronLeft, faSync } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '@/components/PageHeader';
import F2 from '@antv/f2';
import F2Chart from '@/components/F2Chart';
import StatGridItem from '@/components/StatGridItem';

const StatPage = (props: any) => {
  const dataMin = [
    {
      date: '11-22',
      min: 220,
    },
    {
      date: '11-23',
      min: 110,
    },
    {
      date: '11-24',
      min: 240,
    },
    {
      date: '11-25',
      min: 200,
    },
    {
      date: '11-26',
      min: 180,
    },
    {
      date: '11-27',
      min: 160,
    },
    {
      date: '11-28',
      min: 80,
    },
  ];
  const dataNum = [
    {
      date: '11-22',
      num: 12,
      type: '成功',
    },
    {
      date: '11-22',
      num: 2,
      type: '失败',
    },
    {
      date: '11-23',
      num: 10,
      type: '成功',
    },
    {
      date: '11-23',
      num: 1,
      type: '失败',
    },
    {
      date: '11-24',
      num: 9,
      type: '成功',
    },
    {
      date: '11-24',
      num: 2,
      type: '失败',
    },
    {
      date: '11-25',
      num: 5,
      type: '成功',
    },
    {
      date: '11-25',
      num: 0,
      type: '失败',
    },
    {
      date: '11-26',
      num: 9,
      type: '成功',
    },
    {
      date: '11-26',
      num: 0,
      type: '失败',
    },
    {
      date: '11-27',
      num: 13,
      type: '成功',
    },
    {
      date: '11-27',
      num: 2,
      type: '失败',
    },
    {
      date: '11-28',
      num: 11,
      type: '成功',
    },
    {
      date: '11-28',
      num: 0,
      type: '失败',
    },
  ];

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
      align: 'center',
      itemWidth: 80,
    });
    chart.tooltip({
      custom: true, // 自定义 tooltip 内容框
      onChange: (obj) => {
        const legend = chart.get('legendController').legends.top?.at(0); // 获取 legend
        // console.log('legend', legend);

        const tooltipItems = obj.items;
        const legendItems = legend?.items;
        // console.log('legendItems', legendItems);

        const map: any = {};
        legendItems?.map((item) => {
          map[item.name] = F2.Util.mix({}, item);
        });
        tooltipItems.map((item) => {
          const { name, value } = item;
          if (name && map[name]) {
            map[name].value = value;
          }
        });
        legend?.setItems(Object.values(map));
      },
      onHide: () => {
        const legend = chart.get('legendController').legends.top?.at(0);
        // legend.setItems(chart.getLegendItems().country); // wrong, getLegendItems() undefined
        legend?.setItems(legend?.items);
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

  useEffect(() => {}, []);

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
      <div className={styles.chart}>
        <div className={styles.chartTitle}>近 7 日总时长</div>
        <F2Chart
          onInit={onInitMin}
          width={window.innerWidth - 34}
          height={250}
          data={dataMin}
        />
      </div>
      <div className={styles.chart}>
        <div className={styles.chartTitle}>近 7 日成功 / 失败次数</div>
        <F2Chart
          onInit={onInitNum}
          width={window.innerWidth - 34}
          height={250}
          data={dataNum}
        />
      </div>
    </>
  );
};

export default StatPage;
