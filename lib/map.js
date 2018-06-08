/** @babel */
export class AbstractMap {

    constructor(values = {}) {
        this.map = new Map();
        this.putAll(values);
    }

    clear() {
        this.map.clear();
    }

    clone() {
        return new AbstractMap(this);
    }

    containsKey(key) {
        return this.map.has(key);
    }

    containsValue(value) {
        let values = this.map.values();
        for (const v of values) {
            if (v === value) {
                return true;
            }
        }
        return false;
    }

    finalize() {
        this.map.clear();
        this.map = null;
    }

    entries() {
        let keys = this.map.keys();
        let result = [];
        for (const [index, key] of keys) {
            result[index] = { key, value: this.map.get(key) };
        }
        return result;
    }

    entrySet() {
        return new Set(this.entries());
    }

    get(key) {
        if (key === null) {
            return null;
        }
        return this.map.get(key);
    }

    isEmpty() {
        return this.map.size === 0;
    }

    keys() {
        return this.map.keys();
    }

    keysSet() {
        return new Set(this.keys());
    }

    put(key, value) {
        if (key === null) {
            return null;
        }
        let old = this.map.get(key);
        this.map.set(key, value);
        return old;
    }

    putAll(map) {
        if (map === null) {
            return;
        } else {
            if (map instanceof AbstractMap) {
                let keys = map.keys();
                let len = keys.length;
                while (len--) {
                    this.put(keys[len], map.get(keys[len]));
                }
            } else if (map instanceof Map) {
                let keys = map.keys();
                for (const key of keys) {
                    this.put(key, map.get(key));
                }
            } else if (Array.isArray(map)) {
                map.forEach((e, index) => {
                    this.put(index, e);
                });
            } else {
                for (let p in map) {
                    if (map.hasOwnProperty(p)) {
                        this.put(p, map[p]);
                    }
                }
            }
        }
    }

    remove(key) {
        if (key === null) {
            return;
        }
        let old = this.map.get(key);
        if (old !== null) {
            this.map.delete(key);
        }
        return old;
    }

    size() {
        return this.map.size;
    }

    toMap() {
        return new Map(this.map);
    }

    toObject() {
        let o = {};
        let keys = this.map.keys();
        for (const key of keys) {
            o[key] = this.map.get(key);
        }
        return o;
    }

    toString() {
        let out = "";
        let keys = this.keys();
        let values = this.values();
        let len = keys.length;
        for (let i = 0; i < len; i++) {
            out += keys[i] + "=" + values[i];
            if (i < len - 1) {
                out += ",";
            }
        }
        return out;
    }

    values() {
        return this.map.values();
    }

}