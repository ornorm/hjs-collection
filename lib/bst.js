/** @babel */
import {Comparator} from './iterator';

export class BSTNode {
  constructor(key, val, size) {
    this.key = key;
    this.val = val;
    this.size = size;
    this.left = null;
    this.right = null;
  }
}

export class BST extends Comparator {
  constructor() {
    super();
    this.root = null;
  }

  ceiling(key) {
    if (key === null) {
      throw new ReferenceError('argument to ceiling() is null');
    }
    if (this.isEmpty()) {
      throw new RangeError('called ceiling() with empty symbol table');
    }
    const x = this.internalCeiling(this.root, key);
    if (x === null) {
      return null;
    }
    return x.key;
  }

  check() {
    const isBSTFlag = this.isBST();
    if (!isBSTFlag) {
      console.log('Not in symmetric order');
    }
    const isSizeConsistentFlag = this.isSizeConsistent();
    if (!isSizeConsistentFlag) {
      console.log('Subtree counts not consistent');
    }
    const isRankConsistentFlag = this.isRankConsistent();
    if (!isRankConsistentFlag) {
      console.log('Ranks not consistent');
    }
    return isBSTFlag && isSizeConsistentFlag && isRankConsistentFlag;
  }

  contains(key) {
    if (key === null) {
      throw new ReferenceError('argument to contains() is null');
    }
    return this.get(key) !== null;
  }

  deleteMax() {
    if (this.isEmpty()) {
      throw new RangeError('Symbol table underflow');
    }
    this.root = this.internalDeleteMax(this.root);
    this.check();
  }

  deleteMin() {
    if (this.isEmpty()) {
      throw new RangeError('Symbol table underflow');
    }
    this.root = this.internalDeleteMin(this.root);
    this.check();
  }

  floor(key) {
    if (key === null) {
      throw new ReferenceError('argument to floor() is null');
    }
    if (this.isEmpty()) {
      throw new RangeError('called floor() with empty symbol table');
    }
    const x = this.internalFloor(this.root, key);
    if (x === null) {
      return null;
    }
    return x.key;
  }

  get(key) {
    return this.internalGet(this.root, key);
  }

  getKeys(lo, hi) {
    if (lo === null) {
      throw new ReferenceError('first argument to keys() is null');
    }
    if (hi === null) {
      throw new ReferenceError('second argument to keys() is null');
    }
    const queue = [];
    this.internalKeys(this.root, queue, lo, hi);
    return queue;
  }

  height() {
    return this.internalHeight(this.root);
  }

  internalCeiling(x, key) {
    if (x === null) {
      return null;
    }
    const cmp = this.compare(key, x.key);
    if (cmp === 0) {
      return x;
    }
    if (cmp < 0) {
      const t = this.internalCeiling(x.left, key);
      if (t !== null) {
        return t;
      }
      return x;
    }
    return this.internalCeiling(x.right, key);
  }

  internalDeleteMax(x) {
    if (x.right === null) {
      return x.left;
    }
    const y = x;
    y.right = this.internalDeleteMax(y.right);
    y.size = this.internalSize(y.left) + this.internalSize(y.right) + 1;
    return y;
  }

  internalDeleteMin(x) {
    if (x.left === null) {
      return x.right;
    }
    const y = x;
    y.left = this.internalDeleteMin(y.left);
    y.size = this.internalSize(y.left) + this.internalSize(y.right) + 1;
    return y;
  }

  internalFloor(x, key) {
    if (x === null) {
      return null;
    }
    const cmp = this.compare(key, x.key);
    if (cmp === 0) {
      return x;
    }
    if (cmp < 0) {
      return this.internalFloor(x.left, key);
    }
    const t = this.internalFloor(x.right, key);
    if (t !== null) {
      return t;
    }
    return x;
  }

  internalGet(x, key) {
    if (x === null) {
      return null;
    }
    const cmp = this.compare(key, x.key);
    if (cmp < 0) {
      return this.internalGet(x.left, key);
    } else if (cmp > 0) {
      return this.internalGet(x.right, key);
    }
    return x.val;
  }

  internalHeight(x) {
    if (x === null) {
      return -1;
    }
    return 1 + Math.max(this.internalHeight(x.left), this.internalHeight(x.right));
  }

  internalIsBST(x, min, max) {
    if (x === null) {
      return true;
    }
    if (min !== null && this.compare(x.key, min) <= 0) {
      return false;
    }
    if (max !== null && this.compare(x.key, max) >= 0) {
      return false;
    }
    return this.internalIsBST(x.left, min, x.key) && this.internalIsBST(x.right, x.key, max);
  }

  internalKeys(x, queue, lo, hi) {
    if (x === null) {
      return;
    }
    const cmplo = this.compare(lo, x.key);
    const cmphi = this.compare(hi, x.key);
    if (cmplo < 0) {
      this.internalKeys(x.left, queue, lo, hi);
    }
    if (cmplo <= 0 && cmphi >= 0) {
      queue.push(x.key);
    }
    if (cmphi > 0) {
      this.internalKeys(x.right, queue, lo, hi);
    }
  }

