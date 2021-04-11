import React from 'react';
import socket from '../socket';
import commands from '../commands/commands';
import JSMpeg from '@cycjimmy/jsmpeg-player';

document.addEventListener('keydown', (event) => {
  for (let key in commands) {
    if (event.keyCode === +key) {
      console.log('Sending command', commands[key]);
      socket.emit('command', commands[key]);
    }
  }
});

const sendCommand = (command) => {
  console.log('Sending command:', command);
  socket.emit('command', command);
};

const startStream = () => {
  const canvas = document.getElementById('video-canvas');
  canvas.style.width = '500px';
  const url = 'ws://' + document.location.hostname + ':3001/stream';
  new JSMpeg.Player(url, { canvas: canvas });

  socket.emit('stream', 'streamon');
};

const Commands = () => {
  return (
    <div>
      <button style={{ color: 'red' }} onClick={() => sendCommand('emergency')}>
        THE FALL OF THE BLACK HAWK
      </button>
      <br />
      <button onClick={startStream}>Start stream</button>
    </div>
  );
};

export default Commands;
