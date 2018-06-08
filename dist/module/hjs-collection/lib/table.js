'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HashMap = exports.HashMapEntry = exports.Hashtable = exports.Enumerator = exports.HashtableEntry = undefined;

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _util = require('hjs-core/lib/util');

var util = _interopRequireWildcard(_util);

var _iterator3 = require('./iterator');

var _map = require('./map');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KEYS = 0; /** @babel */

var VALUES = 1;
var ENTRIES = 2;

var HashtableEntry = exports.HashtableEntry = function () {
    function HashtableEntry() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$h = _ref.h,
            h = _ref$h === undefined ? 0 : _ref$h,
            _ref$key = _ref.key,
            key = _ref$key === undefined ? null : _ref$key,
            _ref$value = _ref.value,
            value = _ref$value === undefined ? null : _ref$value,
            _ref$next = _ref.next,
            next = _ref$next === undefined ? null : _ref$next;

        (0, _classCallCheck3.default)(this, HashtableEntry);

        this.h = h;
        this.key = key;
        this.value = value;
        this.next = next;
    }

    (0, _createClass3.default)(HashtableEntry, [{
        key: 'equals',
        value: function equals(o) {
            if (!(o instanceof HashtableEntry)) {
                return false;
            }
            var e = o;
            return this.key === e.getKey() && this.value === e.getValue();
        }
    }, {
        key: 'getKey',
        value: function getKey() {
            return this.key;
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            return this.value;
        }
    }, {
        key: 'hashCode',
        value: function hashCode() {
            return Hashtable.hash(this.key) ^ Hashtable.hash(this.value);
        }
    }, {
        key: 'setValue',
        value: function setValue(value) {
            if (value === null) {
                throw new ReferenceError("NullPointerException");
            }
            var oldValue = this.value;
            this.value = value;
            return oldValue;
        }
    }]);
    return HashtableEntry;
}();

