import React from 'react';
import Commands from './Components/Control/Control';
// import DrosneState from './Components/DroneState';

import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.app}>
      {/* <DroneState /> */}
      <Commands />
    </div>
  );
}

export default App;
