/** @babel */
import * as util from 'hjs-core/lib/util';
import {Enumeration, Iterator} from './iterator';
import {AbstractMap} from './map';

const HAS = Object.prototype.hasOwnProperty;

const KEYS = 0;
const VALUES = 1;
const ENTRIES = 2;

export class Enumerator {
  constructor(hashTable, type, iterator) {
    this.mHashTable = hashTable;
    this.mIndex = this.mHashTable.table.length;
    this.mIterator = iterator;
    this.mLastReturned = null;
    this.mEntry = null;
    this.mType = type;
  }

  hasMoreElements() {
    let e = this.mEntry;
    let i = this.mIndex;
    const t = this.mHashTable.table;
    while (e === null && i > 0) {
      e = t[--i];
    }
    this.mEntry = e;
    this.mIndex = i;
    return e !== null;
  }

  hasNext() {
    return this.hasMoreElements();
  }

  next() {
    return this.nextElement();
  }

  nextElement() {
    let e = this.mEntry;
    let i = this.mIndex;
    const t = this.mHashTable.table;
    while (e === null && i > 0) {
      e = t[--i];
    }
    this.mEntry = e;
    this.mIndex = i;
    if (e !== null) {
      e = this.mLastReturned = this.mEntry;
      this.mEntry = e.next;
      return this.mType === KEYS ? e.key : (this.mType === VALUES ? e.value : e);
    }
    throw new RangeError('NoSuchElementException Hashtable Enumerator');
  }

  remove() {
    if (!this.mIterator) {
      throw new Error('UnsupportedOperationException');
    }
    if (this.mLastReturned === null) {
      throw new Error('IllegalStateException Hashtable Enumerator');
    }
    const tab = this.mHashTable.table;
    const index = (this.mLastReturned.h & 0x7FFFFFFF) % tab.length;
    for (let e = tab[index], prev = null; e !== null; prev = e, e = e.next) {
      if (e === this.mLastReturned) {
        this.mHashTable.modCount++;
        this.mHashTable.expectedModCount++;
        if (prev === null) {
          tab[index] = e.next;
        } else {
          prev.next = e.next;
        }
        this.mHashTable.count--;
        this.mLastReturned = null;
        return;
      }
    }
    throw new Error('ConcurrentModificationException');
  }
}

export class HashtableEntry {
  constructor({
    h = 0, key = null, value = null, next = null,
  } = {}) {
    this.h = h;
    this.key = key;
    this.value = value;
    this.next = next;
  }

  equals(o) {
    if (!(o instanceof HashtableEntry)) {
      return false;
    }
    const e = o;
    return this.key === e.getKey() && this.value === e.getValue();
  }

  getKey() {
    return this.key;
  }

  getValue() {
    return this.value;
  }

  hashCode() {
    return util.hashCode(this.key) ^ util.hashCode(this.value);
  }

  setValue(value) {
    if (value === null) {
      throw new ReferenceError('NullPointerException');
    }
    const oldValue = this.value;
    this.value = value;
    return oldValue;
  }
}

const MAX_ARRAY_SIZE = Number.MAX_VALUE - 8;
const DEFAULT_LOAD_FACTOR = 0.75;

export class Hashtable {
  constructor({initialCapacity = 11, loadFactor = DEFAULT_LOAD_FACTOR, map = null} = {}) {
    let n = initialCapacity;
    if (map !== null) {
      n = 2 * map.size();
      this.loadFactor = loadFactor;
    } else {
      if (n < 0) {
        throw new RangeError(`IllegalArgumentException Illegal Capacity: ${n}`);
      }
      if (loadFactor <= 0) {
        throw new RangeError(`IllegalArgumentException Illegal Load: ${loadFactor}`);
      }
    }
    this.table = new Array(n);
    this.threshold = (n <= MAX_ARRAY_SIZE + 1) ? n : MAX_ARRAY_SIZE + 1;
    if (map !== null) {
      this.putAll(map);
    }
  }

  clear() {
    const tab = this.table;
    for (let index = tab.length; --index >= 0;) {
      tab[index] = null;
    }
    this.count = 0;
  }

