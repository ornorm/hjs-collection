/** @babel */
import * as util from 'hjs-core/lib/util';
import {AbstractMap} from './map';

const HAS = Object.prototype.hasOwnProperty;

const BASE_SIZE = 4;
const CACHE_SIZE = 10;

let mTwiceBaseCacheSize = 0;
let mTwiceBaseCache = null;
let mBaseCacheSize = 0;
let mBaseCache = null;

const freeArrays = (hashes, array, size) => {
  if (hashes.length === (BASE_SIZE * 2) && mTwiceBaseCacheSize < CACHE_SIZE) {
    const twiceBaseCache = array;
    twiceBaseCache[0] = mTwiceBaseCache;
    twiceBaseCache[1] = hashes;
    for (let i = (size << 1) - 1; i >= 2; i--) {
      twiceBaseCache[i] = null;
    }
    mTwiceBaseCache = twiceBaseCache;
    mTwiceBaseCacheSize++;
    console.log(`Storing 2x cache ${array} now have ${mTwiceBaseCacheSize} entries`);
  } else if (hashes.length === BASE_SIZE && mBaseCacheSize < CACHE_SIZE) {
    const baseCache = array;
    baseCache[0] = mBaseCache;
    baseCache[1] = hashes;
    for (let i = (size << 1) - 1; i >= 2; i--) {
      baseCache[i] = null;
    }
    mBaseCache = baseCache;
    mBaseCacheSize++;
    console.log(`Storing 1x cache ${array} now have ${mBaseCacheSize} entries`);
  }
};

const EMPTY_IMMUTABLE_INTS = [];

export class ArrayMap {
  constructor({capacity = 0, immutable = false, map = null} = {}) {
    if (map !== null) {
      this.mHashes = [];
      this.mArray = [];
      this.mSize = 0;
      if (map instanceof ArrayMap ||
                map instanceof AbstractMap) {
        map
          .keys()
          .forEach(key => this.put(key, map.get(key)));
      } else {
        Object
          .keys(map)
          .forEach((key) => {
            if (HAS.call(map, key)) {
              this.put(key, map[key]);
            }
          });
      }
    } else {
      this.mArray = [];
      if (immutable) {
        this.mHashes = EMPTY_IMMUTABLE_INTS;
        this.mSize = 0;
      } else {
        this.mHashes = [];
        if (capacity <= 0) {
          this.mSize = 0;
        } else {
          this.allocArrays(capacity);
          this.mSize = 0;
        }
      }
    }
  }

  allocArrays(size) {
    if (this.mHashes === EMPTY_IMMUTABLE_INTS) {
      throw new TypeError('UnsupportedOperationException ArrayMap is immutable');
    }
    if (size === (BASE_SIZE * 2) && mTwiceBaseCache) {
      const [twiceBaseCache, hashes] = mTwiceBaseCache;
      const array = mTwiceBaseCache;
      this.mArray = array;
      mTwiceBaseCache = twiceBaseCache;
      this.mHashes = hashes;
      array[0] = null;
      array[1] = null;
      mTwiceBaseCacheSize--;
      console.log(`Retrieving 2x cache ${this.mHashes} now have ${
        mTwiceBaseCacheSize} entries`);
    } else if (size === BASE_SIZE && mBaseCache) {
      const [baseCache, hashes] = mBaseCache;
      const array = mBaseCache;
      this.mArray = array;
      mBaseCache = baseCache;
      this.mHashes = hashes;
      array[0] = null;
      array[1] = null;
      mBaseCacheSize--;
      console.log(`Retrieving 1x cache ${this.mHashes} now have ${
        mBaseCacheSize} entries`);
    } else {
      this.mHashes = new Array(size);
      this.mArray = new Array(size << 1);
    }
  }

