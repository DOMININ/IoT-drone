import React from 'react';
import socket from '../socket';
import commands from '../commands/commands';

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
