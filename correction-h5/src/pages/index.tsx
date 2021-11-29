import React, { useEffect, useState, useRef } from 'react';
import { history } from 'umi';
import mqtt, { MqttClient } from 'mqtt';
import ArcProgress from 'react-arc-progress';

import styles from './index.less';
import {
  faPlay,
  faPause,
  faStop,
  faEdit,
  faTimes,
  faCheck,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import IconRoundButton from '@/components/IconRoundButton';
import PageHeader from '@/components/PageHeader';

// 若在组件里面，每次更新都为 null
let interval: NodeJS.Timer;
// interval 关闭值仍为上一个计数器，不能直接判空，记录计时器是否关闭
let isClose = false;
let total = parseInt(localStorage.getItem('min') || '5') * 60 * 1000;
let now = total;
let cnt = 0; // 累计到 1000 时再更新 now
// 连接设备延时器
let timeout: NodeJS.Timeout;

const IndexPage = (props: any) => {
  // mqtt
  const url = 'ws://***:**/mqtt';
  const options = {
    // 认证信息
    // TODO 多个相同 client id 连接导致不断重连
    clientId: 'correction-h5',
    username: '***',
    password: '***',
  };
  const subscription = {
    topic: 'correction/esp8266',
    qos: 0,
  };
  const pubConnContext = {
    topic: 'correction/h5',
    qos: 0,
  };
  const pubRecordContext = {
    topic: 'correction/record',
    qos: 0,
  };
  const [client, setClient] = useState<MqttClient | null>(null);
  const [subLock, setSubLock] = useState(false);
  const [connectStatus, setConnectStatus] = useState({
    color: '#bdc3c7', // 灰色
    text: '未连接服务器',
    isConnect: false,
    btnText: '连接',
  });
  // countdown
  const formatTime = (time: number) => {
    const m = Math.floor(time / 1000 / 60);
    const s = Math.floor((time / 1000) % 60);
    return {
      min: m < 10 ? '0' + m : m.toString(),
      remain: ':' + (s < 10 ? '0' + s : s),
    };
  };
  const progressConfig = {
    size: 250,
    emptyColor: '#ebf4f8',
    fillColor: { gradient: ['#91eae4', '#86a8e7', '#7f7fd5'] },
    arcStart: -90,
    arcEnd: 270,
    thickness: 18,
  };
  const [progressInfo, setProgressInfo] = useState({
    process: now / total,
    text: formatTime(now),
  });
  const [start, setStart] = useState(false);
  const [pause, setPause] = useState(false);
  const [edit, setEdit] = useState(false);
  const [inputMin, setInputMin] = useState(progressInfo.text.min);
  const [inputWidth, setInputWidth] = useState(56);
  const minRef = useRef<any>(); // 获取分钟的宽度，以确定编辑框，current 后即拿到 dom 元素

  // mqtt functions
  const mqttConnect = (url: string, mqttOption: any) => {
    console.log('Connecting');
    setClient(mqtt.connect(url, mqttOption));
  };

  const mqttSub = (subscription: any) => {
    if (client) {
      const { topic, qos } = subscription;
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log('Subscribe to topics error', error);
          setConnectStatus({
            color: '#e74c3c',
            text: '订阅失败', // 红色
            isConnect: false,
            btnText: '订阅',
          });
          setSubLock(false);
          return;
        }
        // 订阅成功
        console.log('success subscribe');
        // setConnectStatus({
        //   color: '#f39c12', // 黄色
        //   text: '已订阅',
        //   isConnect: false,
        //   btnText: '取消订阅',
        // });
        pubConnectDevice(); // 自动连接设备
        setSubLock(false);
      });
    }
  };

  const mqttUnSub = (subscription: any) => {
    if (client) {
      const { topic } = subscription;
      client.unsubscribe(topic, (error: any) => {
        if (error) {
          console.log('Unsubscribe error', error);
          setConnectStatus({
            color: '#e74c3c',
            text: '取消订阅失败', // 红色
            isConnect: false,
            btnText: '取消订阅',
          });
          setSubLock(false);
          return;
        }
        // 取消订阅成功
        console.log('success cancel subscribe');
        setConnectStatus({
          color: '#f39c12', // 黄色
          text: '未订阅',
          isConnect: false,
          btnText: '订阅',
        });
        setSubLock(false);
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

  const mqttDisconnect = () => {
    if (client) {
      client.end();
      setClient(null);
    }
  };

  const pubConnectDevice = () => {
    setSubLock(true);
    clearTimeout(timeout);
    mqttPublish({ ...pubConnContext, payload: 'connect' });
    setConnectStatus({
      color: '#f39c12', // 黄色
      text: '连接设备中',
      isConnect: false,
      btnText: '连接...',
    });
    // 4 秒后判断是否连接成功
    timeout = setTimeout(() => {
      setConnectStatus({
        color: '#e74c3c', // 红色
        text: '连接设备失败',
        isConnect: false,
        btnText: '重连',
      });
    }, 4000);
    setSubLock(false);
  };

  const handleSub = () => {
    if (!subLock) {
      setSubLock(true); // 防止再次点击订阅
      // console.log('btnText', connectStatus.btnText);

      switch (connectStatus.btnText) {
        case '连接':
          mqttConnect(url, options);
          break;
        case '断开连接':
          console.log('success disconnect device');
          // 断开连接直接取消订阅
          mqttUnSub(subscription);
          setSubLock(false);
          // 不存在断开服务器
          // if (connectStatus.isConnect) {
          //   setConnectStatus({
          //     color: '#f39c12', // 黄色
          //     text: '未连接设备',
          //     isConnect: false,
          //     btnText: '重连',
          //   });
          // } else {
          //   mqttDisconnect();
          // }
          break;
        case '重连':
          pubConnectDevice();
          break;
        case '订阅':
          mqttSub(subscription);
          break;
        case '取消订阅':
          mqttUnSub(subscription);
          break;
        default:
          console.log('unknown btn onClick event');
          break;
      }
    }
  };

  // countdown functions
  // 重置计时器所需的所有参数
  const resetParam = () => {
    now = total;
    cnt = 0;
    isClose = false;
    setPause(false); // 重置暂停
    setProgressInfo({ process: now / total, text: formatTime(now) });
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
    setProgressInfo({ process: (now - cnt) / total, text: formatTime(now) });
  };

  const handleChange = (event: any) => {
    setInputMin(event.target.value);
  };

  // 更改专注总时间
  const editTotal = () => {
    // fix empty input
    if (
      !(typeof inputMin === 'undefined' || inputMin === null || inputMin === '')
    ) {
      total = parseInt(inputMin) * 60 * 1000;
      now = total;
      localStorage.setItem('min', inputMin);
      setProgressInfo({ process: (now - cnt) / total, text: formatTime(now) });
    }
    setEdit(!edit);
  };

  // first useEffect
  useEffect(() => {
    setSubLock(true);
    mqttConnect(url, options);
    // 所有的 useEffect 会在 componentWillUnMount 再运行一次，不能在卸载组件后再 setState，会内存泄漏，因此不推荐使用返回函数方法
    return () => {};
  }, []);

  // mqtt useEffect
  // useEffect(() => {
  //   console.log('subLock', subLock);
  // }, [subLock]);

  useEffect(() => {
    if (client) {
      console.log(client);
      client.on('connect', () => {
        console.log('Connected');
        setConnectStatus({
          color: '#f39c12', // 黄色
          text: '已连接服务器',
          isConnect: false,
          btnText: '订阅',
        });
        mqttSub(subscription); // 自动订阅
        setSubLock(false);
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
        setClient(null);
        setConnectStatus({
          color: '#e74c3c', // 红色
          text: '连接错误',
          isConnect: false,
          btnText: '连接',
        });
        setSubLock(false);
      });
      client.on('reconnect', () => {
        setSubLock(true);
        console.log('Reconnecting');
      });
      client.on('message', (topic, message: any) => {
        const payload = { topic, message: message.toString() };
        console.log('payload', payload);
        const msgObj = JSON.parse(message);
        // console.log('msgObj', msgObj);
        // 收到消息逻辑规则
        if (topic === 'correction/esp8266') {
          switch (msgObj.status) {
            case 'start':
              console.log('start');
              break;
            case 'fail':
              console.log('fail');
              break;
            case 'connected':
              clearTimeout(timeout);
              setConnectStatus({
                color: '#2ecc71', // 绿色
                text: '已连接设备',
                isConnect: true,
                btnText: '断开连接',
              });
              console.log('success connect device');
              break;
            default:
              console.log('unknown esp8266 status');
          }
        }
      });
    }
  }, [client]);

  // countdown useEffect
  // 暂停，重新设置计时器
  useEffect(() => {
    if (pause) {
      clearInterval(interval);
      isClose = true;
      console.log('interval', interval);
      console.log('pause success');
    } else {
      // 如果是结束后的重置暂停，不需要设置定时器，重置参数 isClose 即可
      if (isClose) {
        interval = setInterval(() => {
          handleCountdown();
        }, 10);
        isClose = false;
        console.log('interval', interval);
        console.log('cancel pause success');
      }
    }
    return () => {};
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
    } else {
      if (interval) clearInterval(interval); // 如果中途停止，则关闭计时器
      // 重置
      setTimeout(() => {
        resetParam();
      }, 50);
      console.log('interval', interval);
      console.log('stop success');
    }
    // 在下一次 effect 函数被调用时或每次组件被注销时或者就会调用，闭包，不推荐！！！
    return () => {};
  }, [start]);

  return (
    <>
      {/* 导航栏 */}
      <div>
        <PageHeader
          title={'健康专注'}
          rightIcon={faChartLine}
          onClickRight={() => {
            if (start) {
              console.log("can't push stat page because of focusing");
            } else {
              // 解决重复连接问题
              mqttDisconnect(); //FIXME failed: Close received after close
              history.push('/stat');
            }
          }}
        />
      </div>
      {/* mqtt 状态 */}
      <div className={styles.mqttContainer}>
        <div className={styles.mqttStatus}>
          <div
            className={styles.dot}
            style={{ backgroundColor: connectStatus.color }}
          ></div>
          <span className={styles.statusText}>{connectStatus.text}</span>
        </div>
        <button className={styles.mqttBtn} onClick={handleSub} disabled={start}>
          {connectStatus.btnText}
        </button>
      </div>
      {/* 倒计时环形进度条 */}
      <div className={styles.countdownContainer}>
        <ArcProgress
          className={styles.circleProgress}
          progress={progressInfo.process}
          {...progressConfig}
        >
          <div className={styles.countdownContent}>
            {edit ? (
              <>
                <input
                  className={styles.editInput}
                  value={inputMin}
                  onChange={handleChange}
                  style={{ width: inputWidth }}
                ></input>
                <span className={styles.editText}>:00</span>
              </>
            ) : (
              <>
                <span className={styles.contentMin} ref={minRef}>
                  {progressInfo.text.min}
                </span>
                <span>{progressInfo.text.remain}</span>
              </>
            )}
          </div>
        </ArcProgress>
      </div>
      {/* 倒计时控制按钮 */}
      {/* TODO 未订阅时无法点击 */}
      <div className={styles.controlContainer}>
        {start ? (
          // 专注按钮组
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
        ) : edit ? (
          // 编辑按钮组
          <>
            {/* 确定编辑按钮 */}
            <IconRoundButton
              icon={faCheck}
              color={'#2ecc71'}
              iconSize={28}
              onClick={() => editTotal()}
            />
            {/* 取消编辑按钮 */}
            <IconRoundButton
              icon={faTimes}
              color={'#e74c3c'}
              onClick={() => setEdit(!edit)}
              iconSize={30}
            />
          </>
        ) : (
          // 第一状态按钮组
          <>
            {/* 开始专注按钮 */}
            <IconRoundButton
              icon={faPlay}
              color={'#2ecc71'}
              disabled={!connectStatus.isConnect}
              onClick={() => setStart(!start)}
            />
            {/* 进入编辑按钮 */}
            <IconRoundButton
              icon={faEdit}
              color={'#34495e'}
              onClick={() => {
                setInputWidth(minRef.current.offsetWidth);
                setEdit(!edit);
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default IndexPage;