  append(key, value) {
    let index = this.mSize;
    const hash = key === null ? 0 : util.hashCode(key);
    if (index >= this.mHashes.length) {
      throw new RangeError('IllegalStateException Array is full');
    }
    if (index > 0 && this.mHashes[index - 1] > hash) {
      const e = new Error('here');
      console.error(`New hash ${hash
      } is before end of array hash ${this.mHashes[index - 1]
      } at index ${index} key ${key}`, e);
      this.put(key, value);
      return;
    }
    this.mSize = index + 1;
    this.mHashes[index] = hash;
    index <<= 1;
    this.mArray[index] = key;
    this.mArray[index + 1] = value;
  }

  clear() {
    if (this.mSize > 0) {
      freeArrays(this.mHashes, this.mArray, this.mSize);
      this.mHashes = [];
      this.mArray = [];
      this.mSize = 0;
    }
  }

  clone() {
    return new ArrayMap({map: this});
  }

  containsKey(key) {
    return this.indexOfKey(key) >= 0;
  }

  containsValue(value) {
    return this.indexOfValue(value) >= 0;
  }

  ensureCapacity(minimumCapacity) {
    if (this.mHashes.length < minimumCapacity) {
      const ohashes = this.mHashes;
      const oarray = this.mArray;
      this.allocArrays(minimumCapacity);
      if (this.mSize > 0) {
        util.arraycopy(ohashes, 0, this.mHashes, 0, this.mSize);
        util.arraycopy(oarray, 0, this.mArray, 0, this.mSize << 1);
      }
      freeArrays(ohashes, oarray, this.mSize);
    }
  }

  entries() {
    let len = this.size();
    const tmp = [];
    while (len--) {
      tmp[len] = this.keyAt(len);
    }
    return tmp;
  }

  equals(object) {
    if (this === object) {
      return true;
    }
    if (!(object instanceof ArrayMap)) {
      return false;
    }
    const map = object;
    if (this.size() !== map.size()) {
      return false;
    }
    let key = null;
    let mine = null;
    let theirs = null;
    for (let i = 0; i < this.mSize; i++) {
      key = this.keyAt(i);
      mine = this.valueAt(i);
      theirs = map.get(key);
      if (mine === null) {
        if (theirs !== null || !map.containsKey(key)) {
          return false;
        } else if (mine !== theirs) {
          return false;
        }
      }
    }
    return true;
  }

  erase() {
    if (this.mSize > 0) {
      const N = this.mSize << 1;
      const array = this.mArray;
      for (let i = 0; i < N; i++) {
        array[i] = null;
      }
      this.mSize = 0;
    }
  }

  get(key) {
    const index = this.indexOfKey(key);
    return index >= 0 ? this.mArray[(index << 1) + 1] : null;
  }

  hashCode() {
    const hashes = this.mHashes;
    const array = this.mArray;
    let result = 0;
    let value = null;
    for (let i = 0, v = 1, s = this.mSize; i < s; i++, v += 2) {
      value = array[v];
      result += hashes[i] ^ (value === null ? 0 : util.hashCode(value));
    }
    return result;
  }

  indexOf(key, hash) {
    const N = this.mSize;
    // Important fast case: if nothing is in here, nothing to look for.
    if (N === 0) {
      return ~0;
    }
    const index = util.binarySearch(this.mHashes, N, hash);
    // If the hash code wasn't found, then we have no entry for this key.
    if (index < 0) {
      return index;
    }
    // If the key at the returned index matches, that's what we want.
    if (key === this.mArray[index << 1]) {
      return index;
    }
    let end = 0;
    // Search for a matching key after the index.
    for (end = index + 1; end < N && this.mHashes[end] === hash; end++) {
      if (key === this.mArray[end << 1]) {
        return end;
      }
    }
    // Search for a matching key before the index.
    for (let i = index - 1; i >= 0 && this.mHashes[i] === hash; i--) {
      if (key === this.mArray[i << 1]) {
        return i;
      }
    }
    // Key not found -- return negative value indicating where a
    // new entry for this key should go.  We use the end of the
    // hash chain to reduce the number of array entries that will
    // need to be copied when inserting.
    return ~end;
  }

  indexOfKey(key) {
    return key === null ? this.indexOfNull() : this.indexOf(key, util.hashCode(key));
  }

