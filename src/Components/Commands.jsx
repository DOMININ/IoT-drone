import React, { useEffect } from 'react'
import socket from '../socket'
import commands from '../commands/commands'
import './Commands.css'
import voiceCommands from '../commands/voiceCommands'
// import alanBtn from '@alan-ai/alan-sdk-web'

// const alanKey = 'd3fce30d43bf3ca239295151f9e281e12e956eca572e1d8b807a3e2338fdd0dc/stage'

document.addEventListener('keydown', (event) => {
  for (let key in commands) {
    if (event.keyCode === +key) {
      console.log('Sending command', commands[key])
      socket.emit('command', commands[key])
    }
  }
})

const sendCommand = (command) => {
  console.log('Sending command', command)
  socket.emit('command', command)
}

const startSpeak = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  var recognizer = new SpeechRecognition()

  recognizer.interimResults = true

  // recognizer.lang = 'en-US'
  recognizer.lang = 'ru-RU'

  recognizer.onresult = function (event) {
    var result = event.results[event.resultIndex]
    if (result.isFinal) {
      console.log(result[0].transcript)
      console.log(voiceCommands[result[0].transcript])
      socket.emit('command', voiceCommands[result[0].transcript])
    }
  }

  recognizer.start()
}

const Commands = () => {
  // useEffect(() => {
  //   alanBtn({
  //     key: alanKey,
  //     onCommand: ({ command }) => {
  //       console.log(command)
  //       socket.emit('command', voiceCommands[command])
  //     },
  //   })
  // }, [])

  return (
    <div>
      <button style={{ color: 'red' }} onClick={() => sendCommand('emergency')}>
        THE FALL OF THE BLACK HAWK
      </button>
      <button className="btn-voice" onClick={() => startSpeak()}>
        Voice
      </button>
    </div>
  )
}

export default Commands
