/** @babel */
export class AbstractQueue {

    constructor() {

    }

    add(e) {
        return null;
    }

    addAll(c) {
        return false;
    }

    clear() {
    }

    contains(e) {
        return false;
    }

    containsAll(c) {
        return false;
    }

    element() {
        return null;
    }

    isEmpty() {
        return true;
    }

    offer(e) {
        return false;
    }

    peek() {
        return null;
    }

    poll() {
        return null;
    }

    remove() {
        return null;
    }

    size() {
        return 0;
    }

}

export const DEFAULT_QUEUE_CAPACITY = 100;

export class Queue extends AbstractQueue {

    constructor(capacity = DEFAULT_QUEUE_CAPACITY) {
        super();
        this.head = 0;
        this.tail = 0;
        this.mask = 0;
        this.tailCache = 0;
        this.headCache = 0;
        this.capacity = Queue.findNextPositivePowerOfTwo(capacity);
        this.mask = this.capacity - 1;
        this.buffer = new Array(this.capacity);
    }

    add(e) {
        if (this.offer(e)) {
            return true;
        }
        throw new RangeError("IllegalStateException Queue is full");
    }

    addAll(c) {
        if (c !== null) {
            for (const v of c) {
                this.add(v);
            }
            return true;
        }
        throw new ReferenceError("NullPointerException Null is not a valid collection");
    }

    clear() {
        let value = null;
        do {
            value = this.poll();
        } while (value !== null);
    }

    contains(e) {
        if (e === null) {
            throw new ReferenceError("NullPointerException Null is not a valid element");
        }
        let o = null;
        for (let i = this.head, limit = this.tail; i < limit; i++) {
            o = this.buffer[i & this.mask];
            if (o === e) {
                return true;
            }
        }
        return false;
    }

    containsAll(c) {
        if (c !== null) {
            for (const v of c) {
                if (!this.contains(v)) {
                    return false;
                }
            }
            return true;
        }
        throw new ReferenceError("NullPointerException Null is not a valid collection");
    }

    element() {
        let e = this.peek();
        if (e === null) {
            throw new RangeError("NoSuchElementException Queue is empty");
        }
        return e;
    }

    static findNextPositivePowerOfTwo(value) {
        return 1 << (32 - Queue.numberOfLeadingZeros(value - 1));
    }

    isEmpty() {
        return this.tail === this.head;
    }

    static numberOfLeadingZeros(i) {
        if (i === 0) {
            return 32;
        }
        let n = 1;
        if (i >>> 16 === 0) {
            n += 16;
            i <<= 16;
        }
        if (i >>> 24 === 0) {
            n += 8;
            i <<= 8;
        }
        if (i >>> 28 === 0) {
            n += 4;
            i <<= 4;
        }
        if (i >>> 30 === 0) {
            n += 2;
            i <<= 2;
        }
        n -= i >>> 31;
        return n;
    }

    offer(e) {
        if (e === null) {
            throw new ReferenceError("NullPointerException Null is not a valid element");
        }
        let currentTail = this.tail, wrapPoint = currentTail
            - this.capacity;
        if (this.headCache <= wrapPoint) {
            this.headCache = this.head;
            if (this.headCache <= wrapPoint) {
                return false;
            }
        }
        this.buffer[currentTail & this.mask] = e;
        this.tail = currentTail + 1;
        return true;
    }

    peek() {
        return this.buffer[this.head & this.mask];
    }

    poll() {
        let currentHead = this.head;
        if (currentHead >= this.tailCache) {
            this.tailCache = this.tail;
            if (currentHead >= this.tailCache) {
                return null;
            }
        }
        let index = currentHead & this.mask;
        let e = this.buffer[index];
        this.buffer[index] = null;
        this.head = currentHead + 1;
        return e;
    }

    remove() {
        let e = this.poll();
        if (e === null) {
            throw new RangeError("NoSuchElementException Queue is empty");
        }
        return e;
    }

    size() {
        return this.tail - this.head;
    }

}