  indexOfNull() {
    const N = this.mSize;
    // Important fast case: if nothing is in here, nothing to look for.
    if (N === 0) {
      return ~0;
    }
    const index = util.binarySearch(this.mHashes, N, 0);
    // If the hash code wasn't found, then we have no entry for this key.
    if (index < 0) {
      return index;
    }
    // If the key at the returned index matches, that's what we want.
    if (this.mArray[index << 1] === null) {
      return index;
    }
    let end = 0;
    // Search for a matching key after the index.
    for (end = index + 1; end < N && this.mHashes[end] === 0; end++) {
      if (this.mArray[end << 1] === null) {
        return end;
      }
    }
    // Search for a matching key before the index.
    for (let i = index - 1; i >= 0 && this.mHashes[i] === 0; i--) {
      if (this.mArray[i << 1] === null) {
        return i;
      }
    }
    // Key not found -- return negative value indicating where a
    // new entry for this key should go.  We use the end of the
    // hash chain to reduce the number of array entries that will
    // need to be copied when inserting.
    return ~end;
  }

  indexOfValue(value) {
    const N = this.mSize * 2;
    const array = this.mArray;
    if (value === null) {
      for (let i = 1; i < N; i += 2) {
        if (array[i] === null) {
          return i >> 1;
        }
      }
    } else {
      for (let i = 1; i < N; i += 2) {
        if (value === array[i]) {
          return i >> 1;
        }
      }
    }
    return -1;
  }

  isEmpty() {
    return this.mSize <= 0;
  }

  keyAt(index) {
    return this.mArray[index << 1];
  }

  put(key, value) {
    let hash = 0;
    let index = 0;
    if (key === null) {
      index = this.indexOfNull();
    } else {
      hash = util.hashCode(key);
      index = this.indexOf(key, hash);
    }
    if (index >= 0) {
      index = (index << 1) + 1;
      const old = this.mArray[index];
      this.mArray[index] = value;
      return old;
    }
    index = ~index;
    if (this.mSize >= this.mHashes.length) {
      let n = BASE_SIZE;
      if (this.mSize >= (BASE_SIZE * 2)) {
        n = this.mSize + (this.mSize >> 1);
      } else if (this.mSize >= BASE_SIZE) {
        n = BASE_SIZE * 2;
      }
      console.log(`put: grow from ${this.mHashes.length} to ${n}`);
      const ohashes = this.mHashes;
      const oarray = this.mArray;
      this.allocArrays(n);
      if (this.mHashes.length > 0) {
        console.log(`put: copy 0-${this.mSize} to 0`);
        util.arraycopy(ohashes, 0, this.mHashes, 0, ohashes.length);
        util.arraycopy(oarray, 0, this.mArray, 0, oarray.length);
      }
      freeArrays(ohashes, oarray, this.mSize);
    }
    if (index < this.mSize) {
      console.log(`put: move ${index}-${this.mSize - index
      } to ${index + 1}`);
      util.arraycopy(this.mHashes, index, this.mHashes, index + 1, this.mSize - index);
      util.arraycopy(this.mArray, index << 1, this.mArray, (index + 1) << 1, (this.mSize - index) << 1);
    }
    this.mHashes[index] = hash;
    this.mArray[index << 1] = key;
    this.mArray[(index << 1) + 1] = value;
    this.mSize++;
    return null;
  }

  putAll(array) {
    const N = array.size();
    this.ensureCapacity(this.mSize + N);
    if (this.mSize === 0) {
      if (N > 0) {
        util.arraycopy(array.mHashes, 0, this.mHashes, 0, N);
        util.arraycopy(array.mArray, 0, this.mArray, 0, N << 1);
        this.mSize = N;
      }
    } else {
      for (let i = 0; i < N; i++) {
        this.put(array.keyAt(i), array.valueAt(i));
      }
    }
  }

  remove(key) {
    const index = this.indexOfKey(key);
    if (index >= 0) {
      return this.removeAt(index);
    }
    return null;
  }