  contains(value) {
    if (value === null) {
      throw new ReferenceError('NullPointerException');
    }
    const tab = this.table;
    for (let i = tab.length; i-- > 0;) {
      for (let e = tab[i]; e !== null; e = e.next) {
        if (e.value === value) {
          return true;
        }
      }
    }
    return false;
  }

  containsKey(key) {
    const tab = this.table;
    const h = util.hashCode(key);
    const index = (h & 0x7FFFFFFF) % tab.length;
    for (let e = tab[index]; e !== null; e = e.next) {
      if ((e.h === h) && e.key === key) {
        return true;
      }
    }
    return false;
  }

  containsValue(value) {
    return this.contains(value);
  }

  elements() {
    return this.getEnumeration(VALUES);
  }

  entrySet() {
    return {
      iterator: () => this.getIterator(ENTRIES),
    };
  }

  get(key) {
    const tab = this.table;
    const h = util.hashCode(key);
    const index = (h & 0x7FFFFFFF) % tab.length;
    for (let e = tab[index]; e !== null; e = e.next) {
      if ((e.h === h) && e.key === key) {
        return e.value;
      }
    }
    return null;
  }

  getEnumeration(type) {
    if (this.count === 0) {
      return new Enumeration(this.table);
    }
    return new Enumerator(this, type, false);
  }

  getIterator(type) {
    if (this.count === 0) {
      return new Iterator(this.table);
    }
    return new Enumerator(this, type, true);
  }

  static hash(k) {
    return util.hashCode(k);
  }

  isEmpty() {
    return this.count === 0;
  }

  keys() {
    return this.getEnumeration(KEYS);
  }

  keySet() {
    return {
      clear: () => {
        this.clear();
      },
      contains: o => this.containsKey(o),
      iterator: () => this.getIterator(KEYS),
      remove: o => this.remove(o) !== null,
      size: () => this.count,
    };
  }

  put(key, value) {
    if (value === null) {
      throw new ReferenceError('NullPointerException');
    }
    let old = null;
    let tab = this.table;
    let h = util.hashCode(key);
    let index = (h & 0x7FFFFFFF) % tab.length;
    for (let e = tab[index]; e !== null; e = e.next) {
      if ((e.h === h) && e.key === key) {
        old = e.value;
        e.value = value;
        return old;
      }
    }
    if (this.count >= this.threshold) {
      this.rehash();
      tab = this.table;
      h = util.hashCode(key);
      index = (h & 0x7FFFFFFF) % tab.length;
    }
    const e = tab[index];
    tab[index] = new HashtableEntry({
      h,
      key,
      value,
      next: e,
    });
    this.count++;
    return null;
  }

  putAll(t) {
    const map = t instanceof AbstractMap ? t.map : t;
    Object
      .keys(map)
      .forEach((key) => {
        if (HAS.call(map, key)) {
          this.put(key, map[key]);
        }
      });
  }

  rehash() {
    const oldCapacity = this.table.length;
    const oldMap = this.table;
    let newCapacity = (oldCapacity << 1) + 1;
    if (newCapacity - MAX_ARRAY_SIZE > 0) {
      if (oldCapacity === MAX_ARRAY_SIZE) {
        return;
      }
      newCapacity = MAX_ARRAY_SIZE;
    }
    const newMap = new Array(newCapacity);
    this.threshold = Math.min(newCapacity * this.loadFactor, MAX_ARRAY_SIZE + 1);
    this.table = newMap;
    let e = null;
    let index = 0;
    for (let i = oldCapacity; i-- > 0;) {
      for (let old = oldMap[i]; old !== null;) {
        e = old;
        old = old.next;
        index = (e.h & 0x7FFFFFFF) % newCapacity;
        e.next = newMap[index];
        newMap[index] = e;
      }
    }
  }

  remove(key) {
    const tab = this.table;
    const hash = util.hashCode(key);
    const index = (hash & 0x7FFFFFFF) % tab.length;
    let oldValue = null;
    for (let e = tab[index], prev = null; e !== null; prev = e, e = e.next) {
      if ((e.h === hash) && e.key === key) {
        if (prev !== null) {
          prev.next = e.next;
        } else {
          tab[index] = e.next;
        }
        this.count--;
        oldValue = e.value;
        e.value = null;
        return oldValue;
      }
    }
    return null;
  }

