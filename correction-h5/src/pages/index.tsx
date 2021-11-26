import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import mqtt, { MqttClient } from 'mqtt';
import ArcProgress from 'react-arc-progress';

import styles from './index.less';
import {
  faPlay,
  faPause,
  faStop,
  faEdit,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import IconRoundButton from '@/components/IconRoundButton';
import PageHeader from '@/components/PageHeader';

// 若在组件里面，每次更新都为 null
let interval: NodeJS.Timer;
// interval 关闭值仍为上一个计数器，不能直接判空，记录计时器是否关闭
let isClose = false;
const all = 5 * 60 * 1000;
let now = all;
let cnt = 0; // 累计到 1000 时再更新 now

const IndexPage = (props: any) => {
  // mqtt
  const url = 'ws://***:**/mqtt';
  const options = {
    // 认证信息
    clientId: 'correction-h5',
    username: '***',
    password: '***',
  };
  const subscription = {
    topic: 'correction/#',
    qos: 0,
  };
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState('');

  const mqttConnect = (url: string, mqttOption: any) => {
    setConnectStatus('Connecting');
    setClient(mqtt.connect(url, mqttOption));
  };

  useEffect(() => {
    if (client) {
      console.log(client);
      client.on('connect', () => {
        setConnectStatus('Connected');
        // 订阅 correction/# 主题
        // mqttSub(subscription);
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
      client.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        console.log('payload', payload);
      });
    }
  }, [client]);

  const mqttSub = (subscription: any) => {
    if (client) {
      const { topic, qos } = subscription;
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log('Subscribe to topics error', error);
          return;
        }
        console.log('success subscribe');
      });
    }
  };

  const mqttPublish = (context: any) => {
    if (client) {
      const { topic, qos, payload } = context;
      client.publish(topic, payload, { qos }, (error) => {
        if (error) {
          console.log('Publish error: ', error);
        }
      });
    }
  };

  useEffect(() => {
    mqttConnect(url, options);
  }, []);

  // countdown
  const formatTime = (time: number) => {
    const m = Math.floor(time / 1000 / 60);
    const s = Math.floor((time / 1000) % 60);
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  };
  const [progressInfo, setProgressInfo] = useState({
    process: now / all,
    text: formatTime(now),
  });
  const [start, setStart] = useState(false);
  const [pause, setPause] = useState(false);

  const customText = [
    {
      text: progressInfo.text,
      size: '42px',
      color: '#76a4ef',
      font: 'Arial Black',
      x: 125,
      y: 125,
    },
  ];

  const progressConfig = {
    size: 250,
    customText,
    emptyColor: '#ebf4f8',
    fillColor: { gradient: ['#91eae4', '#86a8e7', '#7f7fd5'] },
    arcStart: -90,
    arcEnd: 270,
    thickness: 18,
  };

  // 重置计时器所需的所有参数
  const resetParam = () => {
    now = all;
    cnt = 0;
    isClose = false;
    setPause(false); // 重置暂停
    setProgressInfo({ process: now / all, text: formatTime(now) });
  };

  const handleCountdown = () => {
    if (now <= 0) {
      clearInterval(interval);
      // set 是异步
      setStart(false);
      // while (interval); // 确保 interval 关闭
      return;
    }
    cnt += 10;
    if (cnt === 1000) {
      now -= 1000;
      cnt = 0;
    }
    setProgressInfo({ process: (now - cnt) / all, text: formatTime(now) });
  };

  // 暂停，重新设置计时器
  useEffect(() => {
    if (pause) {
      clearInterval(interval);
      isClose = true;
      console.log('interval', interval);
      console.log('pause success');
    }
    return () => {
      // 如果是结束后的重置暂停，不需要设置定时器，重置参数 isClose 即可
      if (isClose) {
        interval = setInterval(() => {
          handleCountdown();
        }, 10);
        isClose = false;
        console.log('interval', interval);
        console.log('cancel pause success');
      }
    };
  }, [pause]);

  useEffect(() => {
    // 放在外面每次刷新页面后都为 null
    // let interval: NodeJS.Timer;
    if (start) {
      interval = setInterval(() => {
        handleCountdown();
      }, 10);
      isClose = false;
      console.log('interval', interval);
      console.log('start success');
    }
    // 在下一次 effect 函数被调用时或每次组件被注销时或者就会调用，闭包
    return () => {
      if (interval) clearInterval(interval); // 如果中途停止，则关闭计时器
      // 重置
      resetParam();
      console.log('interval', interval);
      console.log('stop success');
    };
  }, [start]);

  return (
    <>
      <div>
        <PageHeader
          title={'健康专注'}
          rightIcon={faChartLine}
          onClickRight={() => history.push('/stat')}
        />
      </div>
      <div className={styles.countdownContainer}>
        <ArcProgress
          className={styles.circleProgress}
          progress={progressInfo.process}
          {...progressConfig}
        />
      </div>
      <div className={styles.controlContainer}>
        {start ? (
          <>
            {pause ? (
              // 取消暂停按钮
              <IconRoundButton
                icon={faPlay}
                color={'#2ecc71'}
                onClick={() => setPause(!pause)}
              />
            ) : (
              // 暂停按钮
              <IconRoundButton
                icon={faPause}
                color={'#3498db'}
                onClick={() => setPause(!pause)}
              />
            )}
            {/* 停止按钮 */}
            <IconRoundButton
              icon={faStop}
              color={'#e74c3c'}
              onClick={() => setStart(!start)}
            />
          </>
        ) : (
          <>
            {/* 开始专注按钮 */}
            <IconRoundButton
              icon={faPlay}
              color={'#2ecc71'}
              onClick={() => setStart(!start)}
            />
            {/* 编辑按钮 */}
            <IconRoundButton
              icon={faEdit}
              color={'#34495e'}
              onClick={() => console.log('编辑总时间')}
            />
          </>
        )}
      </div>
    </>
  );
};

export default IndexPage;
