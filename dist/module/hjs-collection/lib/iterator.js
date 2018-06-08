'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Comparator = exports.CircularIterator = exports.Iterator = exports.Enumeration = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @babel */
var Enumeration = exports.Enumeration = function () {
    function Enumeration() {
        var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        (0, _classCallCheck3.default)(this, Enumeration);

        this.list = list;
        this.cursor = 0;
    }

    (0, _createClass3.default)(Enumeration, [{
        key: 'destroy',
        value: function destroy() {
            this.list = this.cursor = null;
        }
    }, {
        key: 'hasMoreElements',
        value: function hasMoreElements() {
            return this.cursor >= 0 && this.cursor < this.list.length;
        }
    }, {
        key: 'nextElement',
        value: function nextElement() {
            var el = this.list[this.cursor];
            this.cursor++;
            if (this.cursor === this.list.length) {
                this.destroy();
            }
            return el;
        }
    }, {
        key: 'toString',
        value: function toString() {
            return '\n      Enumeration[cursor: ' + this.cursor + ', list: ' + this.list.join(",") + ']\n    ';
        }
    }]);
    return Enumeration;
}();

var Iterator = function () {
    function Iterator() {
        var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        (0, _classCallCheck3.default)(this, Iterator);

        this.list = list;
        this.cursor = 0;
    }

    (0, _createClass3.default)(Iterator, [{
        key: 'hasNext',
        value: function hasNext() {
            return this.cursor < this.list.length;
        }
    }, {
        key: 'hasPrevious',
        value: function hasPrevious() {
            return this.cursor > 0;
        }
    }, {
        key: 'next',
        value: function next() {
            if (this.cursor < 0) {
                this.cursor = 0;
            }
            if (this.cursor < this.list.length) {
                var value = this.list[this.cursor];
                this.cursor += 1;
                return value;
            }
            return null;
        }
    }, {
        key: 'previous',
        value: function previous() {
            if (this.cursor >= this.list.length) {
                this.cursor = this.list.length - 1;
            }
            if (this.cursor >= 0) {
                var value = this.list[this.cursor];
                this.cursor -= 1;
                return value;
            }
            return null;
        }
    }, {
        key: 'remove',
        value: function remove() {
            if (this.cursor > 0 && this.cursor < this.list.length) {
                this.list.splice(this.cursor, 1);
            }
        }
    }, {
        key: 'toString',
        value: function toString() {
            return '\n      Iterator[cursor: ' + this.cursor + ', list: ' + this.list.join(",") + ']\n    ';
        }
    }], [{
        key: 'div',
        value: function div(num, denom) {
            return Math[num > 0 ? 'floor' : 'ceil'](num / denom);
        }
    }, {
        key: 'mod',
        value: function mod(num, _mod) {
            var remain = num % _mod;
            return Math.floor(remain >= 0 ? remain : remain + _mod);
        }
    }, {
        key: 'remain',
        value: function remain(num, denom) {
            return Math[num > 0 ? 'floor' : 'ceil'](num % denom);
        }
    }]);
    return Iterator;
}();

exports.Iterator = Iterator;

var CircularIterator = exports.CircularIterator = function (_Iterator) {
    (0, _inherits3.default)(CircularIterator, _Iterator);

    function CircularIterator() {
        var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        (0, _classCallCheck3.default)(this, CircularIterator);
        return (0, _possibleConstructorReturn3.default)(this, (CircularIterator.__proto__ || Object.getPrototypeOf(CircularIterator)).call(this, list));
    }

    (0, _createClass3.default)(CircularIterator, [{
        key: 'next',
        value: function next() {
            if (this.cursor < 0) {
                this.cursor = 0;
            }
            if (this.cursor < this.list.length) {
                this.cursor += 1;
                var index = Iterator.mod(this.cursor, this.list.length);
                return this.list[index];
            }
            return null;
        }
    }, {
        key: 'previous',
        value: function previous() {
            if (this.cursor >= this.list.length) {
                this.cursor = this.list.length - 1;
            }
            if (this.cursor >= 0) {
                this.cursor -= 1;
                var index = Iterator.mod(this.cursor, this.list.length);
                return this.list[index];
            }
            return null;
        }
    }]);
    return CircularIterator;
}(Iterator);

var Comparator = exports.Comparator = function () {
    function Comparator() {
        (0, _classCallCheck3.default)(this, Comparator);
    }

    (0, _createClass3.default)(Comparator, [{
        key: 'compare',
        value: function compare(s1, s2) {
            if (s1 === null && s2 === null || s1 === s2) {
                return 0;
            }
            if (s1 !== null && s1.hasOwnProperty('compareTo') && s1['compareTo'] !== null) {
                return s1['compareTo'](s2);
            } else if (s2 !== null && s2.hasOwnProperty('compareTo') && s2['compareTo'] !== null) {
                return s2['compareTo'](s1);
            }
            if (typeof s1 === "string" && typeof s2 === "string") {
                var n1 = s1.length;
                var n2 = s2.length;
                var c1 = 0;
                var c2 = 0;
                for (var i1 = 0, i2 = 0; i1 < n1 && i2 < n2; i1++, i2++) {
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
            } else if ((typeof s1 === 'undefined' ? 'undefined' : (0, _typeof3.default)(s1)) === "object" && (typeof s2 === 'undefined' ? 'undefined' : (0, _typeof3.default)(s2)) === "object") {
                if (s1.constructor === Object && s2.constructor === Object) {
                    var o = -1;
                    for (var p in s1) {
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
                    var a1 = s1.length;
                    var a2 = s2.length;
                    var a = this.compare(a1, a2);
                    if (a === 0) {
                        for (var j1 = 0, j2 = 0; j1 < a1 && j2 < a2; j1++, j2++) {
                            a = this.compare(s1[j1], s2[j2]);
                            if (a === 0) {
                                continue;
                            }
                            break;
                        }
                        return a1 - a2 + a;
                    }
                    return a;
                } else if (s1 instanceof ArrayBuffer && s2 instanceof ArrayBuffer) {
                    var b1 = s1.byteLength;
                    var b2 = s2.byteLength;
                    var _a = this.compare(b1, b2);
                    if (_a === 0) {
                        var len = _a;
                        var v1 = new Int8Array(s1);
                        var v2 = new Int8Array(s2);
                        for (var _j = 0, _j2 = 0; _j < len && _j2 < len; _j++, _j2++) {
                            _a = this.compare(v1[_j], v2[_j2]);
                            if (_a === 0) {
                                continue;
                            }
                            break;
                        }
                    }
                    return _a;
                } else if (s1 instanceof DataView && s2 instanceof DataView || s1 instanceof TypedArray && s2 instanceof TypedArray) {
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
    }]);
    return Comparator;
}();