  size() {
    return this.count;
  }

  values() {
    return {
      clear: () => {
        this.clear();
      },
      contains: o => this.containsValue(o),
      iterator: () => this.getIterator(VALUES),
      size: () => this.count,
    };
  }
}

export class HashMapEntry extends HashtableEntry {
  constructor({
    h = 0, key = null, value = null, next = null,
  } = {}) {
    super({
      h, key, value, next,
    });
  }

  equals(o) {
    if (!(o instanceof HashMapEntry)) {
      return false;
    }
    const e = o;
    const k1 = this.getKey();
    const k2 = e.getKey();
    if (k1 === k2 || (k1 !== null && k1 === k2)) {
      const v1 = this.getValue();
      const v2 = e.getValue();
      return v1 === v2 || (v1 !== null && v1 === v2);
    }
    return false;
  }

  recordAccess(m) {

  }

  recordRemoval(m) {

  }

  setValue(newValue) {
    const oldValue = this.value;
    this.value = newValue;
    return oldValue;
  }
}

class HashIterator extends Iterator {
  constructor(ht, type = ENTRIES) {
    super(ht);
    this.type = type;
    this.next = null;
    this.current = null;
    if (this.list.count > 0) {
      const t = this.list.map;
      while (this.cursor < t.length && !this.next) {
        this.next = t[this.cursor++];
      }
    }
  }

  hasNext() {
    return this.next !== null;
  }

  next() {
    switch (this.type) {
      case KEYS:
        return this.nextEntry().getKey();
      case VALUES:
        return this.nextEntry().getValue();
      case ENTRIES:
      default:
        return this.nextEntry();
    }
  }

  nextEntry() {
    const e = this.next;
    if (e === null) {
      throw new RangeError('NoSuchElementException');
    }
    if ((this.next = e.next) === null) {
      const t = this.list.map;
      while (this.cursor < t.length && !this.next) {
        this.next = t[this.cursor++];
      }
    }
    this.current = e;
    return e;
  }

  remove() {
    if (this.current === null) {
      throw new RangeError('IllegalStateException');
    }
    const k = this.current.key;
    this.current = null;
    this.list.removeEntryForKey(k);
  }
}

const DEFAULT_INITIAL_CAPACITY = 4;
const MAXIMUM_CAPACITY = 1 << 30;
const EMPTY_TABLE = [];

const bitCount = (i) => {
  let n = i;
  n -= ((n >>> 1) & 0x55555555);
  n = (n & 0x33333333) + ((i >>> 2) & 0x33333333);
  n = (n + (n >>> 4)) & 0x0f0f0f0f;
  n += (n >>> 8);
  n += (n >>> 16);
  return n & 0x3f;
};

const highestOneBit = (i) => {
  let n = i;
  n |= (i >> 1);
  n |= (n >> 2);
  n |= (n >> 4);
  n |= (n >> 8);
  n |= (n >> 16);
  return n - (n >>> 1);
};

const indexFor = (h, length) => h & (length - 1);

const roundUpToPowerOf2 = (number) => {
  let rounded = 0;
  rounded = number >= MAXIMUM_CAPACITY
    ? MAXIMUM_CAPACITY
    : (rounded = highestOneBit(number)) !== 0
      ? (bitCount(number) > 1) ? rounded << 1 : rounded
      : 1;
  return rounded;
};