  removeAt(index) {
    const old = this.mArray[(index << 1) + 1];
    if (this.mSize <= 1) {
      // Now empty.
      console.log(`remove: shrink from ${this.mHashes.length} to 0`);
      freeArrays(this.mHashes, this.mArray, this.mSize);
      this.mHashes = [];
      this.mArray = [];
      this.mSize = 0;
    } else if (this.mHashes.length > (BASE_SIZE * 2) && this.mSize < this.mHashes.length / 3) {
      // Shrunk enough to reduce size of arrays.  We don't allow it to
      // shrink smaller than (BASE_SIZE*2) to avoid flapping between
      // that and BASE_SIZE.
      const n = this.mSize > (BASE_SIZE * 2) ?
        (this.mSize + (this.mSize >> 1)) :
        (BASE_SIZE * 2);
      console.log(`remove: shrink from ${this.mHashes.length} to ${n}`);
      const ohashes = this.mHashes;
      const oarray = this.mArray;
      this.allocArrays(n);
      this.mSize--;
      if (index > 0) {
        console.log(`remove: copy from 0-${index} to 0`);
        util.arraycopy(ohashes, 0, this.mHashes, 0, index);
        util.arraycopy(oarray, 0, this.mArray, 0, index << 1);
      }
      if (index < this.mSize) {
        console.log(`remove: copy from ${index + 1}-${this.mSize} to ${index}`);
        util.arraycopy(ohashes, index + 1, this.mHashes, index, this.mSize - index);
        util.arraycopy(oarray, (index + 1) << 1, this.mArray, index << 1, (this.mSize - index) << 1);
      }
    } else {
      this.mSize--;
      if (index < this.mSize) {
        console.log(`remove: move ${index + 1}-${this.mSize} to ${index}`);
        util.arraycopy(this.mHashes, index + 1, this.mHashes, index, this.mSize - index);
        util.arraycopy(this.mArray, (index + 1) << 1, this.mArray, index << 1, (this.mSize - index) << 1);
      }
      this.mArray[this.mSize << 1] = null;
      this.mArray[(this.mSize << 1) + 1] = null;
    }
    return old;
  }

  setValueAt(index, value) {
    const idx = (index << 1) + 1;
    const old = this.mArray[idx];
    this.mArray[idx] = value;
    return old;
  }

  size() {
    return this.mSize;
  }

  toString() {
    if (this.isEmpty()) {
      return '{}';
    }
    let key = null;
    let value = null;
    let buffer = '{';
    for (let i = 0; i < this.mSize; i++) {
      if (i > 0) {
        buffer += ', ';
      }
      key = this.keyAt(i);
      if (key !== this) {
        buffer += key;
      } else {
        buffer += '(this Map)';
      }
      buffer += '=';
      value = this.valueAt(i);
      if (value !== this) {
        buffer += value;
      } else {
        buffer += '(this ArrayMap)';
      }
    }
    buffer += '}';
    return buffer;
  }

  validate() {
    const N = this.mSize;
    if (N <= 1) {
      // There can't be dups.
      return;
    }
    let hash = 0;
    let basei = 0;
    let cur = null;
    let prev = null;
    let basehash = this.mHashes[0];
    for (let i = 1; i < N; i++) {
      hash = this.mHashes[i];
      if (hash !== basehash) {
        basehash = hash;
        basei = i;
      } else {
        // We are in a run of entries with the same hash code.  Go backwards through
        // the array to see if any keys are the same.
        cur = this.mArray[i << 1];
        for (let j = i - 1; j >= basei; j--) {
          prev = this.mArray[j << 1];
          if (cur === prev) {
            throw new ReferenceError(`IllegalArgumentException Duplicate key in ArrayMap: ${cur}`);
          }
          if (cur !== null && prev !== null && cur === prev) {
            throw new ReferenceError(`IllegalArgumentException Duplicate key in ArrayMap: ${cur}`);
          }
        }
      }
    }
  }

  valueAt(index) {
    return this.mArray[(index << 1) + 1];
  }

  values() {
    let len = this.size();
    const tmp = [];
    while (len--) {
      tmp[len] = this.valueAt(len);
    }
    return tmp;
  }
}

const DELETED = {};

