"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RingBuffer = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _queue = require("./queue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RingBuffer = exports.RingBuffer = function (_AbstractQueue) {
    (0, _inherits3.default)(RingBuffer, _AbstractQueue);

    function RingBuffer() {
        var capacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        (0, _classCallCheck3.default)(this, RingBuffer);

        var _this = (0, _possibleConstructorReturn3.default)(this, (RingBuffer.__proto__ || Object.getPrototypeOf(RingBuffer)).call(this));

        if (capacity <= 0) {
            throw new RangeError("IllegalArgumentException RingBuffer capacity must be positive.");
        }
        _this.offset = _this.unconsumedElements = 0;
        _this.buffer = new Array(capacity);
        return _this;
    }

    (0, _createClass3.default)(RingBuffer, [{
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
        key: "capacity",
        value: function capacity() {
            return this.buffer.length;
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
            return this.buffer.indexOf(e) !== -1;
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
            return this.size() === 0;
        }
    }, {
        key: "offer",
        value: function offer(e) {
            if (e === null) {
                throw new ReferenceError("NullPointerException Null is not a valid element");
            }
            if (this.unconsumedElements === this.buffer.length) {
                return false;
            }
            this.buffer[this.offset] = e;
            this.offset = (this.offset + 1) % this.buffer.length;
            ++this.unconsumedElements;
            return true;
        }
    }, {
        key: "peek",
        value: function peek() {
            if (this.unconsumedElements === 0) {
                return null;
            }
            var n = this.capacity();
            return this.buffer[(this.offset + (n - this.unconsumedElements)) % n];
        }
    }, {
        key: "poll",
        value: function poll() {
            var result = this.peek();
            --this.unconsumedElements;
            return result;
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
            return this.unconsumedElements;
        }
    }]);
    return RingBuffer;
}(_queue.AbstractQueue); /** @babel */