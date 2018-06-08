/** @babel */
import {Iterator} from './iterator';
import {AbstractQueue} from './queue';

export class LinkedNode {
  constructor({item = null, next = null, prev = null} = {}) {
    this.item = item;
    this.next = next;
    this.prev = prev;
  }
}

export class LinkedListIterator extends Iterator {
  constructor(list = [], index = 0) {
    super(list);
    this.nextReturned = (index === list.count) ? null : list.node(index);
    this.expectedModCount = 0;
    this.cursor = index;
  }

  add(e) {
    this.checkForComodification();
    this.lastReturned = null;
    if (this.nextReturned === null) {
      this.list.linkLast(e);
    } else {
      this.list.linkBefore(e, next);
    }
    this.cursor++;
    this.expectedModCount++;
  }

  checkForComodification() {
    if (this.list.modCount !== this.expectedModCount) {
      throw new Error('ConcurrentModificationException');
    }
  }

  hasNext() {
    return this.cursor < this.list.count;
  }

  hasPrevious() {
    return this.cursor > 0;
  }

  next() {
    this.checkForComodification();
    if (!this.hasNext()) {
      throw new RangeError('NoSuchElementException');
    }
    this.lastReturned = this.nextReturned;
    this.nextReturned = this.nextReturned.next;
    this.cursor++;
    return this.lastReturned.item;
  }

  nextIndex() {
    return this.cursor;
  }

  previous() {
    this.checkForComodification();
    if (!this.hasPrevious()) {
      throw new RangeError('NoSuchElementException');
    }
    this.lastReturned = this.nextReturned = this.nextReturned === null ?
      this.last : this.nextReturned.prev;
    this.cursor--;
    return this.lastReturned.item;
  }

  previousIndex() {
    return this.cursor - 1;
  }

  remove() {
    this.checkForComodification();
    if (this.lastReturned === null) {
      throw new Error('IllegalStateException');
    }
    const lastNext = this.lastReturned.next;
    this.list.unlink(this.lastReturned);
    if (this.nextReturned === this.lastReturned) {
      this.nextReturned = lastNext;
    } else {
      this.cursor--;
    }
    this.lastReturned = null;
    this.expectedModCount++;
  }

  set(e) {
    if (this.lastReturned === null) {
      throw new Error('IllegalStateException');
    }
    this.checkForComodification();
    this.lastReturned.item = e;
  }
}

export class LinkedList extends AbstractQueue {
  constructor(c = null) {
    super();
    this.count = 0;
    this.modCount = 0;
    this.first = null;
    this.last = null;
    if (c !== null && Array.isArray(c)) {
      this.addAll(c);
    }
  }

  add(e) {
    this.linkLast(e);
    return true;
  }

  addAll(c) {
    return this.addAllAt(this.count, c);
  }

  addAt(index, e) {
    this.checkPositionIndex(index);
    if (index === this.count) {
      this.linkLast(e);
    } else {
      this.linkBefore(e, this.node(index));
    }
  }

  addAllAt(index, c) {
    this.checkPositionIndex(index);
    const numNew = c.length;
    if (numNew === 0) {
      return false;
    }
    let pred = null;
    let succ = null;
    if (index === this.count) {
      succ = null;
      pred = this.last;
    } else {
      succ = this.node(index);
      pred = succ.prev;
    }
    for (const v of c) {
      const newNode = new LinkedNode({
        prev: pred,
        item: v,
        next: null,
      });
      if (pred === null) {
        this.first = newNode;
      } else {
        pred.next = newNode;
      }
      pred = newNode;
    }
    if (succ === null) {
      this.last = pred;
    } else {
      pred.next = succ;
      succ.prev = pred;
    }
    this.count += numNew;
    this.modCount++;
    return true;
  }

  addFirst(e) {
    this.linkFirst(e);
  }

  addLast(e) {
    this.linkLast(e);
  }

  checkElementIndex(index) {
    if (!this.isElementIndex(index)) {
      throw new RangeError(this.outOfBoundsMsg(index));
    }
  }

  checkPositionIndex(index) {
    if (!this.isPositionIndex(index)) {
      throw new RangeError(this.outOfBoundsMsg(index));
    }
  }

  clear() {
    let next = null;
    // Clearing all of the links between nodes is "unnecessary", but:
    // - helps a generational GC if the discarded nodes inhabit
    //   more than one generation
    // - is sure to free memory even if there is a reachable Iterator
    for (let x = this.first; x !== null;) {
      next = x.next;
      x.item = x.next = x.prev = null;
      x = next;
    }
    this.first = this.last = null;
    this.count = 0;
    this.modCount++;
  }

  contains(e) {
    return this.indexOf(e) !== -1;
  }

  element() {
    return this.getFirst();
  }

  get(index) {
    this.checkElementIndex(index);
    return this.node(index).item;
  }

  getFirst() {
    const f = this.first;
    if (f === null) {
      throw new RangeError('NoSuchElementException this list is empty');
    }
    return f.item;
  }

  getLast() {
    const l = this.last;
    if (l === null) {
      throw new RangeError('NoSuchElementException this list is empty');
    }
    return l.item;
  }

  indexOf(e) {
    let index = 0;
    if (e === null) {
      for (let x = this.first; x !== null; x = x.next) {
        if (x.item !== null) {
          return index;
        }
        index++;
      }
    } else {
      for (let x = this.first; x !== null; x = x.next) {
        if (e === x.item) {
          return index;
        }
        index++;
      }
    }
    return -1;
  }

