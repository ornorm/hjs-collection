'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LinkedList = exports.LinkedListIterator = exports.LinkedNode = undefined;

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _iterator2 = require('./iterator');

var _queue = require('./queue');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @babel */
var LinkedNode = exports.LinkedNode = function LinkedNode() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$item = _ref.item,
        item = _ref$item === undefined ? null : _ref$item,
        _ref$next = _ref.next,
        next = _ref$next === undefined ? null : _ref$next,
        _ref$prev = _ref.prev,
        prev = _ref$prev === undefined ? null : _ref$prev;

    (0, _classCallCheck3.default)(this, LinkedNode);

    this.item = item;
    this.next = next;
    this.prev = prev;
};

var LinkedListIterator = exports.LinkedListIterator = function (_Iterator) {
    (0, _inherits3.default)(LinkedListIterator, _Iterator);

    function LinkedListIterator() {
        var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        (0, _classCallCheck3.default)(this, LinkedListIterator);

        var _this = (0, _possibleConstructorReturn3.default)(this, (LinkedListIterator.__proto__ || Object.getPrototypeOf(LinkedListIterator)).call(this, list));

        _this.nextReturned = index === list.count ? null : list.node(index);
        _this.expectedModCount = 0;
        _this.cursor = index;
        return _this;
    }

    (0, _createClass3.default)(LinkedListIterator, [{
        key: 'add',
        value: function add(e) {
            this.checkForComodification();
            this.lastReturned = null;
            if (this.nextReturned === null) {
                this.list.linkLast(e);
            } else {
                this.list.linkBefore(e, next);
            }
            this.cursor++;
            this.expectedModCount++;
        }
    }, {
        key: 'checkForComodification',
        value: function checkForComodification() {
            if (this.list.modCount !== this.expectedModCount) {
                throw new Error("ConcurrentModificationException");
            }
        }
    }, {
        key: 'hasNext',
        value: function hasNext() {
            return this.cursor < this.list.count;
        }
    }, {
        key: 'hasPrevious',
        value: function hasPrevious() {
            return this.cursor > 0;
        }
    }, {
        key: 'next',
        value: function next() {
            this.checkForComodification();
            if (!this.hasNext()) {
                throw new RangeError("NoSuchElementException");
            }
            this.lastReturned = this.nextReturned;
            this.nextReturned = this.nextReturned.next;
            this.cursor++;
            return this.lastReturned.item;
        }
    }, {
        key: 'nextIndex',
        value: function nextIndex() {
            return this.cursor;
        }
    }, {
        key: 'previous',
        value: function previous() {
            this.checkForComodification();
            if (!this.hasPrevious()) {
                throw new RangeError("NoSuchElementException");
            }
            this.lastReturned = this.nextReturned = this.nextReturned === null ? this.last : this.nextReturned.prev;
            this.cursor--;
            return this.lastReturned.item;
        }
    }, {
        key: 'previousIndex',
        value: function previousIndex() {
            return this.cursor - 1;
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.checkForComodification();
            if (this.lastReturned === null) {
                throw new Error("IllegalStateException");
            }
            var lastNext = this.lastReturned.next;
            this.list.unlink(this.lastReturned);
            if (this.nextReturned === this.lastReturned) {
                this.nextReturned = lastNext;
            } else {
                this.cursor--;
            }
            this.lastReturned = null;
            this.expectedModCount++;
        }
    }, {
        key: 'set',
        value: function set(e) {
            if (this.lastReturned === null) {
                throw new Error("IllegalStateException");
            }
            this.checkForComodification();
            this.lastReturned.item = e;
        }
    }]);
    return LinkedListIterator;
}(_iterator2.Iterator);

