/** @babel */
const HAS = Object.prototype.hasOwnProperty;

export class Enumeration {
  constructor(list = []) {
    this.list = list;
    this.cursor = 0;
  }

  destroy() {
    this.list = this.cursor = null;
  }

  hasMoreElements() {
    return this.cursor >= 0 && this.cursor < this.list.length;
  }

  nextElement() {
    const el = this.list[this.cursor];
    this.cursor++;
    if (this.cursor === this.list.length) {
      this.destroy();
    }
    return el;
  }

  toString() {
    return `
      Enumeration[cursor: ${this.cursor}, list: ${this.list.join(',')}]
    `;
  }
}

export class Iterator {
  constructor(list = []) {
    this.list = list;
    this.cursor = 0;
  }

  static div(num, denom) {
    return Math[num > 0 ? 'floor' : 'ceil'](num / denom);
  }

  hasNext() {
    return this.cursor < this.list.length;
  }

  hasPrevious() {
    return this.cursor > 0;
  }

  static mod(num, mod) {
    const remain = num % mod;
    return Math.floor(remain >= 0 ? remain : remain + mod);
  }

  next() {
    if (this.cursor < 0) {
      this.cursor = 0;
    }
    if (this.cursor < this.list.length) {
      const value = this.list[this.cursor];
      this.cursor += 1;
      return value;
    }
    return null;
  }

  previous() {
    if (this.cursor >= this.list.length) {
      this.cursor = this.list.length - 1;
    }
    if (this.cursor >= 0) {
      const value = this.list[this.cursor];
      this.cursor -= 1;
      return value;
    }
    return null;
  }

  remove() {
    if (this.cursor > 0 && this.cursor < this.list.length) {
      this.list.splice(this.cursor, 1);
    }
  }

  static remain(num, denom) {
    return Math[num > 0 ? 'floor' : 'ceil'](num % denom);
  }

  toString() {
    return `
      Iterator[cursor: ${this.cursor}, list: ${this.list.join(',')}]
    `;
  }
}

export class CircularIterator extends Iterator {
  constructor(list = []) {
    super(list);
  }

  next() {
    if (this.cursor < 0) {
      this.cursor = 0;
    }
    if (this.cursor < this.list.length) {
      this.cursor += 1;
      const index = Iterator.mod(this.cursor, this.list.length);
      return this.list[index];
    }
    return null;
  }

  previous() {
    if (this.cursor >= this.list.length) {
      this.cursor = this.list.length - 1;
    }
    if (this.cursor >= 0) {
      this.cursor -= 1;
      const index = Iterator.mod(this.cursor, this.list.length);
      return this.list[index];
    }
    return null;
  }
}

export class Comparator {
  compare(s1, s2) {
    if ((s1 === null &&
            s2 === null) ||
            s1 === s2) {
      return 0;
    }
    if (s1 !== null && HAS.call(s1, 'compareTo') && s1.compareTo !== null) {
      return s1.compareTo(s2);
    } else if (s2 !== null && HAS.call(s2, 'compareTo') && s2.compareTo !== null) {
      return s2.compareTo(s1);
    }
    if (typeof s1 === 'string' && typeof s2 === 'string') {
      const n1 = s1.length;
      const n2 = s2.length;
      let c1 = 0;
      let c2 = 0;
      for (let i1 = 0, i2 = 0; i1 < n1 && i2 < n2; i1++, i2++) {
        c1 = s1.charAt(i1);
        c2 = s2.charAt(i2);
        if (c1 !== c2) {
          c1 = c1.toUpperCase();
          c2 = c2.toUpperCase();
          if (c1 !== c2) {
            c1 = c1.toLowerCase();
            c2 = c2.toLowerCase();
            if (c1 !== c2) {
              return c1.charCodeAt(0) - c2.charCodeAt(0);
            }
          }
        }
      }
      return n1 - n2;
    } else if (typeof s1 === 'number' && typeof s2 === 'number') {
      return s1 < s2 ? -1 : 1;
    } else if (typeof s1 === 'boolean' && typeof s2 === 'boolean') {
      return ~~s1 < ~~s2 ? -1 : 1;
    } else if (typeof s1 === 'object' && typeof s2 === 'object') {
      if (s1.constructor === Object && s2.constructor === Object) {
        let o = -1;
        const keys = Object.keys(s1);
        let len = keys.length;
        while (len--) {
          const p = keys[len];
          if (HAS.call(s1, p) && HAS.call(s2, p)) {
            o = this.compare(s1[p], s2[p]);
            if (o !== 0) {
              break;
            }
          } else {
            break;
          }
        }
        return o;
      } else if (Array.isArray(s1) && Array.isArray(s2)) {
        const a1 = s1.length;
        const a2 = s2.length;
        let a = this.compare(a1, a2);
        if (a === 0) {
          for (let j1 = 0, j2 = 0; j1 < a1 && j2 < a2; j1++, j2++) {
            a = this.compare(s1[j1], s2[j2]);
            if (a !== 0) {
              break;
            }
          }
          return (a1 - a2) + a;
        }
        return a;
      } else if (s1 instanceof ArrayBuffer && s2 instanceof ArrayBuffer) {
        const b1 = s1.byteLength;
        const b2 = s2.byteLength;
        let a = this.compare(b1, b2);
        if (a === 0) {
          const len = a;
          const v1 = new Int8Array(s1);
          const v2 = new Int8Array(s2);
          for (let j1 = 0, j2 = 0; j1 < len && j2 < len; j1++, j2++) {
            a = this.compare(v1[j1], v2[j2]);
            if (a !== 0) {
              break;
            }
          }
        }
        return a;
      } else if ((s1 instanceof DataView && s2 instanceof DataView) ||
          (s1 instanceof TypedArray && s2 instanceof TypedArray)) {
        return this.compare(s1.buffer, s2.buffer);
      } else if (s1 instanceof Date && s2 instanceof Date) {
        return this.compare(s1.getTime(), s2.getTime());
      } else if (s1 instanceof Error && s2 instanceof Error) {
        return s1.name === s2.name ? 0 : -1;
      } else if (s1 instanceof RegExp && s2 instanceof RegExp) {
        return this.compare(s1.toString(), s2.toString());
      }
    } else if (typeof s1 === 'function' && typeof s2 === 'function') {
      return s1 === s2;
    }
    return -1;
  }
}