export class HashMap extends AbstractMap {
  constructor({ initialCapacity = DEFAULT_INITIAL_CAPACITY, loadFactor = DEFAULT_LOAD_FACTOR, values = null } = {}) {
    super();
    let n = initialCapacity;
    const hasValues = values !== null && values instanceof AbstractMap;
    if (hasValues) {
      n = Math.max((values.size() / DEFAULT_LOAD_FACTOR) + 1, DEFAULT_INITIAL_CAPACITY);
    }
    if (n < 0) {
      throw new RangeError(`IllegalArgumentException Illegal initial capacity: ${n}`);
    }
    if (n > MAXIMUM_CAPACITY) {
      n = MAXIMUM_CAPACITY;
    } else if (n < DEFAULT_INITIAL_CAPACITY) {
      n = DEFAULT_INITIAL_CAPACITY;
    }
    if (loadFactor <= 0 || isNaN(loadFactor)) {
      throw new RangeError(`IllegalArgumentException Illegal load factor: ${loadFactor}`);
    }
    this.count = 0;
    this.map = EMPTY_TABLE;
    this.threshold = n;
    this.init();
    if (hasValues) {
      this.inflateTable(this.threshold);
      this.putAllForCreate(values);
    }
  }

  addEntry(hash, key, value, bucketIndex) {
    let h = hash;
    let b = bucketIndex;
    if ((this.count >= this.threshold) && this.map[b]) {
      this.resize(2 * this.map.length);
      h = (key === null) ? 0 : util.hashCode(key);
      b = indexFor(hash, this.map.length);
    }
    this.createEntry(h, key, value, b);
  }

  clear() {
    util.fill(this.table, null);
    this.count = 0;
  }

  containsKey(key) {
    return this.getEntry(key) !== null;
  }

  containsNullValue() {
    const tab = this.table;
    for (let i = 0; i < tab.length; i++) {
      for (let e = tab[i]; e !== null; e = e.next) {
        if (e.value === null) {
          return true;
        }
      }
    }
    return false;
  }

  containsValue(value) {
    if (value === null) {
      return this.containsNullValue();
    }
    const tab = this.map;
    for (let i = 0; i < tab.length; i++) {
      for (let e = tab[i]; e !== null; e = e.next) {
        if (value === e.value) {
          return true;
        }
      }
    }
    return false;
  }

  createEntry(h, key, value, bucketIndex) {
    const next = this.map[bucketIndex];
    this.map[bucketIndex] = new HashMapEntry({
      h, key, value, next,
    });
    this.count++;
  }

  get(key) {
    if (key === null) {
      return this.getForNullKey();
    }
    const entry = this.getEntry(key);
    return entry === null ? null : entry.getValue();
  }

  getEntry(key) {
    if (this.count === 0) {
      return null;
    }
    const hash = (key === null) ? 0 : util.hashCode(key);
    for (let e = this.map[indexFor(hash, this.map.length)]; e !== null; e = e.next) {
      let k;
      if (e.h === hash && ((k = e.key) === key || (key !== null && key === k))) {
        return e;
      }
    }
    return null;
  }

  getForNullKey() {
    if (this.count === 0) {
      return null;
    }
    for (let e = this.map[0]; e !== null; e = e.next) {
      if (e.key === null) {
        return e.value;
      }
    }
    return null;
  }

  inflateTable(toSize) {
    const capacity = roundUpToPowerOf2(toSize);
    let thresholdFloat = capacity * this.loadFactor;
    if (thresholdFloat > MAXIMUM_CAPACITY + 1) {
      thresholdFloat = MAXIMUM_CAPACITY + 1;
    }
    const threshold = thresholdFloat;
    // TODO: Not finished... WTF?
    this.map = new Array(capacity);
  }

  init() {

  }

  isEmpty() {
    return this.count === 0;
  }

  newEntryIterator() {
    return new HashIterator(this, ENTRIES);
  }

  newKeyIterator() {
    return new HashIterator(this, KEYS);
  }

  newValueIterator() {
    return new HashIterator(this, VALUES);
  }

  put(key, value) {
    if (this.map === EMPTY_TABLE) {
      this.inflateTable(this.threshold);
    }
    if (key === null) {
      return this.putForNullKey(value);
    }
    const hash = (key === null) ? 0 : util.hashCode(key);
    const i = indexFor(hash, this.map.length);
    let e = this.map[i];
    do {
      if (e) {
        let k;
        if (e.h === hash && ((k = e.key) === key || key === k)) {
          const oldValue = e.value;
          e.value = value;
          e.recordAccess(this);
          return oldValue;
        }
        e = e.next;
      }
    } while (e);
    this.addEntry(hash, key, value, i);
    return null;
  }

