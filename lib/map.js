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
    const values = this.map.values();
    let len = values.length;
    while (len--) {
      if (values[len] === value) {
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
      return this.map
          .keys()
          .map(key => ({key, value: this.map.get(key)}));
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
    const old = this.map.get(key);
    this.map.set(key, value);
    return old;
  }

  putAll(map) {
      if (map instanceof AbstractMap ||
          map instanceof Map) {
          map
              .keys()
              .forEach(key => this.put(key, map.get(key)));
    } else if (Array.isArray(map)) {
      map
        .forEach((e, index) => { this.put(index, e); });
      } else if (map) {
      Object
        .keys(map)
        .forEach(key => this.put(key, map[key]));
    }
  }

  remove(key) {
    if (key === null) {
        return null;
    }
    const old = this.map.get(key);
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
    const o = {};
    const keys = this.map.keys();
    let len = keys.length;
    while (len--) {
      const key = keys[len];
      o[key] = this.map.get(key);
    }
    return o;
  }

  toString() {
    let out = '';
    const keys = this.keys();
    const values = this.values();
    const len = keys.length;
    for (let i = 0; i < len; i++) {
      out += `${keys[i]}=${values[i]}`;
      if (i < len - 1) {
        out += ',';
      }
    }
    return out;
  }

  values() {
    return this.map.values();
  }
}
