"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LinkedMultiTreeNode = exports.ArrayMultiTreeNode = exports.MultiTreeNode = exports.TreeNode = exports.TreeNodeIterator = exports.TraversalAction = undefined;

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _util = require("hjs-core/lib/util");

var util = _interopRequireWildcard(_util);

var _iterator15 = require("./iterator");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @babel */
var TraversalAction = exports.TraversalAction = function () {
    function TraversalAction() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$isCompleted = _ref.isCompleted,
            isCompleted = _ref$isCompleted === undefined ? null : _ref$isCompleted,
            _ref$perform = _ref.perform,
            perform = _ref$perform === undefined ? null : _ref$perform;

        (0, _classCallCheck3.default)(this, TraversalAction);

        if (isCompleted !== null) {
            this.isCompleted = isCompleted;
        }
        if (perform !== null) {
            this.perform = perform;
        }
    }

    (0, _createClass3.default)(TraversalAction, [{
        key: "isCompleted",
        value: function isCompleted() {
            return null;
        }
    }, {
        key: "perform",
        value: function perform(node) {}
    }]);
    return TraversalAction;
}();

var TreeNodeIterator = exports.TreeNodeIterator = function (_Iterator) {
    (0, _inherits3.default)(TreeNodeIterator, _Iterator);

    function TreeNodeIterator(_ref2) {
        var list = _ref2.list,
            _ref2$leftMostNode = _ref2.leftMostNode,
            leftMostNode = _ref2$leftMostNode === undefined ? null : _ref2$leftMostNode,
            _ref2$rightSiblingNod = _ref2.rightSiblingNode,
            rightSiblingNode = _ref2$rightSiblingNod === undefined ? null : _ref2$rightSiblingNod;
        (0, _classCallCheck3.default)(this, TreeNodeIterator);

        var _this = (0, _possibleConstructorReturn3.default)(this, (TreeNodeIterator.__proto__ || Object.getPrototypeOf(TreeNodeIterator)).call(this, list));

        _this.currentNode = null;
        _this.nextNode = list;
        _this.nextNodeAvailable = true;
        _this.expectedSize = list.size();
        if (leftMostNode !== null) {
            _this.leftMostNode = leftMostNode;
        }
        if (rightSiblingNode !== null) {
            _this.rightSiblingNode = rightSiblingNode;
        }
        return _this;
    }

    (0, _createClass3.default)(TreeNodeIterator, [{
        key: "checkAndGetLeftMostNode",
        value: function checkAndGetLeftMostNode() {
            if (this.list.isLeaf()) {
                throw new ReferenceError("TreeNodeException Leftmost node can't be obtained. Current tree node is a leaf");
            }
            return this.leftMostNode();
        }
    }, {
        key: "checkAndGetRightSiblingNode",
        value: function checkAndGetRightSiblingNode() {
            if (this.list.isLeaf()) {
                throw new ReferenceError("Right sibling node can't be obtained. Current tree node is root");
            }
            return this.rightSiblingNode();
        }
    }, {
        key: "hasNext",
        value: function hasNext() {
            return this.nextNodeAvailable;
        }
    }, {
        key: "isIterationStarted",
        value: function isIterationStarted() {
            return this.currentNode !== null;
        }
    }, {
        key: "next",
        value: function next() {
            if (!this.hasNext()) {
                throw new RangeError("NoSuchElementException");
            }
            this.currentNode = this.nextNode;
            if (this.nextNode.isLeaf()) {
                if (this.nextNode.isRoot()) {
                    this.nextNodeAvailable = false;
                } else {
                    do {
                        var currentNode = this.nextNode;
                        this.nextNode = this.nextNode.parent();
                        if (currentNode === this.list) {
                            this.nextNodeAvailable = false;
                            break;
                        }
                        var nextSibling = currentNode.iterator().checkAndGetRightSiblingNode();
                        if (nextSibling !== null) {
                            this.nextNode = nextSibling;
                            break;
                        }
                    } while (true);
                }
            } else {
                this.nextNode = this.nextNode.iterator().checkAndGetLeftMostNode();
            }
        }
    }, {
        key: "remove",
        value: function remove() {
            var errorMessage = "Failed to remove the tree node. ";
            if (!this.isIterationStarted()) {
                throw new ReferenceError("IllegalStateException " + errorMessage + "The iteration has not been performed yet");
            }
            if (this.currentNode.isRoot()) {
                var message = errorMessage + ("The tree node " + this.currentNode + "s is root");
                throw new ReferenceError("TreeNodeException " + message);
            }
            if (this.currentNode === this.list) {
                throw new ReferenceError("TreeNodeException " + errorMessage + "The starting node can't be removed");
            }
            var currentNode = this.currentNode;
            while (true) {
                if (currentNode.isRoot()) {
                    this.nextNodeAvailable = false;
                    break;
                }
                var rightSiblingNode = currentNode.iterator().checkAndGetRightSiblingNode();
                if (rightSiblingNode !== null) {
                    this.nextNode = rightSiblingNode;
                    break;
                }
                currentNode = currentNode.parent;
            }
            var parent = this.currentNode.parent();
            parent.dropSubtree(this.currentNode);
            this.currentNode = parent;
            this.expectedSize = this.list.size();
        }
    }]);
    return TreeNodeIterator;
}(_iterator15.Iterator);