var Enumerator = exports.Enumerator = function () {
    function Enumerator(hashTable, type, iterator) {
        (0, _classCallCheck3.default)(this, Enumerator);

        this.mHashTable = hashTable;
        this.mIndex = this.mHashTable.table.length;
        this.mIterator = iterator;
        this.mLastReturned = null;
        this.mEntry = null;
        this.mType = type;
    }

    (0, _createClass3.default)(Enumerator, [{
        key: 'hasMoreElements',
        value: function hasMoreElements() {
            var e = this.mEntry;
            var i = this.mIndex;
            var t = this.mHashTable.table;
            while (e === null && i > 0) {
                e = t[--i];
            }
            this.mEntry = e;
            this.mIndex = i;
            return e !== null;
        }
    }, {
        key: 'hasNext',
        value: function hasNext() {
            return this.hasMoreElements();
        }
    }, {
        key: 'next',
        value: function next() {
            return this.nextElement();
        }
    }, {
        key: 'nextElement',
        value: function nextElement() {
            var e = this.mEntry;
            var i = this.mIndex;
            var et = this.mHashTable.table;
            while (et === null && i > 0) {
                et = t[--i];
            }
            this.mEntry = et;
            this.mIndex = i;
            if (e !== null) {
                e = this.mLastReturned = this.mEntry;
                this.mEntry = e.next;
                return this.mType === KEYS ? e.key : this.mType === VALUES ? e.value : e;
            }
            throw new RangeError("NoSuchElementException Hashtable Enumerator");
        }
    }, {
        key: 'remove',
        value: function remove() {
            if (!this.mIterator) {
                throw new Error("UnsupportedOperationException");
            }
            if (this.mLastReturned === null) {
                throw new Error("IllegalStateException Hashtable Enumerator");
            }
            var tab = this.mHashTable.table;
            var index = (this.mLastReturned.h & 0x7FFFFFFF) % tab.length;
            for (var e = tab[index], prev = null; e !== null; prev = e, e = e.next) {
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
            throw new Error("ConcurrentModificationException");
        }
    }]);
    return Enumerator;
}();

var MAX_ARRAY_SIZE = Number.MAX_VALUE - 8;
var DEFAULT_LOAD_FACTOR = .75;

var Hashtable = exports.Hashtable = function () {
    function Hashtable() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref2$initialCapacity = _ref2.initialCapacity,
            initialCapacity = _ref2$initialCapacity === undefined ? 11 : _ref2$initialCapacity,
            _ref2$loadFactor = _ref2.loadFactor,
            loadFactor = _ref2$loadFactor === undefined ? DEFAULT_LOAD_FACTOR : _ref2$loadFactor,
            _ref2$map = _ref2.map,
            map = _ref2$map === undefined ? null : _ref2$map;

        (0, _classCallCheck3.default)(this, Hashtable);

        if (map !== null) {
            initialCapacity = 2 * map.size();
            this.loadFactor = loadFactor;
        } else {
            if (initialCapacity < 0) {
                throw new RangeError("IllegalArgumentException Illegal Capacity: " + initialCapacity);
            }
            if (loadFactor <= 0) {
                throw new RangeError("IllegalArgumentException Illegal Load: " + loadFactor);
            }
        }
        this.table = new Array(initialCapacity);
        this.threshold = initialCapacity <= MAX_ARRAY_SIZE + 1 ? initialCapacity : MAX_ARRAY_SIZE + 1;
        if (map !== null) {
            this.putAll(map);
        }
    }

    (0, _createClass3.default)(Hashtable, [{
        key: 'clear',
        value: function clear() {
            var tab = this.table;
            for (var index = tab.length; --index >= 0;) {
                tab[index] = null;
            }
            this.count = 0;
        }
    }, {
        key: 'contains',
        value: function contains(value) {
            if (value === null) {
                throw new ReferenceError("NullPointerException");
            }
            var tab = this.table;
            for (var i = tab.length; i-- > 0;) {
                for (var e = tab[i]; e !== null; e = e.next) {
                    if (e.value === value) {
                        return true;
                    }
                }
            }
            return false;
        }
    }, {
        key: 'containsKey',
        value: function containsKey(key) {
            var tab = this.table;
            var h = Hashtable.hash(key);
            var index = (h & 0x7FFFFFFF) % tab.length;
            for (var e = tab[index]; e !== null; e = e.next) {
                if (e.h === h && e.key === key) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: 'containsValue',
        value: function containsValue(value) {
            return this.contains(value);
        }
    }, {
        key: 'elements',
        value: function elements() {
            return this.getEnumeration(VALUES);
        }
    }, {
        key: 'entrySet',
        value: function entrySet() {
            var _this = this;

            return {
                iterator: function iterator() {
                    return _this.getIterator(ENTRIES);
                }
            };
        }
    }, {
        key: 'get',
        value: function get(key) {
            var tab = this.table;
            var h = Hashtable.hash(key);
            var index = (h & 0x7FFFFFFF) % tab.length;
            for (var e = tab[index]; e !== null; e = e.next) {
                if (e.h === h && e.key === key) {
                    return e.value;
                }
            }
            return null;
        }
    }, {
        key: 'getEnumeration',
        value: function getEnumeration(type) {
            if (this.count === 0) {
                return new Enumeration(this.table);
            }
            return new Enumerator(this, type, false);
        }
    }, {
        key: 'getIterator',
        value: function getIterator(type) {
            if (this.count === 0) {
                return new _iterator3.Iterator(this.table);
            }
            return new Enumerator(this, type, true);
        }
    }, {
        key: 'isEmpty',
        value: function isEmpty() {
            return this.count === 0;
        }
    }, {
        key: 'keys',
        value: function keys() {
            return this.getEnumeration(KEYS);
        }
    }, {
        key: 'keySet',
        value: function keySet() {
            var _this2 = this;

            return {
                clear: function clear() {
                    _this2.clear();
                },
                contains: function contains(o) {
                    return _this2.containsKey(o);
                },
                iterator: function iterator() {
                    return _this2.getIterator(KEYS);
                },
                remove: function remove(o) {
                    return _this2.remove(o) !== null;
                },
                size: function size() {
                    return _this2.count;
                }
            };
        }
    }, {
        key: 'put',
        value: function put(key, value) {
            if (value === null) {
                throw new ReferenceError("NullPointerException");
            }
            var old = null;
            var tab = this.table;
            var h = Hashtable.hash(key);
            var index = (h & 0x7FFFFFFF) % tab.length;
            for (var _e = tab[index]; _e !== null; _e = _e.next) {
                if (_e.h === h && _e.key === key) {
                    old = _e.value;
                    _e.value = value;
                    return old;
                }
            }
            if (this.count >= this.threshold) {
                this.rehash();
                tab = this.table;
                h = Hashtable.hash(key);
                index = (h & 0x7FFFFFFF) % tab.length;
            }
            var e = tab[index];
            tab[index] = new HashtableEntry({
                h: h,
                key: key,
                value: value,
                next: e
            });
            this.count++;
            return null;
        }
    }, {
        key: 'putAll',
        value: function putAll(t) {
            if (t instanceof _map.AbstractMap) {
                t = t.map;
            }
            for (var p in t) {
                if (t.hasOwnProperty(p)) {
                    this.put(p, t[p]);
                }
            }
        }
    }, {
        key: 'rehash',
        value: function rehash() {
            var oldCapacity = this.table.length;
            var oldMap = this.table;
            var newCapacity = (oldCapacity << 1) + 1;
            if (newCapacity - MAX_ARRAY_SIZE > 0) {
                if (oldCapacity === MAX_ARRAY_SIZE) {
                    return;
                }
                newCapacity = MAX_ARRAY_SIZE;
            }
            var newMap = new Array(newCapacity);
            this.threshold = Math.min(newCapacity * this.loadFactor, MAX_ARRAY_SIZE + 1);
            this.table = newMap;
            var e = null;
            var index = 0;
            for (var i = oldCapacity; i-- > 0;) {
                for (var old = oldMap[i]; old !== null;) {
                    e = old;
                    old = old.next;
                    index = (e.h & 0x7FFFFFFF) % newCapacity;
                    e.next = newMap[index];
                    newMap[index] = e;
                }
            }
        }
    }, {
        key: 'remove',
        value: function remove(key) {
            var tab = this.table;
            var hash = Hashtable.hash(key);
            var index = (h & 0x7FFFFFFF) % tab.length;
            var oldValue = null;
            for (var e = tab[index], prev = null; e !== null; prev = e, e = e.next) {
                if (e.h === hash && e.key === key) {
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
    }, {
        key: 'size',
        value: function size() {
            return this.count;
        }
    }, {
        key: 'values',
        value: function values() {
            var _this3 = this;

            return {
                clear: function clear() {
                    _this3.clear();
                },
                contains: function contains(o) {
                    return _this3.containsValue(o);
                },
                iterator: function iterator() {
                    return _this3.getIterator(VALUES);
                },
                size: function size() {
                    return _this3.count;
                }
            };
        }
    }], [{
        key: 'hash',
        value: function hash(k) {
            return util.hashCode(k);
        }
    }]);
    return Hashtable;
}();

var HashMapEntry = exports.HashMapEntry = function (_HashtableEntry) {
    (0, _inherits3.default)(HashMapEntry, _HashtableEntry);

    function HashMapEntry() {
        var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref3$h = _ref3.h,
            h = _ref3$h === undefined ? 0 : _ref3$h,
            _ref3$key = _ref3.key,
            key = _ref3$key === undefined ? null : _ref3$key,
            _ref3$value = _ref3.value,
            value = _ref3$value === undefined ? null : _ref3$value,
            _ref3$next = _ref3.next,
            next = _ref3$next === undefined ? null : _ref3$next;

        (0, _classCallCheck3.default)(this, HashMapEntry);
        return (0, _possibleConstructorReturn3.default)(this, (HashMapEntry.__proto__ || Object.getPrototypeOf(HashMapEntry)).call(this, { h: h, key: key, value: value, next: next }));
    }

    (0, _createClass3.default)(HashMapEntry, [{
        key: 'equals',
        value: function equals(o) {
            if (!(o instanceof HashMapEntry)) {
                return false;
            }
            var e = o;
            var k1 = this.getKey();
            var k2 = e.getKey();
            if (k1 === k2 || k1 !== null && k1 === k2) {
                var v1 = this.getValue();
                var v2 = e.getValue();
                return v1 === v2 || v1 !== null && v1 === v2;
            }
            return false;
        }
    }, {
        key: 'recordAccess',
        value: function recordAccess(m) {}
    }, {
        key: 'recordRemoval',
        value: function recordRemoval(m) {}
    }, {
        key: 'setValue',
        value: function setValue(newValue) {
            var oldValue = this.value;
            this.value = newValue;
            return oldValue;
        }
    }]);
    return HashMapEntry;
}(HashtableEntry);

var HashIterator = function (_Iterator) {
    (0, _inherits3.default)(HashIterator, _Iterator);

    function HashIterator(ht) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ENTRIES;
        (0, _classCallCheck3.default)(this, HashIterator);

        var _this5 = (0, _possibleConstructorReturn3.default)(this, (HashIterator.__proto__ || Object.getPrototypeOf(HashIterator)).call(this, ht));

        _this5.type = type;
        _this5.next = null;
        _this5.current = null;
        if (_this5.list.count > 0) {
            var _t = _this5.list.map;
            while (_this5.cursor < _t.length && !_this5.next) {
                _this5.next = _t[_this5.cursor++];
            }
        }
        return _this5;
    }

    (0, _createClass3.default)(HashIterator, [{
        key: 'hasNext',
        value: function hasNext() {
            return this.next !== null;
        }
    }, {
        key: 'next',
        value: function next() {
            switch (this.type) {
                case KEYS:
                    return this.nextEntry().getKey();
                case VALUES:
                    return this.nextEntry().getValue();
                case ENTRIES:
                    return this.nextEntry();
            }
        }
    }, {
        key: 'nextEntry',
        value: function nextEntry() {
            var e = this.next;
            if (e === null) {
                throw new RangeError("NoSuchElementException");
            }
            if ((this.next = e.next) === null) {
                var _t2 = this.list.map;
                while (this.cursor < _t2.length && !this.next) {
                    this.next = _t2[this.cursor++];
                }
            }
            this.current = e;
            return e;
        }
    }, {
        key: 'remove',
        value: function remove() {
            if (this.current === null) {
                throw new RangeError("IllegalStateException");
            }
            var k = this.current.key;
            this.current = null;
            this.list.removeEntryForKey(k);
        }
    }]);
    return HashIterator;
}(_iterator3.Iterator);

var DEFAULT_INITIAL_CAPACITY = 4;
var MAXIMUM_CAPACITY = 1 << 30;
var EMPTY_TABLE = [];

var bitCount = function bitCount(i) {
    i = i - (i >>> 1 & 0x55555555);
    i = (i & 0x33333333) + (i >>> 2 & 0x33333333);
    i = i + (i >>> 4) & 0x0f0f0f0f;
    i = i + (i >>> 8);
    i = i + (i >>> 16);
    return i & 0x3f;
};

var highestOneBit = function highestOneBit(i) {
    i |= i >> 1;
    i |= i >> 2;
    i |= i >> 4;
    i |= i >> 8;
    i |= i >> 16;
    return i - (i >>> 1);
};

var indexFor = function indexFor(h, length) {
    return h & length - 1;
};

var roundUpToPowerOf2 = function roundUpToPowerOf2(number) {
    var rounded = 0;
    rounded = number >= MAXIMUM_CAPACITY ? MAXIMUM_CAPACITY : (rounded = highestOneBit(number)) != 0 ? bitCount(number) > 1 ? rounded << 1 : rounded : 1;
    return rounded;
};

var HashMap = exports.HashMap = function (_AbstractMap) {
    (0, _inherits3.default)(HashMap, _AbstractMap);

    function HashMap() {
        var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref4$initialCapacity = _ref4.initialCapacity,
            initialCapacity = _ref4$initialCapacity === undefined ? DEFAULT_INITIAL_CAPACITY : _ref4$initialCapacity,
            _ref4$loadFactor = _ref4.loadFactor,
            loadFactor = _ref4$loadFactor === undefined ? DEFAULT_LOAD_FACTOR : _ref4$loadFactor,
            _ref4$values = _ref4.values,
            values = _ref4$values === undefined ? null : _ref4$values;

        (0, _classCallCheck3.default)(this, HashMap);

        var _this6 = (0, _possibleConstructorReturn3.default)(this, (HashMap.__proto__ || Object.getPrototypeOf(HashMap)).call(this));

        var hasValues = values !== null && values instanceof _map.AbstractMap;
        if (hasValues) {
            initialCapacity = Math.max(m.size() / DEFAULT_LOAD_FACTOR + 1, DEFAULT_INITIAL_CAPACITY);
        }
        if (initialCapacity < 0) {
            throw new RangeError("IllegalArgumentException Illegal initial capacity: " + initialCapacity);
        }
        if (initialCapacity > MAXIMUM_CAPACITY) {
            initialCapacity = MAXIMUM_CAPACITY;
        } else if (initialCapacity < DEFAULT_INITIAL_CAPACITY) {
            initialCapacity = DEFAULT_INITIAL_CAPACITY;
        }
        if (loadFactor <= 0 || isNaN(loadFactor)) {
            throw new RangeError("IllegalArgumentException Illegal load factor: " + loadFactor);
        }
        _this6.count = 0;
        _this6.map = EMPTY_TABLE;
        _this6.threshold = initialCapacity;
        _this6.init();
        if (hasValues) {
            _this6.inflateTable(_this6.threshold);
            _this6.putAllForCreate(values);
        }
        return _this6;
    }

    (0, _createClass3.default)(HashMap, [{
        key: 'addEntry',
        value: function addEntry(hash, key, value, bucketIndex) {
            if (this.count >= this.threshold && this.map[bucketIndex]) {
                this.resize(2 * this.map.length);
                hash = key === null ? 0 : util.hashCode(key);
                bucketIndex = indexFor(hash, this.map.length);
            }
            this.createEntry(hash, key, value, bucketIndex);
        }
    }, {
        key: 'clear',
        value: function clear() {
            util.fill(this.table, null);
            this.count = 0;
        }
    }, {
        key: 'containsKey',
        value: function containsKey(key) {
            return this.getEntry(key) !== null;
        }
    }, {
        key: 'containsNullValue',
        value: function containsNullValue() {
            var tab = this.table;
            for (var i = 0; i < tab.length; i++) {
                for (var e = tab[i]; e !== null; e = e.next) {
                    if (e.value === null) {
                        return true;
                    }
                }
            }
            return false;
        }
    }, {
        key: 'containsValue',
        value: function containsValue(value) {
            if (value === null) {
                return this.containsNullValue();
            }
            var tab = this.map;
            for (var i = 0; i < tab.length; i++) {
                for (var e = tab[i]; e !== null; e = e.next) {
                    if (value === e.value) {
                        return true;
                    }
                }
            }
            return false;
        }
    }, {
        key: 'createEntry',
        value: function createEntry(h, key, value, bucketIndex) {
            var next = this.map[bucketIndex];
            this.map[bucketIndex] = new HashMapEntry({ h: h, key: key, value: value, next: next });
            this.count++;
        }
    }, {
        key: 'get',
        value: function get(key) {
            if (key === null) {
                return this.getForNullKey();
            }
            var entry = this.getEntry(key);
            return null === entry ? null : entry.getValue();
        }
    }, {
        key: 'getEntry',
        value: function getEntry(key) {
            if (this.count === 0) {
                return null;
            }
            var hash = key === null ? 0 : util.hashCode(key);
            for (var e = this.map[indexFor(hash, this.map.length)]; e !== null; e = e.next) {
                var k = void 0;
                if (e.h === hash && ((k = e.key) === key || key !== null && key === k)) {
                    return e;
                }
            }
            return null;
        }
    }, {
        key: 'getForNullKey',
        value: function getForNullKey() {
            if (this.count === 0) {
                return null;
            }
            for (var e = this.map[0]; e !== null; e = e.next) {
                if (e.key === null) {
                    return e.value;
                }
            }
            return null;
        }
    }, {
        key: 'inflateTable',
        value: function inflateTable(toSize) {
            var capacity = roundUpToPowerOf2(toSize);
            var thresholdFloat = capacity * this.loadFactor;
            if (thresholdFloat > MAXIMUM_CAPACITY + 1) {
                thresholdFloat = MAXIMUM_CAPACITY + 1;
            }
            var threshold = thresholdFloat;
            // TODO: Not finished... WTF?
            this.map = new Array(capacity);
        }
    }, {
        key: 'init',
        value: function init() {}
    }, {
        key: 'isEmpty',
        value: function isEmpty() {
            return this.count === 0;
        }
    }, {
        key: 'newEntryIterator',
        value: function newEntryIterator() {
            return new HashIterator(this, ENTRIES);
        }
    }, {
        key: 'newKeyIterator',
        value: function newKeyIterator() {
            return new HashIterator(this, KEYS);
        }
    }, {
        key: 'newValueIterator',
        value: function newValueIterator() {
            return new HashIterator(this, VALUES);
        }
    }, {
        key: 'put',
        value: function put(key, value) {
            if (this.map === EMPTY_TABLE) {
                this.inflateTable(this.threshold);
            }
            if (key === null) {
                return this.putForNullKey(value);
            }
            var hash = key === null ? 0 : util.hashCode(key);
            var i = indexFor(hash, this.map.length);
            var e = this.map[i];
            do {
                if (e) {
                    var k = void 0;
                    if (e.h === hash && ((k = e.key) === key || key === k)) {
                        var oldValue = e.value;
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
    }, {
        key: 'putAll',
        value: function putAll(m) {
            if (!(m instanceof _map.AbstractMap)) {
                return;
            }
            var numKeysToBeAdded = m.size();
            if (numKeysToBeAdded === 0) {
                return;
            }
            if (this.map === EMPTY_TABLE) {
                this.inflateTable(Math.max(numKeysToBeAdded * this.loadFactor, this.threshold));
            }
            if (numKeysToBeAdded > this.threshold) {
                var targetCapacity = numKeysToBeAdded / this.loadFactor + 1;
                if (targetCapacity > MAXIMUM_CAPACITY) {
                    targetCapacity = MAXIMUM_CAPACITY;
                }
                var newCapacity = this.map.length;
                while (newCapacity < targetCapacity) {
                    newCapacity <<= 1;
                }
                if (newCapacity > this.map.length) {
                    this.resize(newCapacity);
                }
            }
            var entries = m.entries();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref5 = _step.value;
                    var key = _ref5.key;
                    var value = _ref5.value;

                    this.put(key, value);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'putAllForCreate',
        value: function putAllForCreate(m) {
            var entries = m.entries();
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = entries[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _ref6 = _step2.value;
                    var key = _ref6.key;
                    var value = _ref6.value;

                    this.putForCreate(key, value);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: 'putForCreate',
        value: function putForCreate(key, value) {
            var hash = key === null ? 0 : util.hashCode(key);
            var i = indexFor(hash, this.map.length);
            var e = this.map[i];
            do {
                if (e) {
                    var k = void 0;
                    if (e.h === hash && ((k = e.key) === key || key !== null && key === k)) {
                        e.value = value;
                        return;
                    }
                    e = e.next;
                }
            } while (e);
            this.createEntry(hash, key, value, i);
        }
    }, {
        key: 'putForNullKey',
        value: function putForNullKey(value) {
            for (var e = this.map[0]; e !== null; e = e.next) {
                if (e.key === null) {
                    var oldValue = e.value;
                    e.value = value;
                    e.recordAccess(this);
                    return oldValue;
                }
            }
            this.addEntry(0, null, value, 0);
            return null;
        }
    }, {
        key: 'remove',
        value: function remove(key) {
            var e = this.removeEntryForKey(key);
            return e === null ? null : e.getValue();
        }
    }, {
        key: 'removeEntryForKey',
        value: function removeEntryForKey(key) {
            if (this.count === 0) {
                return null;
            }
            var hash = key === null ? 0 : util.hashCode(key);
            var i = indexFor(hash, this.map.length);
            var prev = this.map[i];
            var e = prev;
            while (e) {
                var next = e.next;
                var k = void 0;
                if (e.h === hash && ((k = e.key) === key || key !== null && key === k)) {
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
    }, {
        key: 'removeMapping',
        value: function removeMapping(o) {
            if (this.count === 0 || !(o instanceof HashtableEntry)) {
                return null;
            }
            var entry = o;
            var key = entry.getKey();
            var hash = key === null ? 0 : util.hashCode(key);
            var i = indexFor(hash, this.map.length);
            var prev = this.map[i];
            var e = prev;
            while (e) {
                var next = e.next;
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
    }, {
        key: 'resize',
        value: function resize(newCapacity) {
            var oldTable = this.map;
            var oldCapacity = oldTable.length;
            if (oldCapacity === MAXIMUM_CAPACITY) {
                this.threshold = Number.MAX_VALUE;
            }
            var newTable = new Array(newCapacity);
            this.transfer(newTable);
            this.map = newTable;
            this.threshold = Math.min(newCapacity * this.loadFactor, MAXIMUM_CAPACITY + 1);
        }
    }, {
        key: 'size',
        value: function size() {
            return this.count;
        }
    }, {
        key: 'transfer',
        value: function transfer(newTable) {
            var newCapacity = newTable.length;
            var len = this.map.length;
            for (var i = 0; i < len; i++) {
                var e = this.map[i];
                while (e) {
                    var next = e.next;
                    var _i = indexFor(e.h, newCapacity);
                    e.next = newTable[_i];
                    newTable[_i] = e;
                    e = next;
                }
            }
        }
    }]);
    return HashMap;
}(_map.AbstractMap);