  internalMax(x) {
    if (x.right === null) {
      return x;
    }
    return this.internalMax(x.right);
  }

  internalMin(x) {
    if (x.left === null) {
      return x;
    }
    return this.internalMin(x.left);
  }

  internalPut(x, key, val) {
    const y = x;
    if (y === null) {
      return new BSTNode(key, val, 1);
    }
    const cmp = this.compare(key, y.key);
    if (cmp < 0) {
      y.left = this.internalPut(y.left, key, val);
    } else if (cmp > 0) {
      y.val = val;
    }
    y.size = 1 + this.internalSize(y.left) + this.internalSize(y.right);
    return y;
  }

  internalRank(key, x) {
    if (x === null) {
      return 0;
    }
    const cmp = this.compare(key, x.key);
    if (cmp < 0) {
      return this.internalRank(key, x.left);
    } else if (cmp > 0) {
      return 1 + this.internalSize(x.left) + this.internalRank(key, x.right);
    }
    return this.internalSize(x.left);
  }

  internalRemove(x, key) {
    if (x === null) {
      return null;
    }
    const cmp = this.compare(key, x.key);
    let y = x;
    if (cmp < 0) {
      y.left = this.internalRemove(y.left, key);
    } else if (cmp > 0) {
      y.right = this.internalRemove(y.right, key);
    } else {
      if (y.right === null) {
        return y.left;
      }
      if (y.left === null) {
        return y.right;
      }
      const t = y;
      y = this.internalMin(t.right);
      y.right = this.internalDeleteMin(t.right);
      y.left = t.left;
    }
    y.size = this.internalSize(y.left) + this.internalSize(y.right) + 1;
    return y;
  }

  internalSelect(x, k) {
    if (x === null) {
      return null;
    }
    const t = this.internalSize(x.left);
    if (t > k) {
      return this.internalSelect(x.left, k);
    } else if (t < k) {
      return this.internalSelect(x.right, k - t - 1);
    }
    return x;
  }

  internalSize(x) {
    return x ? x.size : 0;
  }

  internalIsSizeConsistent(x) {
    if (x === null) {
      return true;
    }
    if (x.size !== this.internalSize(x.left) + this.internalSize(x.right) + 1) {
      return false;
    }
    return this.internalIsSizeConsistent(x.left) && this.internalIsSizeConsistent(x.right);
  }

  isBST() {
    return this.internalIsBST(this.root, null, null);
  }

  isRankConsistent() {
    for (let i = 0; i < this.size(); i++) {
      if (i !== this.rank(this.select(i))) {
        return false;
      }
    }
    let key = null;
    const keys = this.keys();
    let len = keys.length;
    while (len--) {
      key = keys[len];
      if (this.compare(key, this.select(this.rank(key))) !== 0) {
        return false;
      }
    }
    return true;
  }

  isSizeConsistent() {
    return this.internalIsSizeConsistent(this.root);
  }

  isEmpty() {
    return this.size() === 0;
  }

  keys() {
    return this.getKeys(this.min(), this.max());
  }

  levelOrder() {
    let x = null;
    const keys = [];
    const queue = [];
    queue.push(this.root);
    while (queue.length > 0) {
      x = queue.pop();
      if (x !== null) {
        keys.push(x.key);
        queue.push(x.left);
        queue.push(x.right);
      }
    }
    return keys;
  }

  max() {
    if (this.isEmpty()) {
      throw new RangeError('called max() with empty symbol table');
    }
    return this.internalMax(this.root).key;
  }

  min() {
    if (this.isEmpty()) {
      throw new RangeError('called min() with empty symbol table');
    }
    return this.internalMin(this.root).key;
  }

  put(key, val) {
    if (key === null) {
      throw new ReferenceError('first argument to put() is null');
    }
    if (val === null) {
      this.remove(key);
    }
    this.root = this.internalPut(this.root, key, val);
    this.check();
  }

  rank(key) {
    if (key === null) {
      throw new ReferenceError('argument to rank() is null');
    }
    return this.internalRank(key, this.root);
  }

  remove(key) {
    if (key === null) {
      throw new ReferenceError('argument to delete() is null');
    }
    this.root = this.internalRemove(this.root, key);
    this.check();
  }

  select(k) {
    if (k < 0 || k >= this.size()) {
      throw new RangeError('k < 0 or k >= size');
    }
    const x = this.internalSelect(this.root, k);
    return x.key;
  }

  size() {
    return this.internalSize(this.root);
  }

  sizeof(lo, hi) {
    if (lo === null) {
      throw new ReferenceError('first argument to size() is null');
    }
    if (hi === null) {
      throw new ReferenceError('second argument to size() is null');
    }
    if (this.compare(lo, hi) > 0) {
      return 0;
    }
    if (this.contains(hi)) {
      return (this.rank(hi) - this.rank(lo)) + 1;
    }
    return this.rank(hi) - this.rank(lo);
  }
}
