import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import mqtt, { MqttClient } from 'mqtt';
import ArcProgress from 'react-arc-progress';

import styles from './index.less';

const IndexPage = (props: any) => {
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
        mqttSub(subscription);
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

  const progress = .782;
  const text = '6439.68'

  return (
    <div>
      <ArcProgress
        progress={progress}
        text={text}
        observer={(current) => {
          const { percentage, currentText } = current;
          console.log('observer:', percentage, currentText);
        }}
        animationEnd={({ progress, text }) => {
          console.log('animationEnd', progress, text);
        }}
      />
    </div>
  );
};

export default IndexPage;
