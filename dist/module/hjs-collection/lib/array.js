'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SparseArray = exports.ArrayMap = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _util = require('hjs-core/lib/util');

var util = _interopRequireWildcard(_util);

var _map = require('./map');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @babel */
var mTwiceBaseCacheSize = 0;
var mTwiceBaseCache = null;
var mBaseCacheSize = 0;
var mBaseCache = null;

var freeArrays = function freeArrays(hashes, array, size) {
    if (hashes.length === BASE_SIZE * 2) {
        if (mTwiceBaseCacheSize < CACHE_SIZE) {
            array[0] = mTwiceBaseCache;
            array[1] = hashes;
            for (var _i = (size << 1) - 1; _i >= 2; _i--) {
                array[_i] = null;
            }
            mTwiceBaseCache = array;
            mTwiceBaseCacheSize++;
            console.log("Storing 2x cache " + array + " now have " + mTwiceBaseCacheSize + " entries");
        }
    } else if (hashes.length === BASE_SIZE) {
        if (mBaseCacheSize < CACHE_SIZE) {
            array[0] = mBaseCache;
            array[1] = hashes;
            for (var _i2 = (size << 1) - 1; _i2 >= 2; _i2--) {
                array[_i2] = null;
            }
            mBaseCache = array;
            mBaseCacheSize++;
            console.log("Storing 1x cache " + array + " now have " + mBaseCacheSize + " entries");
        }
    }
};

var BASE_SIZE = 4;
var CACHE_SIZE = 10;
var EMPTY_IMMUTABLE_INTS = [];

