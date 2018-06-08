"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Queue = exports.DEFAULT_QUEUE_CAPACITY = exports.AbstractQueue = undefined;

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @babel */
var AbstractQueue = exports.AbstractQueue = function () {
    function AbstractQueue() {
        (0, _classCallCheck3.default)(this, AbstractQueue);
    }

    (0, _createClass3.default)(AbstractQueue, [{
        key: "add",
        value: function add(e) {
            return null;
        }
    }, {
        key: "addAll",
        value: function addAll(c) {
            return false;
        }
    }, {
        key: "clear",
        value: function clear() {}
    }, {
        key: "contains",
        value: function contains(e) {
            return false;
        }
    }, {
        key: "containsAll",
        value: function containsAll(c) {
            return false;
        }
    }, {
        key: "element",
        value: function element() {
            return null;
        }
    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return true;
        }
    }, {
        key: "offer",
        value: function offer(e) {
            return false;
        }
    }, {
        key: "peek",
        value: function peek() {
            return null;
        }
    }, {
        key: "poll",
        value: function poll() {
            return null;
        }
    }, {
        key: "remove",
        value: function remove() {
            return null;
        }
    }, {
        key: "size",
        value: function size() {
            return 0;
        }
    }]);
    return AbstractQueue;
}();

var DEFAULT_QUEUE_CAPACITY = exports.DEFAULT_QUEUE_CAPACITY = 100;

var Queue = exports.Queue = function (_AbstractQueue) {
    (0, _inherits3.default)(Queue, _AbstractQueue);

    function Queue() {
        var capacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_QUEUE_CAPACITY;
        (0, _classCallCheck3.default)(this, Queue);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Queue.__proto__ || Object.getPrototypeOf(Queue)).call(this));

        _this.head = 0;
        _this.tail = 0;
        _this.mask = 0;
        _this.tailCache = 0;
        _this.headCache = 0;
        _this.capacity = Queue.findNextPositivePowerOfTwo(capacity);
        _this.mask = _this.capacity - 1;
        _this.buffer = new Array(_this.capacity);
        return _this;
    }

    (0, _createClass3.default)(Queue, [{
        key: "add",
        value: function add(e) {
            if (this.offer(e)) {
                return true;
            }
            throw new RangeError("IllegalStateException Queue is full");
        }
    }, {
        key: "addAll",
        value: function addAll(c) {
            if (c !== null) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = c[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var v = _step.value;

                        this.add(v);
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

                return true;
            }
            throw new ReferenceError("NullPointerException Null is not a valid collection");
        }
    }, {
        key: "clear",
        value: function clear() {
            var value = null;
            do {
                value = this.poll();
            } while (value !== null);
        }
    }, {
        key: "contains",
        value: function contains(e) {
            if (e === null) {
                throw new ReferenceError("NullPointerException Null is not a valid element");
            }
            var o = null;
            for (var i = this.head, limit = this.tail; i < limit; i++) {
                o = this.buffer[i & this.mask];
                if (o === e) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: "containsAll",
        value: function containsAll(c) {
            if (c !== null) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = c[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var v = _step2.value;

                        if (!this.contains(v)) {
                            return false;
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

                return true;
            }
            throw new ReferenceError("NullPointerException Null is not a valid collection");
        }
    }, {
        key: "element",
        value: function element() {
            var e = this.peek();
            if (e === null) {
                throw new RangeError("NoSuchElementException Queue is empty");
            }
            return e;
        }
    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return this.tail === this.head;
        }
    }, {
        key: "offer",
        value: function offer(e) {
            if (e === null) {
                throw new ReferenceError("NullPointerException Null is not a valid element");
            }
            var currentTail = this.tail,
                wrapPoint = currentTail - this.capacity;
            if (this.headCache <= wrapPoint) {
                this.headCache = this.head;
                if (this.headCache <= wrapPoint) {
                    return false;
                }
            }
            this.buffer[currentTail & this.mask] = e;
            this.tail = currentTail + 1;
            return true;
        }
    }, {
        key: "peek",
        value: function peek() {
            return this.buffer[this.head & this.mask];
        }
    }, {
        key: "poll",
        value: function poll() {
            var currentHead = this.head;
            if (currentHead >= this.tailCache) {
                this.tailCache = this.tail;
                if (currentHead >= this.tailCache) {
                    return null;
                }
            }
            var index = currentHead & this.mask;
            var e = this.buffer[index];
            this.buffer[index] = null;
            this.head = currentHead + 1;
            return e;
        }
    }, {
        key: "remove",
        value: function remove() {
            var e = this.poll();
            if (e === null) {
                throw new RangeError("NoSuchElementException Queue is empty");
            }
            return e;
        }
    }, {
        key: "size",
        value: function size() {
            return this.tail - this.head;
        }
    }], [{
        key: "findNextPositivePowerOfTwo",
        value: function findNextPositivePowerOfTwo(value) {
            return 1 << 32 - Queue.numberOfLeadingZeros(value - 1);
        }
    }, {
        key: "numberOfLeadingZeros",
        value: function numberOfLeadingZeros(i) {
            if (i === 0) {
                return 32;
            }
            var n = 1;
            if (i >>> 16 === 0) {
                n += 16;
                i <<= 16;
            }
            if (i >>> 24 === 0) {
                n += 8;
                i <<= 8;
            }
            if (i >>> 28 === 0) {
                n += 4;
                i <<= 4;
            }
            if (i >>> 30 === 0) {
                n += 2;
                i <<= 2;
            }
            n -= i >>> 31;
            return n;
        }
    }]);
    return Queue;
}(AbstractQueue);