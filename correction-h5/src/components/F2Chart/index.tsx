import React, { useState } from 'react';
import F2 from '@antv/f2';

interface IProps {
  onInit: (chart: F2.Chart) => void;
  data: any[];
  score?: any;
  width?: number;
  height?: number;
  style?: React.CSSProperties | undefined;
}

const F2Chart: React.FC<IProps> = (props) => {
  const {
    style,
    width = window.innerWidth,
    height = window.innerHeight,
    onInit,
    data,
    score = {},
  } = props;

  const chartRef = React.useRef<any>();

  React.useEffect(() => {
    const config = {
      id: 'F2Chart',
      width: width,
      height: height,
      pixelRatio: window.devicePixelRatio,
    };
    const chart = new F2.Chart(config);
    if (chart) {
      chartRef.current = chart;
      onInit(chart);
    }
    return () => {
      chartRef.current = null;
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  React.useEffect(() => {
    if (Array.isArray(data) && chartRef.current) {
      chartRef.current.changeData(data);
    }
  }, [data]);

  React.useEffect(() => {
    if (score && chartRef.current) {
      // console.log('score', score);
      chartRef.current.source(data, score);
      chartRef.current.repaint();
    }
  }, [score]);

  return <canvas id="F2Chart" style={style} />;
};

export default F2Chart;
