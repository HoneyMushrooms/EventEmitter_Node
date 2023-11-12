import { EventEmitter } from './EventEmitter.js'; 

const myEmitter = new EventEmitter();

console.log('example of work')

const a = (a) => console.log('aaa', a);
const b = (b) => console.log('bbb', b);
const c = (с) => console.log('ccc', с);
const d = (d) => {throw new Error('Boom!'); console.log('ddd', d)};
const e = (e) => console.log('eee', e);

console.log('\x1b[32m%s\x1b[0m', 'Case 1');

myEmitter.addListener('event', a)
    .on('event', b)
    .prependListener('event', c)
    .emit('event', 'value');

console.log('\x1b[32m%s\x1b[0m', '\nCase 2');

myEmitter.off('event', a)
    .removeListener('event', b)
    .emit('event', 'only c');

console.log('\x1b[32m%s\x1b[0m', '\nCase 3');

myEmitter.off('event', c)
    .once('event', a)
    .prependOnceListener('event', b)
    .emit('event', 'these handlers are triggered once');

if(!myEmitter.emit('event', 'repeat')) {
    console.log('emit returns false if there are no handlers');
}

console.log('\x1b[32m%s\x1b[0m', '\nCase 4');

myEmitter.on('event', a)
    .once('event', b);

console.log('eventNames', myEmitter.eventNames());
console.log('listenerCount(eventName)', myEmitter.listenerCount('event'));
console.log('listeners(eventName)', myEmitter.listeners('event'));
console.log('removeAllListeners(eventName) drops all listeners and returns a link to', myEmitter.removeAllListeners('event'));

console.log('\x1b[32m%s\x1b[0m', '\nCase 5');

console.log('getMaxListeners()', myEmitter.getMaxListeners());
console.log('setMaxListeners(num) 0|Infinity sets an infinite number of handlers');

console.log('\x1b[32m%s\x1b[0m', '\nCase 6');

console.log('rawListeners() returns a copy of the array of listeners for the event named eventName, including any wrappers (such as those created by .once()).');
console.log(myEmitter.on('event', a).once('event', b).rawListeners('event'));
myEmitter.removeAllListeners('event');

console.log('\x1b[32m%s\x1b[0m', '\nCase 7');

console.log(`these are all the methods that are implemented here, an interesting feature, 
if there is an error in the asynchronous handler and you have a subscription to the error event, 
you will handle the error, of course you can change this behavior in the emit method\n`);

myEmitter.on('event', a)
    .on('event', d)
    .on('event', e)
    .on('error', console.log)
    .emit('event', ':)');

console.log('\x1b[32m%s\x1b[0m', '\nGood Luck!');