var ID_GENERATOR = 0;

var TreeNode = exports.TreeNode = function () {
    function TreeNode() {
        var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref3$data = _ref3.data,
            data = _ref3$data === undefined ? null : _ref3$data,
            _ref3$add = _ref3.add,
            add = _ref3$add === undefined ? null : _ref3$add,
            _ref3$clear = _ref3.clear,
            clear = _ref3$clear === undefined ? null : _ref3$clear,
            _ref3$dropSubtree = _ref3.dropSubtree,
            dropSubtree = _ref3$dropSubtree === undefined ? null : _ref3$dropSubtree,
            _ref3$iterator = _ref3.iterator,
            iterator = _ref3$iterator === undefined ? null : _ref3$iterator,
            _ref3$subtrees = _ref3.subtrees,
            subtrees = _ref3$subtrees === undefined ? null : _ref3$subtrees;

        (0, _classCallCheck3.default)(this, TreeNode);

        this.parent = null;
        this.data = data;
        this.id = ID_GENERATOR;
        ID_GENERATOR++;
        if (add !== null) {
            this.add = add;
        }
        if (clear !== null) {
            this.clear = clear;
        }
        if (dropSubtree !== null) {
            this.dropSubtree = dropSubtree;
        }
        if (iterator !== null) {
            this.iterator = iterator;
        }
        if (subtrees !== null) {
            this.subtrees = subtrees;
        }
        this.myParent = null;
    }

    (0, _createClass3.default)(TreeNode, [{
        key: "add",
        value: function add(subtree) {}
    }, {
        key: "clear",
        value: function clear() {}
    }, {
        key: "commonAncestor",
        value: function commonAncestor() {
            var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var errorMessage = "Unable to find the common ancestor between tree nodes. ";
            if (node === null) {
                var message = errorMessage + "The specified tree node is null";
                throw new ReferenceError("TreeNodeException " + message);
            }
            if (!this.root().contains(node)) {
                var _message = errorMessage + ("The specified tree node " + node + "s was not found in the current tree node " + this + "s");
                throw new ReferenceError("TreeNodeException " + _message);
            }
            if (this.isRoot() || node.isRoot()) {
                var _message2 = errorMessage + ("The tree node " + (this.isRoot() ? this : node) + "s is root");
                throw new ReferenceError("TreeNodeException " + _message2);
            }
            if (this === node || node.isSiblingOf(this)) {
                return this.parent();
            }
            var thisNodeLevel = this.level();
            var thatNodeLevel = node.level();
            return thisNodeLevel > thatNodeLevel ? node.parent() : this.parent();
        }
    }, {
        key: "contains",
        value: function contains() {
            var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (node === null || this.isLeaf() || node.isRoot()) {
                return false;
            }
            var trees = this.subtrees();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = trees[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var subtree = _step.value;

                    if (subtree === node || subtree.contains(node)) {
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
        key: "containsAll",
        value: function containsAll() {
            var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (this.isLeaf() || TreeNode.areAllNulls(nodes)) {
                return false;
            }
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var node = _step2.value;

                    if (!this.contains(node)) {
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
    }, {
        key: "dropSubtree",
        value: function dropSubtree(subtree) {
            return false;
        }
    }, {
        key: "equals",
        value: function equals(obj) {
            if (this === obj) {
                return true;
            }
            if (obj === null || !(obj instanceof TreeNode)) {
                return false;
            }
            return this.id === obj.id;
        }
    }, {
        key: "find",
        value: function find() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (this.isLeaf()) {
                var o = this.data();
                return (o === null ? o === null : o === data) ? this : null;
            }
            var searchedNode = [];
            this.traversePreOrder(new TraversalAction({

                isCompleted: function isCompleted() {
                    return searchedNode[0] !== null;
                },

                perform: function perform(node) {
                    var d = node.getData();
                    if (d === null ? data === null : data === d) {
                        searchedNode[0] = node;
                    }
                }

            }));
            return searchedNode[0];
        }
    }, {
        key: "findAll",
        value: function findAll() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (this.isLeaf()) {
                var o = this.data();
                return o === null ? data === null : data === o ? [this] : [];
            }
            var searchedNodes = [];
            this.traversePreOrder(new TraversalAction({

                isCompleted: function isCompleted() {
                    return false;
                },

                perform: function perform(node) {
                    var d = node.getData();
                    if (d === null ? data === null : data === d) {
                        searchedNodes.push(node);
                    }
                }

            }));
            return searchedNodes;
        }
    }, {
        key: "data",
        value: function data() {
            return this.data;
        }
    }, {
        key: "hasSubtree",
        value: function hasSubtree() {
            var subtree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (subtree === null || this.isLeaf() || subtree.isRoot()) {
                return false;
            }
            var trees = this.subtrees();
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = trees[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var mSubtree = _step3.value;

                    if (mSubtree === subtree) {
                        return true;
                    }
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

            return false;
        }
    }, {
        key: "hashCode",
        value: function hashCode() {
            return this.id ^ this.id >>> 32;
        }
    }, {
        key: "height",
        value: function height() {
            if (this.isLeaf()) {
                return 0;
            }
            var h = 0;
            var trees = this.subtrees();
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = trees[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var subtree = _step4.value;

                    h = Math.max(h, subtree.height());
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

            return h + 1;
        }
    }, {
        key: "isAncestorOf",
        value: function isAncestorOf() {
            var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (node === null || this.isLeaf() || node.isRoot() || this === node) {
                return false;
            }
            var mNode = node;
            do {
                mNode = mNode.parent();
                if (this === mNode) {
                    return true;
                }
            } while (!mNode.isRoot());
            return false;
        }
    }, {
        key: "isDescendantOf",
        value: function isDescendantOf() {
            var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (node === null || this.isRoot() || node.isLeaf() || this === node) {
                return false;
            }
            var mNode = this;
            do {
                mNode = mNode.parent();
                if (node === mNode) {
                    return true;
                }
            } while (!mNode.isRoot());
            return false;
        }
    }, {
        key: "isLeaf",
        value: function isLeaf() {
            var trees = this.subtrees();
            return trees === 0;
        }
    }, {
        key: "isRoot",
        value: function isRoot() {
            return this.parent === null;
        }
    }, {
        key: "isSiblingOf",
        value: function isSiblingOf() {
            var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            return node !== null && !this.isRoot() && !node.isRoot() && this.parent() === node.parent();
        }
    }, {
        key: "iterator",
        value: function iterator() {
            return null;
        }
    }, {
        key: "level",
        value: function (_level) {
            function level() {
                return _level.apply(this, arguments);
            }

            level.toString = function () {
                return _level.toString();
            };

            return level;
        }(function () {
            if (this.isRoot()) {
                return 0;
            }
            var l = 0;
            var node = this;
            do {
                node = node.parent();
                l++;
            } while (!node.isRoot());
            return level;
        })
    }, {
        key: "parent",
        value: function parent() {
            return this.myParent;
        }
    }, {
        key: "path",
        value: function path() {
            var descendant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (descendant === null || this.isLeaf() || this === descendant) {
                return [this];
            }
            var errorMessage = "Unable to build the path between tree nodes. ";
            if (descendant.isRoot()) {
                var _message3 = errorMessage + ("Current node " + descendant + "s is root");
                throw new ReferenceError("TreeNodeException " + _message3);
            }
            var path = [];
            var node = descendant;
            path.push(node);
            do {
                node = node.parent();
                path.unshift(node);
                if (this === node) {
                    return path;
                }
            } while (!node.isRoot());
            var message = errorMessage + ("The specified tree node " + descendant + "s is not the descendant of tree node " + this + "s");
            throw new ReferenceError("TreeNodeException " + message);
        }
    }, {
        key: "postOrdered",
        value: function postOrdered() {
            if (this.isLeaf()) {
                return [this];
            }
            var mPostOrdered = [];
            var action = TreeNode.populateAction(mPostOrdered);
            this.traversePostOrder(action);
            return mPostOrdered;
        }
    }, {
        key: "preOrdered",
        value: function preOrdered() {
            if (this.isLeaf()) {
                return [this];
            }
            var mPreOrdered = [];
            var action = TreeNode.populateAction(mPreOrdered);
            this.traversePreOrder(action);
            return mPreOrdered;
        }
    }, {
        key: "remove",
        value: function remove() {
            var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (node === null || this.isLeaf() || node.isRoot()) {
                return false;
            }
            if (this.dropSubtree(node)) {
                return true;
            }
            var trees = this.subtrees();
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = trees[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var subtree = _step5.value;

                    if (subtree.remove(node)) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return false;
        }
    }, {
        key: "removeAll",
        value: function removeAll() {
            var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (this.isLeaf() || TreeNode.areAllNulls(nodes)) {
                return false;
            }
            var result = false;
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = nodes[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var node = _step6.value;

                    var currentResult = this.remove(node);
                    if (!result && currentResult) {
                        result = true;
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return result;
        }
    }, {
        key: "root",
        value: function root() {
            if (this.isRoot()) {
                return this;
            }
            var node = this;
            do {
                node = node.parent();
            } while (!node.isRoot());
            return node;
        }
    }, {
        key: "setData",
        value: function setData(data) {
            this.data = data;
        }
    }, {
        key: "size",
        value: function size() {
            if (this.isLeaf()) {
                return 1;
            }
            var count = [0];
            var action = new TraversalAction({

                perform: function perform(node) {
                    count[0]++;
                },

                isCompleted: function isCompleted() {
                    return false;
                }

            });
            this.traversePreOrder(action);
            return count[0];
        }
    }, {
        key: "subtrees",
        value: function subtrees() {
            return null;
        }
    }, {
        key: "toString",
        value: function toString() {
            var builder = "\n";
            var topNodeLevel = this.level();
            var action = new TraversalAction({

                perform: function perform(node) {
                    var nodeLevel = node.level() - topNodeLevel;
                    for (var i = 0; i < nodeLevel; i++) {
                        builder += "|  ";
                    }
                    builder += "+- " + node.data() + "\n";
                },

                isCompleted: function isCompleted() {
                    return false;
                }

            });
            this.traversePreOrder(action);
            return builder;
        }
    }, {
        key: "traversePostOrder",
        value: function traversePostOrder(action) {
            if (!action.isCompleted()) {
                if (!this.isLeaf()) {
                    var trees = this.subtrees();
                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = trees[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                            var subtree = _step7.value;

                            subtree.traversePostOrder(action);
                        }
                    } catch (err) {
                        _didIteratorError7 = true;
                        _iteratorError7 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                _iterator7.return();
                            }
                        } finally {
                            if (_didIteratorError7) {
                                throw _iteratorError7;
                            }
                        }
                    }
                }
                action.perform(this);
            }
        }
    }, {
        key: "traversePreOrder",
        value: function traversePreOrder(action) {
            if (!action.isCompleted()) {
                action.perform(this);
                if (!this.isLeaf()) {
                    var trees = this.subtrees();
                    var _iteratorNormalCompletion8 = true;
                    var _didIteratorError8 = false;
                    var _iteratorError8 = undefined;

                    try {
                        for (var _iterator8 = trees[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            var subtree = _step8.value;

                            subtree.traversePreOrder(action);
                        }
                    } catch (err) {
                        _didIteratorError8 = true;
                        _iteratorError8 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                _iterator8.return();
                            }
                        } finally {
                            if (_didIteratorError8) {
                                throw _iteratorError8;
                            }
                        }
                    }
                }
            }
        }
    }], [{
        key: "isAnyNotNull",
        value: function isAnyNotNull() {
            var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (collection === null || collection.length === 0) {
                return false;
            }
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = collection[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var item = _step9.value;

                    if (item !== null || item !== undefined) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                        _iterator9.return();
                    }
                } finally {
                    if (_didIteratorError9) {
                        throw _iteratorError9;
                    }
                }
            }

            return false;
        }
    }, {
        key: "linkParent",
        value: function linkParent(node, parent) {
            if (node !== null) {
                node.parent = parent;
            }
        }
    }, {
        key: "populateAction",
        value: function populateAction(collection) {
            return new TraversalAction({

                perform: function perform(node) {
                    collection.push(node);
                },

                isCompleted: function isCompleted() {
                    return false;
                }

            });
        }
    }, {
        key: "unlinkParent",
        value: function unlinkParent(node) {
            node.parent = null;
        }
    }]);
    return TreeNode;
}();

var MultiTreeNode = exports.MultiTreeNode = function (_TreeNode) {
    (0, _inherits3.default)(MultiTreeNode, _TreeNode);

    function MultiTreeNode() {
        var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref4$data = _ref4.data,
            data = _ref4$data === undefined ? null : _ref4$data;

        (0, _classCallCheck3.default)(this, MultiTreeNode);
        return (0, _possibleConstructorReturn3.default)(this, (MultiTreeNode.__proto__ || Object.getPrototypeOf(MultiTreeNode)).call(this, { data: data }));
    }

    (0, _createClass3.default)(MultiTreeNode, [{
        key: "addSubtrees",
        value: function addSubtrees(subtrees) {
            if (TreeNode.areAllNulls(subtrees)) {
                return false;
            }
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = subtrees[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var subtree = _step10.value;

                    TreeNode.linkParent(subtree, this);
                    if (!this.add(subtree)) {
                        return false;
                    }
                }
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                        _iterator10.return();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }

            return true;
        }
    }, {
        key: "dropSubtrees",
        value: function dropSubtrees(subtrees) {
            if (this.isLeaf() || TreeNode.areAllNulls(subtrees)) {
                return false;
            }
            var result = false;
            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
                for (var _iterator11 = subtrees[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                    var subtree = _step11.value;

                    var currentResult = this.dropSubtree(subtree);
                    if (!result && currentResult) {
                        result = true;
                    }
                }
            } catch (err) {
                _didIteratorError11 = true;
                _iteratorError11 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion11 && _iterator11.return) {
                        _iterator11.return();
                    }
                } finally {
                    if (_didIteratorError11) {
                        throw _iteratorError11;
                    }
                }
            }

            return result;
        }
    }, {
        key: "hasSubtrees",
        value: function hasSubtrees(subtrees) {
            if (this.isLeaf() || TreeNode.areAllNulls(subtrees)) {
                return false;
            }
            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = subtrees[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var subtree = _step12.value;

                    if (!this.hasSubtree(subtree)) {
                        return false;
                    }
                }
            } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion12 && _iterator12.return) {
                        _iterator12.return();
                    }
                } finally {
                    if (_didIteratorError12) {
                        throw _iteratorError12;
                    }
                }
            }

            return true;
        }
    }, {
        key: "siblings",
        value: function siblings() {
            if (this.isRoot()) {
                var message = "\"Unable to find the siblings. The tree node " + this.root() + "s is root";
                throw new ReferenceError("TreeNodeException " + message);
            }
            var parentSubtrees = this.parent.subtrees();
            var parentSubtreesSize = parentSubtrees.length;
            if (parentSubtreesSize === 1) {
                return [];
            }
            var siblings = [];
            var _iteratorNormalCompletion13 = true;
            var _didIteratorError13 = false;
            var _iteratorError13 = undefined;

            try {
                for (var _iterator13 = parentSubtrees[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                    var parentSubtree = _step13.value;

                    if (parentSubtree !== this) {
                        siblings.push(parentSubtree);
                    }
                }
            } catch (err) {
                _didIteratorError13 = true;
                _iteratorError13 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion13 && _iterator13.return) {
                        _iterator13.return();
                    }
                } finally {
                    if (_didIteratorError13) {
                        throw _iteratorError13;
                    }
                }
            }

            return siblings;
        }
    }]);
    return MultiTreeNode;
}(TreeNode);

