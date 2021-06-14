import socket from '../../socket.js';
import React, { useState, useEffect } from 'react';

import styles from './DroneState.module.scss';

const useDroneState = () => {
  const [droneState, setDroneState] = useState({});

  useEffect(() => {
    socket.on('dronestate', setDroneState);
  }, []);
  return droneState;
};

const useSocket = () => {
  const [status, setStatus] = useState('DISCONNECTED');

  useEffect(() => {
    socket.on('status', setStatus);
  }, []);

  return status;
};

const DroneState = ({ lang }) => {
  const status = useSocket();
  const droneState = useDroneState([]);
  console.log(lang);

  if (lang === 'RU') {
    return (
      <section className={styles.wrapper}>
        <p>Статус: {status === 'DISCONNECTED' ? 'ОТКЛЮЧЕН' : 'ПОДКЛЮЧЕН'}</p>
        <p>Заряд: {droneState.bat}%</p>
      </section>
    );
  }

  return (
    <section className={styles.wrapper}>
      <p>Status: {status}</p>
      <p>Charge: {droneState.bat}%</p>
    </section>
  );
};

export default DroneState;