export class SparseArray {
  constructor({capacity = 0} = {}) {
    this.mSize = 0;
    this.mGarbage = false;
    const initialCapacity = capacity;
    if (initialCapacity === 0) {
      this.mKeys = [];
      this.mValues = [];
    } else {
      this.mValues = new Array(initialCapacity * 2);
      this.mKeys = new Array(this.mValues.length);
    }
  }

  append(key, value) {
    if (this.mSize !== 0 && key <= this.mKeys[this.mSize - 1]) {
      this.put(key, value);
      return;
    }
    if (this.mGarbage && this.mSize >= this.mKeys.length) {
      this.gc();
    }
    this.mKeys.push(key);
    this.mValues.push(value);
    this.mSize++;
  }

  del(key) {
    const i = util.binarySearch(this.mKeys, this.mSize, key);
    if (i >= 0) {
      if (this.mValues[i] !== DELETED) {
        this.mValues[i] = DELETED;
        this.mGarbage = true;
      }
    }
  }

  clear() {
    const n = this.mSize;
    const values = this.mValues;
    for (let i = 0; i < n; i++) {
      values[i] = null;
    }
    this.mSize = 0;
    this.mGarbage = false;
  }

  gc() {
    let size = 0;
    const keys = this.mKeys;
    const values = this.mValues;
    values
      .forEach((v, k) => {
        if (v !== DELETED) {
          if (k !== size) {
            keys[size] = this.mKeys[k];
            values[size] = v;
            values[k] = null;
          }
          size++;
        }
      });
    this.mGarbage = false;
    this.mSize = size;
  }

  get(key, valueIfKeyNotFound) {
    const i = util.binarySearch(this.mKeys, this.mSize, key);
    if (i < 0 || this.mValues[i] === DELETED) {
      return valueIfKeyNotFound;
    }
    return this.mValues[i];
  }

  indexOfKey(key) {
    if (this.mGarbage) {
      this.gc();
    }
    return util.binarySearch(this.mKeys, this.mSize, key);
  }

  indexOfValue(value) {
    if (this.mGarbage) {
      this.gc();
    }
    let k = this.mValues.length;
    while (k--) {
      const v = this.mValues[k];
      if (v === value) {
        return k;
      }
    }
    return -1;
  }

  keyAt(index) {
    if (this.mGarbage) {
      this.gc();
    }
    return this.mKeys[index];
  }

  put(key, value) {
    let i = util.binarySearch(this.mKeys, this.mSize, key);
    if (i >= 0) {
      this.mValues[i] = value;
    } else {
      i = ~i;
      if (i < this.mSize && this.mValues[i] === DELETED) {
        this.mKeys[i] = key;
        this.mValues[i] = value;
        return;
      }
      if (this.mGarbage && this.mSize >= this.mKeys.length) {
        this.gc();
        i = ~util.binarySearch(this.mKeys, this.mSize, key);
      }
      this.mKeys.splice(i, 0, key);
      this.mValues.splice(i, 0, value);
      this.mSize++;
    }
  }

  remove(key) {
    this.del(key);
  }

  removeAt(index) {
    if (this.mValues[index] !== DELETED) {
      this.mValues[index] = DELETED;
      this.mGarbage = true;
    }
  }

  removeAtRange(index, size) {
    const end = Math.min(this.mSize, index + size);
    for (let i = index; i < end; i++) {
      this.removeAt(i);
    }
  }

  removeReturnOld(key) {
    const i = util.binarySearch(this.mKeys, this.mSize, key);
    if (i >= 0) {
      if (this.mValues[i] !== DELETED) {
        const old = this.mValues[i];
        this.mValues[i] = DELETED;
        this.mGarbage = true;
        return old;
      }
    }
    return null;
  }

  setValueAt(index, value) {
    if (this.mGarbage) {
      this.gc();
    }
    this.mValues[index] = value;
  }

  size() {
    if (this.mGarbage) {
      this.gc();
    }
    return this.mSize;
  }

  valueAt(index) {
    if (this.mGarbage) {
      this.gc();
    }
    return this.mValues[index];
  }
}
