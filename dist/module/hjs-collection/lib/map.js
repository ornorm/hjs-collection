"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AbstractMap = undefined;

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @babel */
var AbstractMap = exports.AbstractMap = function () {
    function AbstractMap() {
        var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, AbstractMap);

        this.map = new Map();
        this.putAll(values);
    }

    (0, _createClass3.default)(AbstractMap, [{
        key: "clear",
        value: function clear() {
            this.map.clear();
        }
    }, {
        key: "clone",
        value: function clone() {
            return new AbstractMap(this);
        }
    }, {
        key: "containsKey",
        value: function containsKey(key) {
            return this.map.has(key);
        }
    }, {
        key: "containsValue",
        value: function containsValue(value) {
            var values = this.map.values();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var v = _step.value;

                    if (v === value) {
                        return true;
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

            return false;
        }
    }, {
        key: "finalize",
        value: function finalize() {
            this.map.clear();
            this.map = null;
        }
    }, {
        key: "entries",
        value: function entries() {
            var keys = this.map.keys();
            var result = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _ref = _step2.value;

                    var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

                    var index = _ref2[0];
                    var key = _ref2[1];

                    result[index] = { key: key, value: this.map.get(key) };
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

            return result;
        }
    }, {
        key: "entrySet",
        value: function entrySet() {
            return new Set(this.entries());
        }
    }, {
        key: "get",
        value: function get(key) {
            if (key === null) {
                return null;
            }
            return this.map.get(key);
        }
    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return this.map.size === 0;
        }
    }, {
        key: "keys",
        value: function keys() {
            return this.map.keys();
        }
    }, {
        key: "keysSet",
        value: function keysSet() {
            return new Set(this.keys());
        }
    }, {
        key: "put",
        value: function put(key, value) {
            if (key === null) {
                return null;
            }
            var old = this.map.get(key);
            this.map.set(key, value);
            return old;
        }
    }, {
        key: "putAll",
        value: function putAll(map) {
            var _this = this;

            if (map === null) {
                return;
            } else {
                if (map instanceof AbstractMap) {
                    var keys = map.keys();
                    var len = keys.length;
                    while (len--) {
                        var key = keys[len];
                        this.put(key, map.get(key));
                    }
                } else if (map instanceof Map) {
                    var _keys = map.keys();
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = _keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var _key = _step3.value;

                            this.put(_key, map.get(_key));
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }
                } else if (Array.isArray(map)) {
                    map.forEach(function (e, index) {
                        _this.put(index, e);
                    });
                } else {
                    for (var p in map) {
                        if (map.hasOwnProperty(p)) {
                            this.put(p, map[p]);
                        }
                    }
                }
            }
        }
    }, {
        key: "remove",
        value: function remove(key) {
            if (key === null) {
                return;
            }
            var old = this.map.get(key);
            if (old !== null) {
                this.map.delete(key);
            }
            return old;
        }
    }, {
        key: "size",
        value: function size() {
            return this.map.size;
        }
    }, {
        key: "toMap",
        value: function toMap() {
            return new Map(this.map);
        }
    }, {
        key: "toObject",
        value: function toObject() {
            var o = {};
            var keys = this.map.keys();
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = keys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var key = _step4.value;

                    o[key] = this.map.get(key);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return o;
        }
    }, {
        key: "toString",
        value: function toString() {
            var out = "";
            var keys = this.keys();
            var values = this.values();
            var len = keys.length;
            for (var i = 0; i < len; i++) {
                out += keys[i] + "=" + values[i];
                if (i < len - 1) {
                    out += ",";
                }
            }
            return out;
        }
    }, {
        key: "values",
        value: function values() {
            return this.map.values();
        }
    }]);
    return AbstractMap;
}();