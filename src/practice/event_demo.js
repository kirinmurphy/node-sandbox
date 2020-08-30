const EventEmitter = require('events');
const uuid = require('uuid');

class Logger extends EventEmitter {
  log(msg) {
    console.log('fff');
    this.emit('message', { id: uuid.v4(), msg });
  }
}

const logger = new Logger();

logger.on('message', (data) => console.log('Called Listener:', data));

logger.log('Jeammmms');