var DEFAULT_BRANCHING_FACTOR = 10;

var MAX_ARRAY_SIZE = Number.MAX_VALUE - 8;

var ArrayMultiTreeNode = exports.ArrayMultiTreeNode = function (_MultiTreeNode) {
    (0, _inherits3.default)(ArrayMultiTreeNode, _MultiTreeNode);

    function ArrayMultiTreeNode() {
        var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref5$data = _ref5.data,
            data = _ref5$data === undefined ? null : _ref5$data,
            _ref5$branchingFactor = _ref5.branchingFactor,
            branchingFactor = _ref5$branchingFactor === undefined ? DEFAULT_BRANCHING_FACTOR : _ref5$branchingFactor;

        (0, _classCallCheck3.default)(this, ArrayMultiTreeNode);

        var _this3 = (0, _possibleConstructorReturn3.default)(this, (ArrayMultiTreeNode.__proto__ || Object.getPrototypeOf(ArrayMultiTreeNode)).call(this, { data: data }));

        if (branchingFactor < 0) {
            throw new RangeError("IllegalArgumentException Branching factor can not be negative");
        }
        _this3.subtreesSize = 0;
        _this3.branchingFactor = 0;
        _this3.branchingFactor = branchingFactor;
        _this3.mySubtrees = new Array(branchingFactor);
        return _this3;
    }

    (0, _createClass3.default)(ArrayMultiTreeNode, [{
        key: "add",
        value: function add(subtree) {
            if (subtree === null) {
                return false;
            }
            TreeNode.linkParent(subtree, this);
            this.ensureSubtreesCapacity(this.subtreesSize + 1);
            this.mySubtrees[this.subtreesSize++] = subtree;
            return true;
        }
    }, {
        key: "addSubtrees",
        value: function addSubtrees(subtrees) {
            if (TreeNode.areAllNulls(subtrees)) {
                return false;
            }
            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
                for (var _iterator14 = subtrees[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                    var subtree = _step14.value;

                    TreeNode.linkParent(subtree, this);
                }
            } catch (err) {
                _didIteratorError14 = true;
                _iteratorError14 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion14 && _iterator14.return) {
                        _iterator14.return();
                    }
                } finally {
                    if (_didIteratorError14) {
                        throw _iteratorError14;
                    }
                }
            }

            var subtreesArray = subtrees;
            var subtreesArrayLength = subtreesArray.length;
            this.ensureSubtreesCapacity(this.subtreesSize + subtreesArrayLength);
            util.arraycopy(subtreesArray, 0, this.mySubtrees, this.subtreesSize, subtreesArrayLength);
            this.subtreesSize += subtreesArrayLength;
            return subtreesArrayLength != 0;
        }
    }, {
        key: "clear",
        value: function clear() {
            if (!this.isLeaf()) {
                for (var i = 0; i < this.subtreesSize; i++) {
                    var subtree = this.mySubtrees[i];
                    TreeNode.unlinkParent(subtree);
                }
                this.mySubtrees = new Array(this.branchingFactor);
                this.subtreesSize = 0;
            }
        }
    }, {
        key: "contains",
        value: function contains() {
            var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (node === null || this.isLeaf() || node.isRoot()) {
                return false;
            }
            for (var i = 0; i < this.subtreesSize; i++) {
                var subtree = this.mySubtrees[i];
                if (subtree.equals(node)) {
                    return true;
                }
                if (subtree.contains(node)) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: "dropSubtree",
        value: function dropSubtree(subtree) {
            if (subtree === null || this.isLeaf() || subtree.isRoot()) {
                return false;
            }
            var mSubtreeIndex = this.indexOf(subtree);
            if (mSubtreeIndex < 0) {
                return false;
            }
            var mNumShift = this.subtreesSize - mSubtreeIndex - 1;
            if (mNumShift > 0) {
                util.arraycopy(this.mySubtrees, mSubtreeIndex + 1, this.mySubtrees, mSubtreeIndex, mNumShift);
            }
            this.mySubtrees[--this.subtreesSize] = null;
            TreeNode.unlinkParent(subtree);
            return true;
        }
    }, {
        key: "ensureSubtreesCapacity",
        value: function ensureSubtreesCapacity(minSubtreesCapacity) {
            if (minSubtreesCapacity > this.mySubtrees.length) {
                this.increaseSubtreesCapacity(minSubtreesCapacity);
            }
        }
    }, {
        key: "hasSubtree",
        value: function hasSubtree() {
            var subtree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (subtree === null || this.isLeaf() || subtree.isRoot()) {
                return false;
            }
            for (var i = 0; i < this.subtreesSize; i++) {
                var mSubtree = this.mySubtrees[i];
                if (subtree.equals(mSubtree)) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: "height",
        value: function height() {
            if (this.isLeaf()) {
                return 0;
            }
            var h = 0;
            for (var i = 0; i < this.subtreesSize; i++) {
                var mSubtree = this.mySubtrees[i];
                h = Math.max(h, mSubtree.height());
            }
            return h + 1;
        }
    }, {
        key: "increaseSubtreesCapacity",
        value: function increaseSubtreesCapacity(minSubtreesCapacity) {
            var oldSubtreesCapacity = this.mySubtrees.length;
            var newSubtreesCapacity = oldSubtreesCapacity + (oldSubtreesCapacity >> 1);
            if (newSubtreesCapacity < minSubtreesCapacity) {
                newSubtreesCapacity = minSubtreesCapacity;
            }
            if (newSubtreesCapacity > MAX_ARRAY_SIZE) {
                if (minSubtreesCapacity < 0) {
                    throw new RangeError("OutOfMemoryError");
                }
                newSubtreesCapacity = minSubtreesCapacity > MAX_ARRAY_SIZE ? Number.MAX_VALUE : MAX_ARRAY_SIZE;
            }
            this.mySubtrees = util.copyOf(this.mySubtrees, newSubtreesCapacity);
        }
    }, {
        key: "indexOf",
        value: function indexOf(subtree) {
            for (var i = 0; i < this.subtreesSize; i++) {
                var mSubtree = this.mySubtrees[i];
                if (mSubtree.equals(subtree)) {
                    return i;
                }
            }
            return -1;
        }
    }, {
        key: "isLeaf",
        value: function isLeaf() {
            return this.subtreesSize === 0;
        }
    }, {
        key: "iterator",
        value: function iterator() {
            var _this4 = this;

            return new TreeNodeIterator({

                list: this,

                leftMostNode: function leftMostNode() {
                    return _this4.mySubtrees[0];
                },

                rightSiblingNode: function rightSiblingNode() {
                    var mParent = _this4.parent;
                    var rightSiblingNodeIndex = mParent.indexOf(_this4) + 1;
                    return rightSiblingNodeIndex <= mParent.subtreesSize ? mParent.mySubtrees[rightSiblingNodeIndex] : null;
                }

            });
        }
    }, {
        key: "remove",
        value: function remove() {
            var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (node === null || this.isLeaf() || node.isRoot()) {
                return false;
            }
            if (this.dropSubtree(node)) {
                return true;
            }
            for (var i = 0; i < this.subtreesSize; i++) {
                var subtree = this.mySubtrees[i];
                if (subtree.remove(node)) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: "siblings",
        value: function siblings() {
            if (this.isRoot()) {
                var message = "Unable to find the siblings. The tree node " + this.root() + "s is root";
                throw new RangeError("TreeNodeException " + message);
            }
            var mParent = this.parent;
            var parentSubtreesSize = mParent.subtreesSize;
            if (parentSubtreesSize == 1) {
                return [];
            }
            var parentSubtreeObjects = mParent.subtrees;
            var siblings = new Array(parentSubtreesSize - 1);
            for (var i = 0; i < parentSubtreesSize; i++) {
                var parentSubtree = parentSubtreeObjects[i];
                if (!parentSubtree.equals(this)) {
                    siblings.push(parentSubtree);
                }
            }
            return siblings;
        }
    }, {
        key: "subtrees",
        value: function subtrees() {
            if (this.isLeaf()) {
                return [];
            }
            var subtrees = [];
            for (var i = 0; i < this.subtreesSize; i++) {
                var subtree = this.mySubtrees[i];
                subtrees.push(subtree);
            }
            return subtrees;
        }
    }, {
        key: "traversePostOrder",
        value: function traversePostOrder(action) {
            if (!action.isCompleted()) {
                if (!this.isLeaf()) {
                    for (var i = 0; i < this.subtreesSize; i++) {
                        var subtree = this.mySubtrees[i];
                        subtree.traversePostOrder(action);
                    }
                }
                action.perform(this);
            }
        }
    }, {
        key: "traversePreOrder",
        value: function traversePreOrder(action) {
            if (!action.isCompleted()) {
                action.perform(this);
                if (!this.isLeaf()) {
                    for (var i = 0; i < this.subtreesSize; i++) {
                        var subtree = this.mySubtrees[i];
                        subtree.traversePreOrder(action);
                    }
                }
            }
        }
    }]);
    return ArrayMultiTreeNode;
}(MultiTreeNode);

var LinkedMultiTreeNode = exports.LinkedMultiTreeNode = function (_MultiTreeNode2) {
    (0, _inherits3.default)(LinkedMultiTreeNode, _MultiTreeNode2);

    function LinkedMultiTreeNode() {
        var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref6$data = _ref6.data,
            data = _ref6$data === undefined ? null : _ref6$data,
            _ref6$branchingFactor = _ref6.branchingFactor,
            branchingFactor = _ref6$branchingFactor === undefined ? DEFAULT_BRANCHING_FACTOR : _ref6$branchingFactor;

        (0, _classCallCheck3.default)(this, LinkedMultiTreeNode);

        var _this5 = (0, _possibleConstructorReturn3.default)(this, (LinkedMultiTreeNode.__proto__ || Object.getPrototypeOf(LinkedMultiTreeNode)).call(this, { data: data, branchingFactor: branchingFactor }));

        _this5.leftMostNode = null;
        _this5.lastSubtreeNode = null;
        _this5.rightSiblingNode = null;
        return _this5;
    }

    (0, _createClass3.default)(LinkedMultiTreeNode, [{
        key: "add",
        value: function add() {
            var subtree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (subtree === null) {
                return false;
            }
            TreeNode.linkParent(subtree, this);
            if (this.isLeaf()) {
                this.leftMostNode = subtree;
                this.lastSubtreeNode = this.leftMostNode;
            } else {
                this.lastSubtreeNode.rightSiblingNode = subtree;
                this.lastSubtreeNode = this.lastSubtreeNode.rightSiblingNode;
            }
            return true;
        }
    }, {
        key: "clear",
        value: function clear() {
            if (!this.isLeaf()) {
                var nextNode = this.leftMostNode;
                while (nextNode !== null) {
                    TreeNode.unlinkParent(nextNode);
                    var nextNodeRightSiblingNode = nextNode.rightSiblingNode;
                    nextNode.rightSiblingNode = null;
                    nextNode.lastSubtreeNode = null;
                    nextNode = nextNodeRightSiblingNode;
                }
                this.leftMostNode = null;
            }
        }
    }, {
        key: "contains",
        value: function contains() {
            var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (node === null || this.isLeaf() || node.isRoot()) {
                return false;
            }
            var nextSubtree = this.leftMostNode;
            while (nextSubtree !== null) {
                if (nextSubtree.equals(node)) {
                    return true;
                }
                if (nextSubtree.contains(node)) {
                    return true;
                }
                nextSubtree = nextSubtree.rightSiblingNode;
            }
            return false;
        }
    }, {
        key: "dropSubtree",
        value: function dropSubtree(subtree) {
            if (subtree === null || this.isLeaf() || subtree.isRoot()) {
                return false;
            }
            if (this.leftMostNode.equals(subtree)) {
                this.leftMostNode = this.leftMostNode.rightSiblingNode;
                TreeNode.unlinkParent(subtree);
                subtree.rightSiblingNode = null;
                return true;
            } else {
                var nextSubtree = this.leftMostNode;
                while (nextSubtree.rightSiblingNode !== null) {
                    if (nextSubtree.rightSiblingNode.equals(subtree)) {
                        TreeNode.unlinkParent(subtree);
                        nextSubtree.rightSiblingNode = nextSubtree.rightSiblingNode.rightSiblingNode;
                        subtree.rightSiblingNode = null;
                        return true;
                    } else {
                        nextSubtree = nextSubtree.rightSiblingNode;
                    }
                }
            }
            return false;
        }
    }, {
        key: "hasSubtree",
        value: function hasSubtree() {
            var subtree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (subtree === null || this.isLeaf() || subtree.isRoot()) {
                return false;
            }
            var nextSubtree = this.leftMostNode;
            while (nextSubtree !== null) {
                if (nextSubtree.equals(subtree)) {
                    return true;
                } else {
                    nextSubtree = nextSubtree.rightSiblingNode;
                }
            }
            return false;
        }
    }, {
        key: "height",
        value: function height() {
            if (this.isLeaf()) {
                return 0;
            }
            var h = 0;
            var nextNode = this.leftMostNode;
            while (nextNode !== null) {
                h = Math.max(h, nextNode.height());
                nextNode = nextNode.rightSiblingNode;
            }
            return h + 1;
        }
    }, {
        key: "isLeaf",
        value: function isLeaf() {
            return this.leftMostNode === null;
        }
    }, {
        key: "iterator",
        value: function iterator() {
            var _this6 = this;

            return new TreeNodeIterator({
                list: this,

                leftMostNode: function leftMostNode() {
                    return _this6.leftMostNode;
                },

                rightSiblingNode: function rightSiblingNode() {
                    return _this6.rightSiblingNode;
                }

            });
        }
    }, {
        key: "remove",
        value: function remove() {
            var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (node === null || this.isLeaf() || node.isRoot()) {
                return false;
            }
            if (this.dropSubtree(node)) {
                return true;
            }
            var nextSubtree = this.leftMostNode;
            while (nextSubtree !== null) {
                if (nextSubtree.remove(node)) {
                    return true;
                }
                nextSubtree = nextSubtree.rightSiblingNode;
            }
            return false;
        }
    }, {
        key: "siblings",
        value: function siblings() {
            if (this.isRoot()) {
                var message = "Unable to find the siblings. The tree node " + this.root() + "s is root";
                throw new ReferenceError("TreeNodeException " + message);
            }
            var firstNode = this.parent().leftMostNode;
            if (firstNode.rightSiblingNode === null) {
                return [];
            }
            var s = [];
            var nextNode = firstNode;
            while (nextNode !== null) {
                if (!nextNode.equals(this)) {
                    s.push(nextNode);
                }
                nextNode = nextNode.rightSiblingNode;
            }
            return s;
        }
    }, {
        key: "subtrees",
        value: function subtrees() {
            if (this.isLeaf()) {
                return [];
            }
            var subtrees = [];
            subtrees.push(this.leftMostNode);
            var nextSubtree = this.leftMostNode.rightSiblingNode;
            while (nextSubtree !== null) {
                subtrees.push(nextSubtree);
                nextSubtree = nextSubtree.rightSiblingNode;
            }
            return subtrees;
        }
    }, {
        key: "traversePostOrder",
        value: function traversePostOrder(action) {
            if (!action.isCompleted()) {
                if (!this.isLeaf()) {
                    var nextNode = this.leftMostNode;
                    while (nextNode !== null) {
                        nextNode.traversePostOrder(action);
                        nextNode = nextNode.rightSiblingNode;
                    }
                }
                action.perform(this);
            }
        }
    }, {
        key: "traversePreOrder",
        value: function traversePreOrder(action) {
            if (!action.isCompleted()) {
                action.perform(this);
                if (!this.isLeaf()) {
                    var nextNode = this.leftMostNode;
                    while (nextNode !== null) {
                        nextNode.traversePreOrder(action);
                        nextNode = nextNode.rightSiblingNode;
                    }
                }
            }
        }
    }]);
    return LinkedMultiTreeNode;
}(MultiTreeNode);