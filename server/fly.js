const dgram = require('dgram')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const throttle = require('lodash/throttle')

const PORT = 8889
const HOST = '192.168.10.1'
const drone = dgram.createSocket('udp4')
drone.bind(PORT)

const parseState = (state) => {
  return state
    .split(';')
    .map((x) => x.split(':'))
    .reduce((data, [key, value]) => {
      data[key] = value
      return data
    }, {})
}

const droneState = dgram.createSocket('udp4')
droneState.bind(8890)

//forstream
const droneStream = dgram.createSocket('udp4')
droneStream.bind(11111)

drone.on('message', (message) => {
  console.log(`Drone: ${message}`)
  io.sockets.emit('status', message.toString())
})

const handleError = (err) => {
  if (err) {
    console.log('ERROR:', err)
  }
}

drone.send('command', 0, 'command'.length, PORT, HOST, handleError)

//forstream
drone.send('streamon', 0, 'streamon'.length, PORT, HOST, handleError)

io.on('connection', (socket) => {
  socket.on('command', (command) => {
    console.log('Command sent from browser:', command)
    drone.send(command, 0, command.length, PORT, HOST, handleError)
  })

  socket.emit('status', 'CONNECTED')
})

droneState.on(
  'message',
  // throttle((state) => {
  //   const formattedState = parseState(state.toString())
  //   io.sockets.emit('dronestate', formattedState)
  // }, 100),
  (state) => {
    const formattedState = parseState(state.toString())
    io.sockets.emit('dronestate', formattedState)
  },
)

//forstream
// droneStream.on('message', (message) => {
//   console.log('Drone Stream:', message)
// })

http.listen(6767, () => {
  console.log('Socket io server up and running')
})
