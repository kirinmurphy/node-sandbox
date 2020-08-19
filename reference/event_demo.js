const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on('someEvent', () => console.log('Event Fired'));

myEmitter.emit('someEvent');