  isElementIndex(index) {
    return index >= 0 && index < this.count;
  }

  isPositionIndex(index) {
    return index >= 0 && index <= this.count;
  }

  lastIndexOf(e) {
    let index = this.count;
    if (e === null) {
      for (let x = this.last; x !== null; x = x.prev) {
        index--;
        if (x.item === null) {
          return index;
        }
      }
    } else {
      for (let x = this.last; x !== null; x = x.prev) {
        index--;
        if (e === x.item) {
          return index;
        }
      }
    }
    return -1;
  }

  linkBefore(e, succ) {
    const pred = succ.prev;
    const newNode = new LinkedNode({
      prev: pred,
      item: e,
      next: succ,
    });
    succ.prev = newNode;
    if (pred === null) {
      this.first = newNode;
    } else {
      pred.next = newNode;
    }
    this.count++;
    this.modCount++;
  }

  linkLast(e) {
    const l = this.last;
    const newNode = new LinkedNode({
      prev: l,
      item: e,
      next: null,
    });
    this.last = newNode;
    if (l === null) {
      this.first = newNode;
    } else {
      l.next = newNode;
    }
    this.count++;
    this.modCount++;
  }

  linkFirst(e) {
    const f = this.first;
    const newNode = new LinkedNode({
      prev: null,
      item: e,
      next: f,
    });
    this.first = newNode;
    if (e === null) {
      this.last = newNode;
    } else {
      f.prev = newNode;
    }
    this.count++;
    this.modCount++;
  }

  listIterator(index) {
    this.checkPositionIndex(index);
    return new LinkedListIterator(this, index);
  }

  node(index) {
    if (index < (this.count >> 1)) {
      let x = this.first;
      for (let i = 0; i < index; i++) {
        x = x.next;
      }
      return x;
    }
    let x = this.last;
    for (let i = this.count - 1; i > index; i--) {
      x = x.prev;
    }
    return x;
  }

  offer(e) {
    return this.add(e);
  }

  offerFirst(e) {
    this.addFirst(e);
    return true;
  }

  offerLast(e) {
    this.addLast(e);
    return true;
  }

  outOfBoundsMsg(index) {
    return `Index: ${index}, Size: ${this.count}`;
  }

  peek() {
    const f = this.first;
    return f === null ? null : f.item;
  }

  peekFirst() {
    return this.peek();
  }

  peekLast() {
    const l = this.last;
    return l === null ? null : l.item;
  }

  poll() {
    const f = this.first;
    return f === null ? null : this.unlinkFirst(f);
  }

  pollFirst() {
    return this.poll();
  }

  pollLast() {
    const l = this.last;
    return l === null ? null : this.unlinkLast(l);
  }

  pop() {
    return this.removeFirst();
  }

  push(e) {
    this.addFirst(e);
  }

  remove(e) {
    if (e === null) {
      for (let x = this.first; x !== null; x = x.next) {
        if (x.item === null) {
          this.unlink(x);
          return true;
        }
      }
    } else {
      for (let x = this.first; x !== null; x = x.next) {
        if (e === x.item) {
          this.unlink(x);
          return true;
        }
      }
    }
    return false;
  }

  removeAt(index) {
    this.checkElementIndex(index);
    return this.unlink(this.node(index));
  }

  removeFirst() {
    const f = this.first;
    if (f === null) {
      throw new RangeError('NoSuchElementException this list is empty');
    }
    return this.unlinkFirst(f);
  }

  removeFirstOccurrence(e) {
    return this.remove(e);
  }

  removeLast() {
    const l = this.last;
    if (l === null) {
      throw new RangeError('NoSuchElementException this list is empty');
    }
    return this.unlinkLast(l);
  }

  removeLastOccurrence(e) {
    if (e === null) {
      for (let x = this.last; x !== null; x = x.prev) {
        if (!x.item === null) {
          this.unlink(x);
          return true;
        }
      }
    } else {
      for (let x = this.last; x !== null; x = x.prev) {
        if (e === x.item) {
          this.unlink(x);
          return true;
        }
      }
    }
    return false;
  }

  set(index, element) {
    this.checkElementIndex(index);
    const x = this.node(index);
    const oldVal = x.item;
    x.item = element;
    return oldVal;
  }

  size() {
    return this.count;
  }

  unlink(x) {
    const element = x.item;
    const next = x.next;
    const prev = x.prev;
    if (prev === null) {
      this.first = next;
    } else {
      prev.next = next;
      x.prev = null;
    }
    if (next === null) {
      this.last = prev;
    } else {
      next.prev = prev;
      x.next = null;
    }
    x.item = null;
    this.count--;
    this.modCount++;
    return element;
  }

  unlinkFirst(f) {
    const element = f.item;
    const next = f.next;
    f.item = f.next = null;
    // help GC
    this.first = next;
    if (next === null) {
      this.last = null;
    } else {
      next.prev = null;
    }
    this.count--;
    this.modCount++;
    return element;
  }

  unlinkLast(l) {
    const element = l.item;
    const prev = l.prev;
    l.item = l.prev = null; // help GC
    this.last = prev;
    if (prev === null) {
      this.first = null;
    } else {
      prev.next = null;
    }
    this.count--;
    this.modCount++;
    return element;
  }
}
