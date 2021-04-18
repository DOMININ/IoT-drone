import React, { useRef, useState } from 'react';
import socket from '../../socket';
import commands from '../../commands/commands';
import JSMpeg from '@cycjimmy/jsmpeg-player';

import styles from './Control.module.scss';

const Control = () => {
  const [activeCommand, setActiveCommand] = useState('');
  const canvasElement = useRef(null);

  document.addEventListener('keydown', (event) => {
    for (let key in commands) {
      if (event.key === key) {
        socket.emit('command', commands[key]);
        setActiveCommand(commands[key]);
      }
    }
  });

  document.addEventListener('keyup', () => {
    setActiveCommand('');
  });

  const emergencyLand = () => {
    console.log('Sending command:', 'emergency');
    socket.emit('command', 'emergency');
  };

  const sendButtonCommand = (e) => {
    socket.emit('command', e.target.dataset.control);
  };

  const startStream = () => {
    canvasElement.current.style.width = '500px';
    const url = 'ws://' + document.location.hostname + ':3001/stream';
    new JSMpeg.Player(url, { canvas: canvasElement.current });

    socket.emit('stream', 'streamon');
  };

  const endStream = () => {
    socket.emit('stream', 'streamoff');
  };

  return (
    <section className={styles.control}>
      <div className={styles.row1}>
        <button
          style={{ background: activeCommand === 'down 20' && '#1DE51D' }}
          data-control="down 20"
          className={styles.btnControlSecondary}
          onClick={sendButtonCommand}
        >
          Down
        </button>
        <button
          style={{ background: activeCommand === 'forward 20' && '#1DE51D' }}
          data-control="forward 20"
          className={styles.btnControl}
          onClick={sendButtonCommand}
        >
          Forward
        </button>
        <button
          style={{ background: activeCommand === 'up 20' && '#1DE51D' }}
          data-control="up 20"
          className={styles.btnControlSecondary}
          onClick={sendButtonCommand}
        >
          Up
        </button>
      </div>

      <div className={styles.row2}>
        <div className={styles.leftSide}>
          <button
            data-control="takeoff"
            className={styles.btnControlTertiary}
            onClick={sendButtonCommand}
          >
            Takeoff
          </button>
          <button
            style={{ background: activeCommand === 'left 20' && '#1DE51D' }}
            data-control="left 20"
            className={styles.btnControl}
            onClick={sendButtonCommand}
          >
            Left
          </button>
          <button
            style={{ background: activeCommand === 'ccw 20' && '#1DE51D' }}
            data-control="ccw 20"
            className={styles.btnControlSecondary}
            onClick={sendButtonCommand}
          >
            Rotate left
          </button>
        </div>
        <canvas
          ref={canvasElement}
          id="video-canvas"
          width="500"
          height="375"
          className={styles.canvas}
        />
        <div className={styles.rightSide}>
          <button
            data-control="land"
            className={styles.btnControlTertiary}
            onClick={sendButtonCommand}
          >
            Land
          </button>
          <button
            style={{ background: activeCommand === 'right 20' && '#1DE51D' }}
            data-control="right 20"
            className={styles.btnControl}
            onClick={sendButtonCommand}
          >
            Right
          </button>
          <button
            style={{ background: activeCommand === 'cw 20' && '#1DE51D' }}
            data-control="cw 20"
            className={styles.btnControlSecondary}
            onClick={sendButtonCommand}
          >
            Rotate right
          </button>
        </div>
      </div>

      <div className={styles.row3}>
        <button onClick={startStream} className={styles.btnControlTertiary}>
          Start stream
        </button>
        <button
          style={{ background: activeCommand === 'back 20' && '#1DE51D' }}
          data-control="back 20"
          className={styles.btnControl}
          onClick={sendButtonCommand}
        >
          Back
        </button>
        <button onClick={endStream} className={styles.btnControlTertiary}>
          Off stream
        </button>
      </div>

      <button onClick={emergencyLand} className={styles.emergency}>
        Black Hawk Down
      </button>

      <button
        data-control="go 20 20 20 20"
        onClick={sendButtonCommand}
        className={styles.emergency}
      >
        На координаты
      </button>
    </section>
  );
};

export default Control;
