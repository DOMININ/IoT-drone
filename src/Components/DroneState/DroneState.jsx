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

const DroneState = () => {
  const status = useSocket();
  const droneState = useDroneState([]);
  return (
    <section className={styles.wrapper}>
      <p>Status: {status}</p>
      <p>Charge: {droneState.bat}%</p>
    </section>
  );
};

export default DroneState;