var LinkedList = exports.LinkedList = function (_AbstractQueue) {
    (0, _inherits3.default)(LinkedList, _AbstractQueue);

    function LinkedList() {
        var c = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        (0, _classCallCheck3.default)(this, LinkedList);

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (LinkedList.__proto__ || Object.getPrototypeOf(LinkedList)).call(this));

        _this2.count = 0;
        _this2.modCount = 0;
        _this2.first = null;
        _this2.last = null;
        if (c !== null && Array.isArray(c)) {
            _this2.addAll(c);
        }
        return _this2;
    }

    (0, _createClass3.default)(LinkedList, [{
        key: 'add',
        value: function add(e) {
            this.linkLast(e);
            return true;
        }
    }, {
        key: 'addAll',
        value: function addAll(c) {
            return this.addAllAt(this.count, c);
        }
    }, {
        key: 'addAt',
        value: function addAt(index, e) {
            this.checkPositionIndex(index);
            if (index === this.count) {
                this.linkLast(e);
            } else {
                this.linkBefore(e, this.node(index));
            }
        }
    }, {
        key: 'addAllAt',
        value: function addAllAt(index, c) {
            this.checkPositionIndex(index);
            var numNew = c.length;
            if (numNew === 0) {
                return false;
            }
            var pred = null;
            var succ = null;
            if (index === this.count) {
                succ = null;
                pred = this.last;
            } else {
                succ = this.node(index);
                pred = succ.prev;
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = c[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var v = _step.value;

                    var newNode = new LinkedNode({
                        prev: pred,
                        item: v,
                        next: null
                    });
                    if (pred === null) {
                        this.first = newNode;
                    } else {
                        pred.next = newNode;
                    }
                    pred = newNode;
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

            if (succ === null) {
                this.last = pred;
            } else {
                pred.next = succ;
                succ.prev = pred;
            }
            this.count += numNew;
            this.modCount++;
            return true;
        }
    }, {
        key: 'addFirst',
        value: function addFirst(e) {
            this.linkFirst(e);
        }
    }, {
        key: 'addLast',
        value: function addLast(e) {
            this.linkLast(e);
        }
    }, {
        key: 'checkElementIndex',
        value: function checkElementIndex(index) {
            if (!this.isElementIndex(index)) {
                throw new RangeError(this.outOfBoundsMsg(index));
            }
        }
    }, {
        key: 'checkPositionIndex',
        value: function checkPositionIndex(index) {
            if (!this.isPositionIndex(index)) {
                throw new RangeError(this.outOfBoundsMsg(index));
            }
        }
    }, {
        key: 'clear',
        value: function clear() {
            var next = null;
            // Clearing all of the links between nodes is "unnecessary", but:
            // - helps a generational GC if the discarded nodes inhabit
            //   more than one generation
            // - is sure to free memory even if there is a reachable Iterator
            for (var x = this.first; x !== null;) {
                next = x.next;
                x.item = x.next = x.prev = null;
                x = next;
            }
            this.first = this.last = null;
            this.count = 0;
            this.modCount++;
        }
    }, {
        key: 'contains',
        value: function contains(e) {
            return this.indexOf(e) !== -1;
        }
    }, {
        key: 'element',
        value: function element() {
            return this.getFirst();
        }
    }, {
        key: 'get',
        value: function get(index) {
            this.checkElementIndex(index);
            return this.node(index).item;
        }
    }, {
        key: 'getFirst',
        value: function getFirst() {
            var f = this.first;
            if (f === null) {
                throw new RangeError("NoSuchElementException this list is empty");
            }
            return f.item;
        }
    }, {
        key: 'getLast',
        value: function getLast() {
            var l = this.last;
            if (l === null) {
                throw new RangeError("NoSuchElementException this list is empty");
            }
            return l.item;
        }
    }, {
        key: 'indexOf',
        value: function indexOf(e) {
            var index = 0;
            if (e === null) {
                for (var x = this.first; x !== null; x = x.next) {
                    if (x.item !== null) {
                        return index;
                    }
                    index++;
                }
            } else {
                for (var _x5 = this.first; _x5 !== null; _x5 = _x5.next) {
                    if (e === _x5.item) {
                        return index;
                    }
                    index++;
                }
            }
            return -1;
        }
    }, {
        key: 'isElementIndex',
        value: function isElementIndex(index) {
            return index >= 0 && index < this.count;
        }
    }, {
        key: 'isPositionIndex',
        value: function isPositionIndex(index) {
            return index >= 0 && index <= this.count;
        }
    }, {
        key: 'lastIndexOf',
        value: function lastIndexOf(e) {
            var index = this.count;
            if (e === null) {
                for (var x = this.last; x !== null; x = x.prev) {
                    index--;
                    if (x.item === null) {
                        return index;
                    }
                }
            } else {
                for (var _x6 = this.last; _x6 !== null; _x6 = _x6.prev) {
                    index--;
                    if (e === _x6.item) {
                        return index;
                    }
                }
            }
            return -1;
        }
    }, {
        key: 'linkBefore',
        value: function linkBefore(e, succ) {
            var pred = succ.prev;
            var newNode = new LinkedNode({
                prev: pred,
                item: e,
                next: succ
            });
            succ.prev = newNode;
            if (pred === null) {
                this.first = newNode;
            } else {
                pred.next = newNode;
            }
            this.count++;
            this.modCount++;
        }
    }, {
        key: 'linkLast',
        value: function linkLast(e) {
            var l = this.last;
            var newNode = new LinkedNode({
                prev: l,
                item: e,
                next: null
            });
            this.last = newNode;
            if (l === null) {
                this.first = newNode;
            } else {
                l.next = newNode;
            }
            this.count++;
            this.modCount++;
        }
    }, {
        key: 'linkFirst',
        value: function linkFirst(e) {
            var f = this.first;
            var newNode = new LinkedNode({
                prev: null,
                item: e,
                next: f
            });
            this.first = newNode;
            if (e === null) {
                this.last = newNode;
            } else {
                f.prev = newNode;
            }
            this.count++;
            this.modCount++;
        }
    }, {
        key: 'listIterator',
        value: function listIterator(index) {
            this.checkPositionIndex(index);
            return new LinkedListIterator(this, index);
        }
    }, {
        key: 'node',
        value: function node(index) {
            if (index < this.count >> 1) {
                var x = this.first;
                for (var i = 0; i < index; i++) {
                    x = x.next;
                }
                return x;
            } else {
                var _x7 = this.last;
                for (var _i = this.count - 1; _i > index; _i--) {
                    _x7 = _x7.prev;
                }
                return _x7;
            }
        }
    }, {
        key: 'offer',
        value: function offer(e) {
            return this.add(e);
        }
    }, {
        key: 'offerFirst',
        value: function offerFirst(e) {
            this.addFirst(e);
            return true;
        }
    }, {
        key: 'offerLast',
        value: function offerLast(e) {
            this.addLast(e);
            return true;
        }
    }, {
        key: 'outOfBoundsMsg',
        value: function outOfBoundsMsg(index) {
            return "Index: " + index + ", Size: " + this.count;
        }
    }, {
        key: 'peek',
        value: function peek() {
            var f = this.first;
            return f === null ? null : f.item;
        }
    }, {
        key: 'peekFirst',
        value: function peekFirst() {
            return this.peek();
        }
    }, {
        key: 'peekLast',
        value: function peekLast() {
            var l = this.last;
            return l === null ? null : l.item;
        }
    }, {
        key: 'poll',
        value: function poll() {
            var f = this.first;
            return f === null ? null : this.unlinkFirst(f);
        }
    }, {
        key: 'pollFirst',
        value: function pollFirst() {
            return this.poll();
        }
    }, {
        key: 'pollLast',
        value: function pollLast() {
            var l = this.last;
            return l === null ? null : this.unlinkLast(l);
        }
    }, {
        key: 'pop',
        value: function pop() {
            return this.removeFirst();
        }
    }, {
        key: 'push',
        value: function push(e) {
            this.addFirst(e);
        }
    }, {
        key: 'remove',
        value: function remove(e) {
            if (e === null) {
                for (var x = this.first; x !== null; x = x.next) {
                    if (x.item === null) {
                        this.unlink(x);
                        return true;
                    }
                }
            } else {
                for (var _x8 = this.first; _x8 !== null; _x8 = _x8.next) {
                    if (e === _x8.item) {
                        this.unlink(_x8);
                        return true;
                    }
                }
            }
            return false;
        }
    }, {
        key: 'removeAt',
        value: function removeAt(index) {
            this.checkElementIndex(index);
            return this.unlink(this.node(index));
        }
    }, {
        key: 'removeFirst',
        value: function removeFirst() {
            var f = this.first;
            if (f === null) {
                throw new RangeError("NoSuchElementException this list is empty");
            }
            return this.unlinkFirst(f);
        }
    }, {
        key: 'removeFirstOccurrence',
        value: function removeFirstOccurrence(e) {
            return this.remove(e);
        }
    }, {
        key: 'removeLast',
        value: function removeLast() {
            var l = this.last;
            if (l === null) {
                throw new RangeError("NoSuchElementException this list is empty");
            }
            return this.unlinkLast(l);
        }
    }, {
        key: 'removeLastOccurrence',
        value: function removeLastOccurrence(e) {
            if (e === null) {
                for (var x = this.last; x !== null; x = x.prev) {
                    if (!x.item === null) {
                        this.unlink(x);
                        return true;
                    }
                }
            } else {
                for (var _x9 = this.last; _x9 !== null; _x9 = _x9.prev) {
                    if (e === _x9.item) {
                        this.unlink(_x9);
                        return true;
                    }
                }
            }
            return false;
        }
    }, {
        key: 'set',
        value: function set(index, element) {
            this.checkElementIndex(index);
            var x = this.node(index);
            var oldVal = x.item;
            x.item = element;
            return oldVal;
        }
    }, {
        key: 'size',
        value: function size() {
            return this.count;
        }
    }, {
        key: 'unlink',
        value: function unlink(x) {
            var element = x.item;
            var next = x.next;
            var prev = x.prev;
            if (prev === null) {
                this.first = next;
            } else {
                prev.next = next;
                x.prev = null;
            }
            if (next === null) {
                this.last = prev;
            } else {
                next.prev = prev;
                x.next = null;
            }
            x.item = null;
            this.count--;
            this.modCount++;
            return element;
        }
    }, {
        key: 'unlinkFirst',
        value: function unlinkFirst(f) {
            var element = f.item;
            var next = f.next;
            f.item = f.next = null;
            // help GC
            this.first = next;
            if (next === null) {
                this.last = null;
            } else {
                next.prev = null;
            }
            this.count--;
            this.modCount++;
            return element;
        }
    }, {
        key: 'unlinkLast',
        value: function unlinkLast(l) {
            var element = l.item;
            var prev = l.prev;
            l.item = l.prev = null; // help GC
            this.last = prev;
            if (prev === null) {
                this.first = null;
            } else {
                prev.next = null;
            }
            this.count--;
            this.modCount++;
            return element;
        }
    }]);
    return LinkedList;
}(_queue.AbstractQueue);