"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BST = exports.BSTNode = undefined;

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _iterator = require("./iterator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BSTNode = exports.BSTNode = function BSTNode(key, val, size) {
    (0, _classCallCheck3.default)(this, BSTNode);

    this.key = key;
    this.val = val;
    this.size = size;
    this.left = null;
    this.right = null;
}; /** @babel */


var BST = exports.BST = function (_Comparator) {
    (0, _inherits3.default)(BST, _Comparator);

    function BST() {
        (0, _classCallCheck3.default)(this, BST);

        var _this = (0, _possibleConstructorReturn3.default)(this, (BST.__proto__ || Object.getPrototypeOf(BST)).call(this));

        _this.root = null;
        return _this;
    }

    (0, _createClass3.default)(BST, [{
        key: "ceiling",
        value: function ceiling(key) {
            if (key === null) {
                throw new ReferenceError("argument to ceiling() is null");
            }
            if (this.isEmpty()) {
                throw new RangeError("called ceiling() with empty symbol table");
            }
            var x = this.internalCeiling(this.root, key);
            if (x === null) {
                return null;
            }
            return x.key;
        }
    }, {
        key: "check",
        value: function check() {
            var isBSTFlag = this.isBST();
            if (!isBSTFlag) {
                console.log("Not in symmetric order");
            }
            var isSizeConsistentFlag = this.isSizeConsistent();
            if (!isSizeConsistentFlag) {
                console.log("Subtree counts not consistent");
            }
            var isRankConsistentFlag = this.isRankConsistent();
            if (!isRankConsistentFlag) {
                console.log("Ranks not consistent");
            }
            return isBSTFlag && isSizeConsistentFlag && isRankConsistentFlag;
        }
    }, {
        key: "contains",
        value: function contains(key) {
            if (key === null) {
                throw new ReferenceError("argument to contains() is null");
            }
            return this.get(key) !== null;
        }
    }, {
        key: "deleteMax",
        value: function deleteMax() {
            if (this.isEmpty()) {
                throw new RangeError("Symbol table underflow");
            }
            this.root = this.internalDeleteMax(this.root);
            this.check();
        }
    }, {
        key: "deleteMin",
        value: function deleteMin() {
            if (this.isEmpty()) {
                throw new RangeError("Symbol table underflow");
            }
            this.root = this.internalDeleteMin(this.root);
            this.check();
        }
    }, {
        key: "floor",
        value: function floor(key) {
            if (key === null) {
                throw new ReferenceError("argument to floor() is null");
            }
            if (this.isEmpty()) {
                throw new RangeError("called floor() with empty symbol table");
            }
            var x = this.internalFloor(this.root, key);
            if (x === null) {
                return null;
            }
            return x.key;
        }
    }, {
        key: "get",
        value: function get(key) {
            return this.internalGet(this.root, key);
        }
    }, {
        key: "getKeys",
        value: function getKeys(lo, hi) {
            if (lo === null) {
                throw new ReferenceError("first argument to keys() is null");
            }
            if (hi === null) {
                throw new ReferenceError("second argument to keys() is null");
            }
            var queue = [];
            this.internalKeys(this.root, queue, lo, hi);
            return queue;
        }
    }, {
        key: "height",
        value: function height() {
            return this.internalHeight(this.root);
        }
    }, {
        key: "internalCeiling",
        value: function internalCeiling(x, key) {
            if (x === null) {
                return null;
            }
            var cmp = this.compare(key, x.key);
            if (cmp === 0) {
                return x;
            }
            if (cmp < 0) {
                var t = this.internalCeiling(x.left, key);
                if (t !== null) {
                    return t;
                }
                return x;
            }
            return this.internalCeiling(x.right, key);
        }
    }, {
        key: "internalDeleteMax",
        value: function internalDeleteMax(x) {
            if (x.right === null) {
                return x.left;
            }
            x.right = this.internalDeleteMax(x.right);
            x.size = this.internalSize(x.left) + this.internalSize(x.right) + 1;
            return x;
        }
    }, {
        key: "internalDeleteMin",
        value: function internalDeleteMin(x) {
            if (x.left === null) {
                return x.right;
            }
            x.left = this.internalDeleteMin(x.left);
            x.size = this.internalSize(x.left) + this.internalSize(x.right) + 1;
            return x;
        }
    }, {
        key: "internalFloor",
        value: function internalFloor(x, key) {
            if (x === null) {
                return null;
            }
            var cmp = this.compare(key, x.key);
            if (cmp === 0) {
                return x;
            }
            if (cmp < 0) {
                return this.internalFloor(x.left, key);
            }
            var t = this.internalFloor(x.right, key);
            if (t !== null) {
                return t;
            }
            return x;
        }
    }, {
        key: "internalGet",
        value: function internalGet(x, key) {
            if (x === null) {
                return null;
            }
            var cmp = this.compare(key, x.key);
            if (cmp < 0) {
                return this.internalGet(x.left, key);
            } else if (cmp > 0) {
                return this.internalGet(x.right, key);
            }
            return x.val;
        }
    }, {
        key: "internalHeight",
        value: function internalHeight(x) {
            if (x === null) {
                return -1;
            }
            return 1 + Math.max(this.internalHeight(x.left), this.internalHeight(x.right));
        }
    }, {
        key: "internalIsBST",
        value: function internalIsBST(x, min, max) {
            if (x === null) {
                return true;
            }
            if (min !== null && this.compare(x.key, min) <= 0) {
                return false;
            }
            if (max !== null && this.compare(x.key, max) >= 0) {
                return false;
            }
            return this.internalIsBST(x.left, min, x.key) && this.internalIsBST(x.right, x.key, max);
        }
    }, {
        key: "internalKeys",
        value: function internalKeys(x, queue, lo, hi) {
            if (x === null) {
                return;
            }
            var cmplo = this.compare(lo, x.key);
            var cmphi = this.compare(hi, x.key);
            if (cmplo < 0) {
                this.internalKeys(x.left, queue, lo, hi);
            }
            if (cmplo <= 0 && cmphi >= 0) {
                queue.push(x.key);
            }
            if (cmphi > 0) {
                this.internalKeys(x.right, queue, lo, hi);
            }
        }
    }, {
        key: "internalMax",
        value: function internalMax(x) {
            if (x.right === null) {
                return x;
            }
            return this.internalMax(x.right);
        }
    }, {
        key: "internalMin",
        value: function internalMin(x) {
            if (x.left === null) {
                return x;
            }
            return this.internalMin(x.left);
        }
    }, {
        key: "internalPut",
        value: function internalPut(x, key, val) {
            if (x === null) {
                return new BSTNode(key, val, 1);
            }
            var cmp = this.compare(key, x.key);
            if (cmp < 0) {
                x.left = this.internalPut(x.left, key, val);
            } else if (cmp > 0) {
                x.val = val;
            }
            x.size = 1 + this.internalSize(x.left) + this.internalSize(x.right);
            return x;
        }
    }, {
        key: "internalRank",
        value: function internalRank(key, x) {
            if (x === null) {
                return 0;
            }
            var cmp = this.compare(key, x.key);
            if (cmp < 0) {
                return this.internalRank(key, x.left);
            } else if (cmp > 0) {
                return 1 + this.internalSize(x.left) + this.internalRank(key, x.right);
            }
            return this.internalSize(x.left);
        }
    }, {
        key: "internalRemove",
        value: function internalRemove(x, key) {
            if (x === null) {
                return null;
            }
            var cmp = this.compare(key, x.key);
            if (cmp < 0) {
                x.left = this.internalRemove(x.left, key);
            } else if (cmp > 0) {
                x.right = this.internalRemove(x.right, key);
            } else {
                if (x.right === null) {
                    return x.left;
                }
                if (x.left === null) {
                    return x.right;
                }
                var t = x;
                x = this.internalMin(t.right);
                x.right = this.internalDeleteMin(t.right);
                x.left = t.left;
            }
            x.size = this.internalSize(x.left) + this.internalSize(x.right) + 1;
            return x;
        }
    }, {
        key: "internalSelect",
        value: function internalSelect(x, k) {
            if (x === null) {
                return null;
            }
            var t = this.internalSize(x.left);
            if (t > k) {
                return this.internalSelect(x.left, k);
            } else if (t < k) {
                return this.internalSelect(x.right, k - t - 1);
            }
            return x;
        }
    }, {
        key: "internalSize",
        value: function internalSize(x) {
            if (x === null) {
                return 0;
            }
            return x.size;
        }
    }, {
        key: "internalIsSizeConsistent",
        value: function internalIsSizeConsistent(x) {
            if (x === null) {
                return true;
            }
            if (x.size !== this.internalSize(x.left) + this.internalSize(x.right) + 1) {
                return false;
            }
            return this.internalIsSizeConsistent(x.left) && this.internalIsSizeConsistent(x.right);
        }
    }, {
        key: "isBST",
        value: function isBST() {
            return this.internalIsBST(this.root, null, null);
        }
    }, {
        key: "isRankConsistent",
        value: function isRankConsistent() {
            for (var i = 0; i < this.size(); i++) {
                if (i !== this.rank(this.select(i))) {
                    return false;
                }
            }
            var key = null;
            var keys = this.keys();
            var len = keys.length;
            while (len--) {
                key = keys[len];
                if (this.compare(key, this.select(this.rank(key))) !== 0) {
                    return false;
                }
            }
            return true;
        }
    }, {
        key: "isSizeConsistent",
        value: function isSizeConsistent() {
            return this.internalIsSizeConsistent(this.root);
        }
    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return this.size() === 0;
        }
    }, {
        key: "keys",
        value: function keys() {
            return this.getKeys(this.min(), this.max());
        }
    }, {
        key: "levelOrder",
        value: function levelOrder() {
            var x = null;
            var keys = [];
            var queue = [];
            queue.push(this.root);
            while (queue.length > 0) {
                x = queue.pop();
                if (x === null) {
                    continue;
                }
                keys.push(x.key);
                queue.push(x.left);
                queue.push(x.right);
            }
            return keys;
        }
    }, {
        key: "max",
        value: function max() {
            if (this.isEmpty()) {
                throw new RangeError("called max() with empty symbol table");
            }
            return this.internalMax(this.root).key;
        }
    }, {
        key: "min",
        value: function min() {
            if (this.isEmpty()) {
                throw new RangeError("called min() with empty symbol table");
            }
            return this.internalMin(this.root).key;
        }
    }, {
        key: "put",
        value: function put(key, val) {
            if (key === null) {
                throw new ReferenceError("first argument to put() is null");
            }
            if (val === null) {
                this.remove(key);
            }
            this.root = this.internalPut(this.root, key, val);
            this.check();
        }
    }, {
        key: "rank",
        value: function rank(key) {
            if (key === null) {
                throw new ReferenceError("argument to rank() is null");
            }
            return this.internalRank(key, this.root);
        }
    }, {
        key: "remove",
        value: function remove(key) {
            if (key === null) {
                throw new ReferenceError("argument to delete() is null");
            }
            this.root = this.internalRemove(this.root, key);
            this.check();
        }
    }, {
        key: "select",
        value: function select(k) {
            if (k < 0 || k >= this.size()) {
                throw new RangeError("k < 0 or k >= size");
            }
            var x = this.internalSelect(this.root, k);
            return x.key;
        }
    }, {
        key: "size",
        value: function size() {
            return this.internalSize(this.root);
        }
    }, {
        key: "sizeof",
        value: function sizeof(lo, hi) {
            if (lo === null) {
                throw new ReferenceError("first argument to size() is null");
            }
            if (hi === null) {
                throw new ReferenceError("second argument to size() is null");
            }
            if (this.compare(lo, hi) > 0) {
                return 0;
            }
            if (this.contains(hi)) {
                return this.rank(hi) - this.rank(lo) + 1;
            }
            return this.rank(hi) - this.rank(lo);
        }
    }]);
    return BST;
}(_iterator.Comparator);