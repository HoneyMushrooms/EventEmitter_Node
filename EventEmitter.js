export class EventEmitter {
    #maxListeners = 10;
    #flagForWarn = true; // MaxListenersExceededWarning
    #emitter = {};
    
    getMaxListeners() {
        return this.#maxListeners;
    }

    setMaxListeners(n) {
        if(typeof n !== 'number' || n < 0) {
            console.log('The value of "n" is out of range. It must be a non-negative number.')
        }
        this.#maxListeners = n === 0 || n === Infinity ? Infinity : n;
        return this;
    }

    #addListenerInPosition(eventName, listener, position) {
        if(typeof listener !== 'function') throw new Error('The "listener" argument must be of type function.');

        if(this.#emitter[eventName]?.length >= this.#maxListeners && this.#flagForWarn) {
            process.emitWarning(`
                (node:15412) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 
                ${this.getMaxListeners()} 1 listeners added to EventEmitter. Use emitter.setMaxListeners() to increase limit
            `);
            this.#flagForWarn = false;
        }

        this.#emitter[eventName] ||= this.#emitter[eventName] = [];
        
        position === 'start' ? this.#emitter[eventName].unshift(listener) : this.#emitter[eventName].push(listener);
    }

    addListener(eventName, listener) {
        this.#addListenerInPosition(eventName, listener, 'end');
        return this;
    }

    prependListener(eventName, listener) {
        this.#addListenerInPosition(eventName, listener, 'start');
        return this;
    }

    on(eventName, listener) {
        this.addListener(eventName, listener);
        return this;
    }

    removeListener(eventName, listener) {
        if(typeof listener !== 'function') throw new Error('The "listener" argument must be of type function.');
        
        for (let i = this.#emitter[eventName].length - 1; i >= 0; i--) {
            const f = this.#emitter[eventName][i];
            if(f.listener === listener) {
                this.#emitter[eventName].splice(i, 1);
                break;
            } else if (f === listener) {
                this.#emitter[eventName].splice(i, 1);
                break;
            }
        }

        return this;
    }

    removeAllListeners(eventName) {
        this.#emitter[eventName] = [];
        return this;
    }

    off(eventName, listener) {
        this.removeListener(eventName, listener);
        return this;
    }

    emit(eventName, ...args) {

        if(!this.#emitter[eventName]?.length) return false;

        const copy = [...this.#emitter[eventName]];
        copy.forEach(f => {
            try {
                f.apply(this, args);
            } catch (err) {
                if (this.listenerCount('error')) {
                    this.emit('error', err);
                } else {
                    throw err;
                }
            }
        });

        return true;
    }

    eventNames() {
        return Reflect.ownKeys(this.#emitter);
    }

    listenerCount(eventName) {
        return this.#emitter[eventName]?.length || 0;
    }
    
    listeners(eventName) {
        return this.#emitter[eventName] || [];
    }

    #addOnceListenerInPos(eventName, listener, position) {
        function onceWrapper (...args) {
            listener.apply(this, args);
            this.removeListener(eventName, onceWrapper);
        }
        
        onceWrapper.listener = listener;
        
        this.#addListenerInPosition(eventName, onceWrapper, position);
    }

    once(eventName, listener) {
        this.#addOnceListenerInPos(eventName, listener, 'end');
        return this;
    }

    prependOnceListener(eventName, listener) {
        this.#addOnceListenerInPos(eventName, listener, 'start');
        return this;
    }

    rawListeners(eventName) {
        return this.#emitter[eventName]?.map(f => {
            if(f.name === 'onceWrapper') {
                const bound = f.bind(this);
                bound.listener = f.listener;
                return bound;
            } else {
                return f;
            }
        }) || [];
    }
}