  putAll(m) {
    if (!(m instanceof AbstractMap)) {
      return;
    }
    const numKeysToBeAdded = m.size();
    if (numKeysToBeAdded === 0) {
      return;
    }
    if (this.map === EMPTY_TABLE) {
      this.inflateTable(Math.max(numKeysToBeAdded * this.loadFactor, this.threshold));
    }
    if (numKeysToBeAdded > this.threshold) {
      let targetCapacity = (numKeysToBeAdded / this.loadFactor + 1);
      if (targetCapacity > MAXIMUM_CAPACITY) {
        targetCapacity = MAXIMUM_CAPACITY;
      }
      let newCapacity = this.map.length;
      while (newCapacity < targetCapacity) {
        newCapacity <<= 1;
      }
      if (newCapacity > this.map.length) {
        this.resize(newCapacity);
      }
    }
    m
      .entries()
      .forEach(({key, value}) => this.put(key, value));
  }

  putAllForCreate(m) {
    m
      .entries()
      .forEach(({key, value}) => this.putForCreate(key, value));
  }

  putForCreate(key, value) {
    const hash = (key === null) ? 0 : util.hashCode(key);
    const i = indexFor(hash, this.map.length);
    let e = this.map[i];
    do {
      if (e) {
        let k;
        if (e.h === hash && ((k = e.key) === key || (key !== null && key === k))) {
          e.value = value;
          return;
        }
        e = e.next;
      }
    } while (e);
    this.createEntry(hash, key, value, i);
  }

  putForNullKey(value) {
    for (let e = this.map[0]; e !== null; e = e.next) {
      if (e.key === null) {
        const oldValue = e.value;
        e.value = value;
        e.recordAccess(this);
        return oldValue;
      }
    }
    this.addEntry(0, null, value, 0);
    return null;
  }

  remove(key) {
    const e = this.removeEntryForKey(key);
    return (e === null ? null : e.getValue());
  }

  removeEntryForKey(key) {
    if (this.count === 0) {
      return null;
    }
    const hash = (key === null) ? 0 : util.hashCode(key);
    const i = indexFor(hash, this.map.length);
    let prev = this.map[i];
    let e = prev;
    while (e) {
      const { next } = e.next;
      let k;
      if (e.h === hash && ((k = e.key) === key || (key !== null && key === k))) {
        this.count--;
        if (prev === e) {
          this.map[i] = next;
        } else {
          prev.next = next;
        }
        e.recordRemoval(this);
        return e;
      }
      prev = e;
      e = next;
    }
    return e;
  }

  removeMapping(o) {
    if (this.count === 0 || !(o instanceof HashtableEntry)) {
      return null;
    }
    const entry = o;
    const key = entry.getKey();
    const hash = (key === null) ? 0 : util.hashCode(key);
    const i = indexFor(hash, this.map.length);
    let prev = this.map[i];
    let e = prev;
    while (e) {
      const { next } = e.next;
      if (e.h === hash && e.equals(entry)) {
        this.count--;
        if (prev === e) {
          this.map[i] = next;
        } else {
          prev.next = next;
        }
        e.recordRemoval(this);
        return e;
      }
      prev = e;
      e = next;
    }
    return e;
  }

  resize(newCapacity) {
    const oldTable = this.map;
    const oldCapacity = oldTable.length;
    if (oldCapacity === MAXIMUM_CAPACITY) {
      this.threshold = Number.MAX_VALUE;
    }
    const newTable = new Array(newCapacity);
    this.transfer(newTable);
    this.map = newTable;
    this.threshold = Math.min(newCapacity * this.loadFactor, MAXIMUM_CAPACITY + 1);
  }

  size() {
    return this.count;
  }

  transfer(newTable) {
    const t = newTable;
    const newCapacity = t.length;
    const len = this.map.length;
    for (let i = 0; i < len; i++) {
      let e = this.map[i];
      while (e) {
        const { next } = e.next;
        const n = indexFor(e.h, newCapacity);
        e.next = t[i];
        t[n] = e;
        e = next;
      }
    }
  }
}
