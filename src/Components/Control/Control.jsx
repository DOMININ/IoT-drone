import React, { useRef, useState, useEffect } from 'react';
import DroneState from '../DroneState/DroneState';
import socket from '../../socket';
import commands from '../../commands/commands';
import JSMpeg from '@cycjimmy/jsmpeg-player';

import styles from './Control.module.scss';

const Control = () => {
  const [isTakedOff, setIsTakedOff] = useState(false);
  const [isStreamOn, setIsStreamOn] = useState(false);
  const [activeCommand, setActiveCommand] = useState('');
  const canvasElement = useRef(null);

  useEffect(() => {
    document.addEventListener('keydown', sendCommand);
    document.addEventListener('keyup', () => {
      setActiveCommand('');
    });
    return () => {
      document.removeEventListener('keydown', sendCommand);
      document.removeEventListener('keyup', () => {
        setActiveCommand('');
      });
    };
  }, []);

  const sendCommand = (event) => {
    for (let key in commands) {
      if (event.key === key) {
        if (commands[key] === 'takeoff') {
          setIsTakedOff(true);
        }
        if (commands[key] === 'land') {
          setIsTakedOff(false);
        }

        socket.emit('command', commands[key]);
        setActiveCommand(commands[key]);
      }
    }
  };

  const emergencyLand = () => {
    console.log('Sending command:', 'emergency');
    socket.emit('command', 'emergency');
  };

  const sendButtonCommand = (e) => {
    if (e.target.dataset.control === 'takeoff') {
      setIsTakedOff(true);
    }
    if (e.target.dataset.control === 'land') {
      setIsTakedOff(false);
    }

    socket.emit('command', e.target.dataset.control);
  };

  const startStream = () => {
    canvasElement.current.style.width = '500px';
    const url = 'ws://' + document.location.hostname + ':3001/stream';
    new JSMpeg.Player(url, { canvas: canvasElement.current });

    setIsStreamOn(true);
    socket.emit('stream', 'streamon');
  };

  const endStream = () => {
    setIsStreamOn(false);
    socket.emit('stream', 'streamoff');
  };

  return (
    <section className={styles.control}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <button
            style={{ background: activeCommand === 'forward 20' && '#1DE51D' }}
            data-control="forward 20"
            className={styles.btnControl}
            onClick={sendButtonCommand}
          >
            Forward
          </button>
          <div className={styles.inner}>
            <button
              style={{ background: activeCommand === 'left 20' && '#1DE51D' }}
              data-control="left 20"
              className={styles.btnControl}
              onClick={sendButtonCommand}
            >
              Left
            </button>
            <button
              style={{ background: activeCommand === 'right 20' && '#1DE51D' }}
              data-control="right 20"
              className={styles.btnControl}
              onClick={sendButtonCommand}
            >
              Right
            </button>
          </div>
          <button
            style={{ background: activeCommand === 'back 20' && '#1DE51D' }}
            data-control="back 20"
            className={styles.btnControl}
            onClick={sendButtonCommand}
          >
            Back
          </button>
        </div>

        <div className={styles.middle}>
          <DroneState />
          <canvas
            ref={canvasElement}
            id="video-canvas"
            width="500"
            height="375"
            className={styles.canvas}
          />
          {!isTakedOff ? (
            <button
              data-control="takeoff"
              className={styles.btnControlTakeoff}
              onClick={sendButtonCommand}
            />
          ) : (
            <button
              data-control="land"
              className={styles.btnControlLand}
              onClick={sendButtonCommand}
            />
          )}

          {!isStreamOn ? (
            <button onClick={startStream} className={styles.btnControlStreamon} />
          ) : (
            <button onClick={endStream} className={styles.btnControlStreamoff} />
          )}
        </div>

        <div className={styles.right}>
          <button
            style={{ background: activeCommand === 'up 20' && '#1DE51D' }}
            data-control="up 20"
            className={styles.btnControlSecondary}
            onClick={sendButtonCommand}
          >
            Up
          </button>
          <div className={styles.inner}>
            <button
              style={{ background: activeCommand === 'ccw 20' && '#1DE51D' }}
              data-control="ccw 20"
              className={styles.btnControlSecondary}
              onClick={sendButtonCommand}
            >
              Rotate left
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
          <button
            style={{ background: activeCommand === 'down 20' && '#1DE51D' }}
            data-control="down 20"
            className={styles.btnControlSecondary}
            onClick={sendButtonCommand}
          >
            Down
          </button>
        </div>
      </div>

      <div className={styles.btnAdvanced}>
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
      </div>
    </section>
  );
};

export default Control;
