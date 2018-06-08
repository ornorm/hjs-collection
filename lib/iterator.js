/** @babel */
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
        let el = this.list[this.cursor];
        this.cursor++;
        if (this.cursor === this.list.length) {
            this.destroy();
        }
        return el;
    }

    toString() {
        return `
      Enumeration[cursor: ${this.cursor}, list: ${this.list.join(",")}]
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
        let remain = num % mod;
        return Math.floor(remain >= 0 ? remain : remain + mod);
    }

    next() {
        if (this.cursor < 0) {
            this.cursor = 0;
        }
        if (this.cursor < this.list.length) {
            let value = this.list[this.cursor];
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
            let value = this.list[this.cursor];
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
      Iterator[cursor: ${this.cursor}, list: ${this.list.join(",")}]
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
            let index = Iterator.mod(this.cursor, this.list.length);
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
            let index = Iterator.mod(this.cursor, this.list.length);
            return this.list[index];
        }
        return null;
    }

}

export class Comparator {

    constructor() {
    }

    compare(s1, s2) {
        if ((s1 === null &&
            s2 === null) ||
            s1 === s2) {
            return 0;
        }
        if (s1 !== null && s1.hasOwnProperty('compareTo') && s1['compareTo'] !== null) {
            return s1['compareTo'](s2);
        } else if (s2 !== null && s2.hasOwnProperty('compareTo') && s2['compareTo'] !== null) {
            return s2['compareTo'](s1);
        }
        if (typeof s1 === "string" && typeof s2 === "string") {
            let n1 = s1.length;
            let n2 = s2.length;
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
        } else if (typeof s1 === "number" && typeof s2 === "number") {
            return s1 < s2 ? -1 : 1;
        } else if (typeof s1 === "boolean" && typeof s2 === "boolean") {
            return ~~s1 < ~~s2 ? -1 : 1;
        } else if (typeof s1 === "object" && typeof s2 === "object") {
            if (s1.constructor === Object && s2.constructor === Object) {
                let o = -1;
                for (let p in s1) {
                    if (s1.hasOwnProperty(p) && s2.hasOwnProperty(p)) {
                        o = this.compare(s1[p], s2[p]);
                        if (o === 0) {
                            continue;
                        }
                    }
                    break;
                }
                return o;
            } else if (Array.isArray(s1) && Array.isArray(s2)) {
                let a1 = s1.length;
                let a2 = s2.length;
                let a = this.compare(a1, a2);
                if (a === 0) {
                    for (let j1 = 0, j2 = 0; j1 < a1 && j2 < a2; j1++, j2++) {
                        a = this.compare(s1[j1], s2[j2]);
                        if (a === 0) {
                            continue;
                        }
                        break;
                    }
                    return (a1 - a2) + a;
                }
                return a;
            } else if (s1 instanceof ArrayBuffer && s2 instanceof ArrayBuffer) {
                let b1 = s1.byteLength;
                let b2 = s2.byteLength;
                let a = this.compare(b1, b2);
                if (a === 0) {
                    let len = a;
                    let v1 = new Int8Array(s1);
                    let v2 = new Int8Array(s2);
                    for (let j1 = 0, j2 = 0; j1 < len && j2 < len; j1++, j2++) {
                        a = this.compare(v1[j1], v2[j2]);
                        if (a === 0) {
                            continue;
                        }
                        break;
                    }
                }
                return a;
            } else if (s1 instanceof DataView && s2 instanceof DataView ||
                s1 instanceof TypedArray && s2 instanceof TypedArray) {
                return this.compare(s1.buffer, s2.buffer);
            } else if (s1 instanceof Date && s2 instanceof Date) {
                return this.compare(s1.getTime(), s2.getTime());
            } else if (s1 instanceof Error && s2 instanceof Error) {
                return s1.name === s2.name ? 0 : -1;
            } else if (s1 instanceof RegExp && s2 instanceof RegExp) {
                return this.compare(s1.toString(), s2.toString());
            }
        } else if (typeof s1 === "function" && typeof s2 === "function") {
            return s1 === s2;
        }
        return -1;
    }

}