var ArrayMap = exports.ArrayMap = function () {
    function ArrayMap() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$capacity = _ref.capacity,
            capacity = _ref$capacity === undefined ? 0 : _ref$capacity,
            _ref$immutable = _ref.immutable,
            immutable = _ref$immutable === undefined ? false : _ref$immutable,
            _ref$map = _ref.map,
            map = _ref$map === undefined ? null : _ref$map;

        (0, _classCallCheck3.default)(this, ArrayMap);

        if (map !== null) {
            this.mHashes = [];
            this.mArray = [];
            this.mSize = 0;
            if (map instanceof ArrayMap || map instanceof _map.AbstractMap) {
                var keys = map.keys();
                var len = keys.length;
                while (len--) {
                    this.put(keys[len], map.get(keys[len]));
                }
            } else {
                for (var p in map) {
                    if (map.hasOwnProperty(p)) {
                        this.put(p, map[p]);
                    }
                }
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

    (0, _createClass3.default)(ArrayMap, [{
        key: 'allocArrays',
        value: function allocArrays(size) {
            if (this.mHashes === EMPTY_IMMUTABLE_INTS) {
                throw new TypeError("UnsupportedOperationException ArrayMap is immutable");
            }
            if (size === BASE_SIZE * 2) {
                if (mTwiceBaseCache !== null) {
                    var array = mTwiceBaseCache;
                    this.mArray = array;
                    mTwiceBaseCache = array[0];
                    this.mHashes = array[1];
                    array[0] = array[1] = null;
                    mTwiceBaseCacheSize--;
                    console.log("Retrieving 2x cache " + this.mHashes + " now have " + mTwiceBaseCacheSize + " entries");
                    return;
                }
            } else if (size === BASE_SIZE) {
                if (mBaseCache !== null) {
                    var _array = mBaseCache;
                    this.mArray = _array;
                    mBaseCache = _array[0];
                    this.mHashes = _array[1];
                    _array[0] = _array[1] = null;
                    mBaseCacheSize--;
                    console.log("Retrieving 1x cache " + this.mHashes + " now have " + mBaseCacheSize + " entries");
                    return;
                }
            }
            this.mHashes = new Array(size);
            this.mArray = new Array(size << 1);
        }
    }, {
        key: 'append',
        value: function append(key, value) {
            var index = this.mSize;
            var hash = key === null ? 0 : util.hashCode(key);
            if (index >= this.mHashes.length) {
                throw new RangeError("IllegalStateException Array is full");
            }
            if (index > 0 && this.mHashes[index - 1] > hash) {
                var e = new Error("here");
                console.error("New hash " + hash + " is before end of array hash " + this.mHashes[index - 1] + " at index " + index + " key " + key, e);
                this.put(key, value);
                return;
            }
            this.mSize = index + 1;
            this.mHashes[index] = hash;
            index <<= 1;
            this.mArray[index] = key;
            this.mArray[index + 1] = value;
        }
    }, {
        key: 'clear',
        value: function clear() {
            if (this.mSize > 0) {
                freeArrays(this.mHashes, this.mArray, this.mSize);
                this.mHashes = [];
                this.mArray = [];
                this.mSize = 0;
            }
        }
    }, {
        key: 'clone',
        value: function clone() {
            return new ArrayMap({ map: this });
        }
    }, {
        key: 'containsKey',
        value: function containsKey(key) {
            return this.indexOfKey(key) >= 0;
        }
    }, {
        key: 'containsValue',
        value: function containsValue(value) {
            return this.indexOfValue(value) >= 0;
        }
    }, {
        key: 'ensureCapacity',
        value: function ensureCapacity(minimumCapacity) {
            if (this.mHashes.length < minimumCapacity) {
                var ohashes = this.mHashes;
                var oarray = this.mArray;
                this.allocArrays(minimumCapacity);
                if (this.mSize > 0) {
                    util.arraycopy(ohashes, 0, this.mHashes, 0, this.mSize);
                    util.arraycopy(oarray, 0, this.mArray, 0, this.mSize << 1);
                }
                freeArrays(ohashes, oarray, this.mSize);
            }
        }
    }, {
        key: 'entries',
        value: function entries() {
            var len = this.size();
            var tmp = [];
            while (len--) {
                tmp[len] = this.keyAt(len);
            }
            return tmp;
        }
    }, {
        key: 'equals',
        value: function equals(object) {
            if (this === object) {
                return true;
            }
            if (!(object instanceof ArrayMap)) {
                return false;
            }
            var map = object;
            if (this.size() !== map.size()) {
                return false;
            }
            var key = null;
            var mine = null;
            var theirs = null;
            for (var _i3 = 0; _i3 < this.mSize; _i3++) {
                key = this.keyAt(_i3);
                mine = this.valueAt(_i3);
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
    }, {
        key: 'erase',
        value: function erase() {
            if (this.mSize > 0) {
                var N = this.mSize << 1;
                var array = this.mArray;
                for (var _i4 = 0; _i4 < N; _i4++) {
                    array[_i4] = null;
                }
                this.mSize = 0;
            }
        }
    }, {
        key: 'get',
        value: function get(key) {
            var index = this.indexOfKey(key);
            return index >= 0 ? this.mArray[(index << 1) + 1] : null;
        }
    }, {
        key: 'hashCode',
        value: function hashCode() {
            var hashes = this.mHashes;
            var array = this.mArray;
            var result = 0;
            var value = null;
            for (var _i5 = 0, v = 1, s = this.mSize; _i5 < s; _i5++, v += 2) {
                value = array[v];
                result += hashes[_i5] ^ (value === null ? 0 : util.hashCode(value));
            }
            return result;
        }
    }, {
        key: 'indexOf',
        value: function indexOf(key, hash) {
            var N = this.mSize;
            // Important fast case: if nothing is in here, nothing to look for.
            if (N === 0) {
                return ~0;
            }
            var index = util.binarySearch(this.mHashes, N, hash);
            // If the hash code wasn't found, then we have no entry for this key.
            if (index < 0) {
                return index;
            }
            // If the key at the returned index matches, that's what we want.
            if (key === this.mArray[index << 1]) {
                return index;
            }
            var end = 0;
            // Search for a matching key after the index.
            for (end = index + 1; end < N && this.mHashes[end] === hash; end++) {
                if (key === this.mArray[end << 1]) {
                    return end;
                }
            }
            // Search for a matching key before the index.
            for (var _i6 = index - 1; _i6 >= 0 && this.mHashes[_i6] === hash; _i6--) {
                if (key === this.mArray[_i6 << 1]) {
                    return _i6;
                }
            }
            // Key not found -- return negative value indicating where a
            // new entry for this key should go.  We use the end of the
            // hash chain to reduce the number of array entries that will
            // need to be copied when inserting.
            return ~end;
        }
    }, {
        key: 'indexOfKey',
        value: function indexOfKey(key) {
            return key === null ? this.indexOfNull() : this.indexOf(key, util.hashCode(key));
        }
    }, {
        key: 'indexOfNull',
        value: function indexOfNull() {
            var N = this.mSize;
            // Important fast case: if nothing is in here, nothing to look for.
            if (N === 0) {
                return ~0;
            }
            var index = util.binarySearch(this.mHashes, N, 0);
            // If the hash code wasn't found, then we have no entry for this key.
            if (index < 0) {
                return index;
            }
            // If the key at the returned index matches, that's what we want.
            if (null === this.mArray[index << 1]) {
                return index;
            }
            var end = 0;
            // Search for a matching key after the index.
            for (end = index + 1; end < N && this.mHashes[end] === 0; end++) {
                if (null === this.mArray[end << 1]) {
                    return end;
                }
            }
            // Search for a matching key before the index.
            for (var _i7 = index - 1; _i7 >= 0 && this.mHashes[_i7] === 0; _i7--) {
                if (null === this.mArray[_i7 << 1]) {
                    return _i7;
                }
            }
            // Key not found -- return negative value indicating where a
            // new entry for this key should go.  We use the end of the
            // hash chain to reduce the number of array entries that will
            // need to be copied when inserting.
            return ~end;
        }
    }, {
        key: 'indexOfValue',
        value: function indexOfValue(value) {
            var N = this.mSize * 2;
            var array = this.mArray;
            if (value === null) {
                for (var _i8 = 1; _i8 < N; _i8 += 2) {
                    if (array[_i8] === null) {
                        return _i8 >> 1;
                    }
                }
            } else {
                for (var _i9 = 1; _i9 < N; _i9 += 2) {
                    if (value === array[_i9]) {
                        return _i9 >> 1;
                    }
                }
            }
            return -1;
        }
    }, {
        key: 'isEmpty',
        value: function isEmpty() {
            return this.mSize <= 0;
        }
    }, {
        key: 'keyAt',
        value: function keyAt(index) {
            return this.mArray[index << 1];
        }
    }, {
        key: 'put',
        value: function put(key, value) {
            var hash = 0;
            var index = 0;
            if (key === null) {
                index = this.indexOfNull();
            } else {
                hash = util.hashCode(key);
                index = this.indexOf(key, hash);
            }
            if (index >= 0) {
                index = (index << 1) + 1;
                var old = this.mArray[index];
                this.mArray[index] = value;
                return old;
            }
            index = ~index;
            if (this.mSize >= this.mHashes.length) {
                var n = this.mSize >= BASE_SIZE * 2 ? this.mSize + (this.mSize >> 1) : this.mSize >= BASE_SIZE ? BASE_SIZE * 2 : BASE_SIZE;
                console.log("put: grow from " + this.mHashes.length + " to " + n);
                var ohashes = this.mHashes;
                var oarray = this.mArray;
                this.allocArrays(n);
                if (this.mHashes.length > 0) {
                    console.log("put: copy 0-" + this.mSize + " to 0");
                    util.arraycopy(ohashes, 0, this.mHashes, 0, ohashes.length);
                    util.arraycopy(oarray, 0, this.mArray, 0, oarray.length);
                }
                freeArrays(ohashes, oarray, this.mSize);
            }
            if (index < this.mSize) {
                console.log("put: move " + index + "-" + (this.mSize - index) + " to " + (index + 1));
                util.arraycopy(this.mHashes, index, this.mHashes, index + 1, this.mSize - index);
                util.arraycopy(this.mArray, index << 1, this.mArray, index + 1 << 1, this.mSize - index << 1);
            }
            this.mHashes[index] = hash;
            this.mArray[index << 1] = key;
            this.mArray[(index << 1) + 1] = value;
            this.mSize++;
            return null;
        }
    }, {
        key: 'putAll',
        value: function putAll(array) {
            var N = array.size();
            this.ensureCapacity(this.mSize + N);
            if (this.mSize === 0) {
                if (N > 0) {
                    util.arraycopy(array.mHashes, 0, this.mHashes, 0, N);
                    util.arraycopy(array.mArray, 0, this.mArray, 0, N << 1);
                    this.mSize = N;
                }
            } else {
                for (var _i10 = 0; _i10 < N; _i10++) {
                    this.put(array.keyAt(_i10), array.valueAt(_i10));
                }
            }
        }
    }, {
        key: 'remove',
        value: function remove(key) {
            var index = this.indexOfKey(key);
            if (index >= 0) {
                return this.removeAt(index);
            }
            return null;
        }
    }, {
        key: 'removeAt',
        value: function removeAt(index) {
            var old = this.mArray[(index << 1) + 1];
            if (this.mSize <= 1) {
                // Now empty.
                console.log("remove: shrink from " + this.mHashes.length + " to 0");
                freeArrays(this.mHashes, this.mArray, this.mSize);
                this.mHashes = [];
                this.mArray = [];
                this.mSize = 0;
            } else {
                if (this.mHashes.length > BASE_SIZE * 2 && this.mSize < this.mHashes.length / 3) {
                    // Shrunk enough to reduce size of arrays.  We don't allow it to
                    // shrink smaller than (BASE_SIZE*2) to avoid flapping between
                    // that and BASE_SIZE.
                    var n = this.mSize > BASE_SIZE * 2 ? this.mSize + (this.mSize >> 1) : BASE_SIZE * 2;
                    console.log("remove: shrink from " + this.mHashes.length + " to " + n);
                    var ohashes = this.mHashes;
                    var oarray = this.mArray;
                    this.allocArrays(n);
                    this.mSize--;
                    if (index > 0) {
                        console.log("remove: copy from 0-" + index + " to 0");
                        util.arraycopy(ohashes, 0, this.mHashes, 0, index);
                        util.arraycopy(oarray, 0, this.mArray, 0, index << 1);
                    }
                    if (index < this.mSize) {
                        console.log("remove: copy from " + (index + 1) + "-" + this.mSize + " to " + index);
                        util.arraycopy(ohashes, index + 1, this.mHashes, index, this.mSize - index);
                        util.arraycopy(oarray, index + 1 << 1, this.mArray, index << 1, this.mSize - index << 1);
                    }
                } else {
                    this.mSize--;
                    if (index < this.mSize) {
                        console.log("remove: move " + (index + 1) + "-" + this.mSize + " to " + index);
                        util.arraycopy(this.mHashes, index + 1, this.mHashes, index, this.mSize - index);
                        util.arraycopy(this.mArray, index + 1 << 1, this.mArray, index << 1, this.mSize - index << 1);
                    }
                    this.mArray[this.mSize << 1] = null;
                    this.mArray[(this.mSize << 1) + 1] = null;
                }
            }
            return old;
        }
    }, {
        key: 'setValueAt',
        value: function setValueAt(index, value) {
            index = (index << 1) + 1;
            var old = this.mArray[index];
            this.mArray[index] = value;
            return old;
        }
    }, {
        key: 'size',
        value: function size() {
            return this.mSize;
        }
    }, {
        key: 'toString',
        value: function toString() {
            if (this.isEmpty()) {
                return "{}";
            }
            var key = null;
            var value = null;
            var buffer = '{';
            for (var _i11 = 0; _i11 < this.mSize; _i11++) {
                if (_i11 > 0) {
                    buffer += ", ";
                }
                key = this.keyAt(_i11);
                if (key !== this) {
                    buffer += key;
                } else {
                    buffer += "(this Map)";
                }
                buffer += '=';
                value = this.valueAt(_i11);
                if (value !== this) {
                    buffer += value;
                } else {
                    buffer += "(this ArrayMap)";
                }
            }
            buffer += '}';
            return buffer;
        }
    }, {
        key: 'validate',
        value: function validate() {
            var N = this.mSize;
            if (N <= 1) {
                // There can't be dups.
                return;
            }
            var hash = 0;
            var basei = 0;
            var cur = null;
            var prev = null;
            var basehash = this.mHashes[0];
            for (var _i12 = 1; _i12 < N; _i12++) {
                hash = this.mHashes[_i12];
                if (hash !== basehash) {
                    basehash = hash;
                    basei = _i12;
                    continue;
                }
                // We are in a run of entries with the same hash code.  Go backwards through
                // the array to see if any keys are the same.
                cur = this.mArray[_i12 << 1];
                for (var j = _i12 - 1; j >= basei; j--) {
                    prev = this.mArray[j << 1];
                    if (cur === prev) {
                        throw new ReferenceError("IllegalArgumentException Duplicate key in ArrayMap: " + cur);
                    }
                    if (cur !== null && prev !== null && cur === prev) {
                        throw new ReferenceError("IllegalArgumentException Duplicate key in ArrayMap: " + cur);
                    }
                }
            }
        }
    }, {
        key: 'valueAt',
        value: function valueAt(index) {
            return this.mArray[(index << 1) + 1];
        }
    }, {
        key: 'values',
        value: function values() {
            var len = this.size();
            var tmp = [];
            while (len--) {
                tmp[len] = this.valueAt(len);
            }
            return tmp;
        }
    }]);
    return ArrayMap;
}();

var DELETED = {};

var SparseArray = exports.SparseArray = function () {
    function SparseArray() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref2$capacity = _ref2.capacity,
            capacity = _ref2$capacity === undefined ? 0 : _ref2$capacity;

        (0, _classCallCheck3.default)(this, SparseArray);

        this.mSize = 0;
        this.mGarbage = false;
        var initialCapacity = capacity;
        if (initialCapacity === 0) {
            this.mKeys = [];
            this.mValues = [];
        } else {
            this.mValues = new Array(initialCapacity * 2);
            this.mKeys = new Array(this.mValues.length);
        }
    }

    (0, _createClass3.default)(SparseArray, [{
        key: 'append',
        value: function append(key, value) {
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
    }, {
        key: 'del',
        value: function del(key) {
            var i = util.binarySearch(this.mKeys, this.mSize, key);
            if (i >= 0) {
                if (this.mValues[i] !== DELETED) {
                    this.mValues[i] = DELETED;
                    this.mGarbage = true;
                }
            }
        }
    }, {
        key: 'clear',
        value: function clear() {
            var n = this.mSize;
            var values = this.mValues;
            for (var _i13 = 0; _i13 < n; _i13++) {
                values[_i13] = null;
            }
            this.mSize = 0;
            this.mGarbage = false;
        }
    }, {
        key: 'gc',
        value: function gc() {
            var o = 0;
            var keys = this.mKeys;
            var values = this.mValues;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref3 = _step.value;

                    var _ref4 = (0, _slicedToArray3.default)(_ref3, 2);

                    var k = _ref4[0];
                    var v = _ref4[1];

                    if (v !== DELETED) {
                        if (i !== o) {
                            keys[o] = keys[k];
                            values[o] = v;
                            values[k] = null;
                        }
                        o++;
                    }
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

            this.mGarbage = false;
            this.mSize = o;
        }
    }, {
        key: 'get',
        value: function get(key, valueIfKeyNotFound) {
            var i = util.binarySearch(this.mKeys, this.mSize, key);
            if (i < 0 || this.mValues[i] === DELETED) {
                return valueIfKeyNotFound;
            }
            return this.mValues[i];
        }
    }, {
        key: 'indexOfKey',
        value: function indexOfKey(key) {
            if (this.mGarbage) {
                this.gc();
            }
            return util.binarySearch(this.mKeys, this.mSize, key);
        }
    }, {
        key: 'indexOfValue',
        value: function indexOfValue(value) {
            if (this.mGarbage) {
                this.gc();
            }
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.mValues[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _ref5 = _step2.value;

                    var _ref6 = (0, _slicedToArray3.default)(_ref5, 2);

                    var k = _ref6[0];
                    var v = _ref6[1];

                    if (v === value) {
                        return k;
                    }
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

            return -1;
        }
    }, {
        key: 'keyAt',
        value: function keyAt(index) {
            if (this.mGarbage) {
                this.gc();
            }
            return this.mKeys[index];
        }
    }, {
        key: 'put',
        value: function put(key, value) {
            var i = util.binarySearch(this.mKeys, this.mSize, key);
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
    }, {
        key: 'remove',
        value: function remove(key) {
            this.del(key);
        }
    }, {
        key: 'removeAt',
        value: function removeAt(index) {
            if (this.mValues[index] !== DELETED) {
                this.mValues[index] = DELETED;
                this.mGarbage = true;
            }
        }
    }, {
        key: 'removeAtRange',
        value: function removeAtRange(index, size) {
            var end = Math.min(this.mSize, index + size);
            for (var _i14 = index; _i14 < end; _i14++) {
                this.removeAt(_i14);
            }
        }
    }, {
        key: 'removeReturnOld',
        value: function removeReturnOld(key) {
            var i = util.binarySearch(this.mKeys, this.mSize, key);
            if (i >= 0) {
                if (this.mValues[i] !== DELETED) {
                    var old = this.mValues[i];
                    this.mValues[i] = DELETED;
                    this.mGarbage = true;
                    return old;
                }
            }
            return null;
        }
    }, {
        key: 'setValueAt',
        value: function setValueAt(index, value) {
            if (this.mGarbage) {
                this.gc();
            }
            this.mValues[index] = value;
        }
    }, {
        key: 'size',
        value: function size() {
            if (this.mGarbage) {
                this.gc();
            }
            return this.mSize;
        }
    }, {
        key: 'valueAt',
        value: function valueAt(index) {
            if (this.mGarbage) {
                this.gc();
            }
            return this.mValues[index];
        }
    }]);
    return SparseArray;
}();