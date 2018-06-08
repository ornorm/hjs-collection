/** @babel */
import {AbstractQueue} from './queue';

export class RingBuffer extends AbstractQueue {
  constructor(capacity = 0) {
    super();
    if (capacity <= 0) {
      throw new RangeError('IllegalArgumentException RingBuffer capacity must be positive.');
    }
    this.offset = this.unconsumedElements = 0;
    this.buffer = new Array(capacity);
  }

  add(e) {
    if (this.offer(e)) {
      return true;
    }
    throw new RangeError('IllegalStateException Queue is full');
  }

  addAll(c) {
    if (c !== null) {
      c.forEach(v => this.add(v));
      return true;
    }
    throw new ReferenceError('NullPointerException Null is not a valid collection');
  }

  capacity() {
    return this.buffer.length;
  }

  clear() {
    let value = null;
    do {
      value = this.poll();
    } while (value !== null);
  }

  contains(e) {
    if (e === null) {
      throw new ReferenceError('NullPointerException Null is not a valid element');
    }
    return this.buffer.indexOf(e) !== -1;
  }

  containsAll(c) {
    if (c !== null) {
      let len = c.length;
      while (len--) {
        if (!this.contains(c[len])) {
          return false;
        }
      }
      return true;
    }
    throw new ReferenceError('NullPointerException Null is not a valid collection');
  }

  element() {
    const e = this.peek();
    if (e === null) {
      throw new RangeError('NoSuchElementException Queue is empty');
    }
    return e;
  }

  isEmpty() {
    return this.size() === 0;
  }

  offer(e) {
    if (e === null) {
      throw new ReferenceError('NullPointerException Null is not a valid element');
    }
    if (this.unconsumedElements === this.buffer.length) {
      return false;
    }
    this.buffer[this.offset] = e;
    this.offset = (this.offset + 1) % this.buffer.length;
    ++this.unconsumedElements;
    return true;
  }

  peek() {
    if (this.unconsumedElements === 0) {
      return null;
    }
    const n = this.capacity();
    return this.buffer[(this.offset + (n - this.unconsumedElements)) % n];
  }

  poll() {
    const result = this.peek();
    --this.unconsumedElements;
    return result;
  }

  remove() {
    const e = this.poll();
    if (e === null) {
      throw new RangeError('NoSuchElementException Queue is empty');
    }
    return e;
  }

  size() {
    return this.unconsumedElements;
  }
}

