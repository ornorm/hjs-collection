/** @babel */
import * as util from "./util";
import {Iterator} from "./iterator";

export class TraversalAction {

    constructor({isCompleted = null, perform = null} = {}) {
        if (isCompleted !== null) {
            this.isCompleted = isCompleted;
        }
        if (perform !== null) {
            this.perform = perform;
        }
    }

    isCompleted() {
        return null;
    }

    perform(node) {
    }
}

export class TreeNodeIterator extends Iterator {

    constructor({ list, leftMostNode = null, rightSiblingNode = null }) {
        super(list);
        this.currentNode = null;
        this.nextNode = list;
        this.nextNodeAvailable = true;
        this.expectedSize = list.size();
        if (leftMostNode !== null) {
            this.leftMostNode = leftMostNode;
        }
        if (rightSiblingNode !== null) {
            this.rightSiblingNode = rightSiblingNode;
        }
    }

    checkAndGetLeftMostNode() {
        if (this.list.isLeaf()) {
            throw new ReferenceError("TreeNodeException Leftmost node can't be obtained. Current tree node is a leaf");
        }
        return this.leftMostNode();
    }

    checkAndGetRightSiblingNode() {
        if (this.list.isLeaf()) {
            throw new ReferenceError("Right sibling node can't be obtained. Current tree node is root");
        }
        return this.rightSiblingNode();
    }

    hasNext() {
        return this.nextNodeAvailable;
    }

    isIterationStarted() {
        return this.currentNode !== null;
    }

    next() {
        if (!this.hasNext()) {
            throw new RangeError("NoSuchElementException");
        }
        this.currentNode = this.nextNode;
        if (this.nextNode.isLeaf()) {
            if (this.nextNode.isRoot()) {
                this.nextNodeAvailable = false;
            } else {
                do {
                    let currentNode = this.nextNode;
                    this.nextNode = this.nextNode.parent();
                    if (currentNode === this.list) {
                        this.nextNodeAvailable = false;
                        break;
                    }
                    let nextSibling = currentNode.iterator().checkAndGetRightSiblingNode();
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

    remove() {
        let errorMessage = "Failed to remove the tree node. ";
        if (!this.isIterationStarted()) {
            throw new ReferenceError("IllegalStateException " +
                errorMessage + "The iteration has not been performed yet");
        }
        if (this.currentNode.isRoot()) {
            let message = errorMessage + `The tree node ${this.currentNode}s is root`;
            throw new ReferenceError("TreeNodeException " + message);
        }
        if (this.currentNode === this.list) {
            throw new ReferenceError("TreeNodeException " + errorMessage + "The starting node can't be removed");
        }
        let currentNode = this.currentNode;
        while (true) {
            if (currentNode.isRoot()) {
                this.nextNodeAvailable = false;
                break;
            }
            let rightSiblingNode = currentNode.iterator().checkAndGetRightSiblingNode();
            if (rightSiblingNode !== null) {
                this.nextNode = rightSiblingNode;
                break;
            }
            currentNode = currentNode.parent;
        }
        let parent = this.currentNode.parent();
        parent.dropSubtree(this.currentNode);
        this.currentNode = parent;
        this.expectedSize = this.list.size();
    }
}

let ID_GENERATOR = 0;

export class TreeNode {

    constructor({data = null, add = null, clear = null, dropSubtree = null, iterator = null, subtrees = null} = {}) {
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

    add(subtree) {

    }

    clear() {

    }

    commonAncestor(node=null) {
        let errorMessage = "Unable to find the common ancestor between tree nodes. ";
        if (node === null) {
            let message = errorMessage + "The specified tree node is null";
            throw new ReferenceError("TreeNodeException " + message);
        }
        if (!this.root().contains(node)) {
            let message = errorMessage +
                `The specified tree node ${node}s was not found in the current tree node ${this}s`;
            throw new ReferenceError("TreeNodeException " + message);
        }
        if (this.isRoot()
            || node.isRoot()) {
            let message = errorMessage + `The tree node ${this.isRoot() ? this : node}s is root`;
            throw new ReferenceError("TreeNodeException " + message);
        }
        if (this === node
            || node.isSiblingOf(this)) {
            return this.parent();
        }
        let thisNodeLevel = this.level();
        let thatNodeLevel = node.level();
        return thisNodeLevel > thatNodeLevel ? node.parent() : this.parent();
    }

    contains(node=null) {
        if (node === null
            || this.isLeaf()
            || node.isRoot()) {
            return false;
        }
        let trees = this.subtrees();
        for (const subtree of trees) {
            if (subtree === node
                || subtree.contains(node)) {
                return true;
            }
        }
        return false;
    }

    containsAll(nodes=null) {
        if (this.isLeaf()
            || TreeNode.areAllNulls(nodes)) {
            return false;
        }
        for (const node of nodes) {
            if (!this.contains(node)) {
                return false;
            }
        }
        return true;
    }

    dropSubtree(subtree) {
        return false;
    }

    equals(obj) {
        if (this === obj) {
            return true;
        }
        if (obj === null ||
            !(obj instanceof TreeNode)) {
            return false;
        }
        return this.id === obj.id;
    }

    find(data=null) {
        if (this.isLeaf()) {
            let o = this.data();
            return (o === null ?
                o === null : o === data) ? this : null;
        }
        const searchedNode = [];
        this.traversePreOrder(new TraversalAction({

            isCompleted: () => {
                return searchedNode[0] !== null;
            },

            perform: (node) => {
                let d = node.getData();
                if (d === null ?
                        data === null :
                        data === d) {
                    searchedNode[0] = node;
                }
            }

        }));
        return searchedNode[0];
    }

    findAll(data=null) {
        if (this.isLeaf()) {
            let o = this.data();
            return (o === null ?
                data === null : data === o ? [this] : []);
        }
        const searchedNodes = [];
        this.traversePreOrder(new TraversalAction({

            isCompleted: () => {
                return false;
            },

            perform: (node) => {
                let d = node.getData();
                if (d === null ?
                        data === null :
                        data === d) {
                    searchedNodes.push(node);
                }
            }

        }));
        return searchedNodes;
    }

    data() {
        return this.data;
    }

    hasSubtree(subtree=null) {
        if (subtree === null
            || this.isLeaf()
            || subtree.isRoot()) {
            return false;
        }
        let trees = this.subtrees();
        for (const mSubtree of trees) {
            if (mSubtree === subtree) {
                return true;
            }
        }
        return false;
    }

    hashCode() {
        return this.id ^ (this.id >>> 32);
    }

    height() {
        if (this.isLeaf()) {
            return 0;
        }
        let h = 0;
        let trees = this.subtrees();
        for (const subtree of trees) {
            h = Math.max(h, subtree.height());
        }
        return h + 1;
    }

    isAncestorOf(node=null) {
        if (node === null
            || this.isLeaf()
            || node.isRoot()
            || this === node) {
            return false;
        }
        let mNode = node;
        do {
            mNode = mNode.parent();
            if (this === mNode) {
                return true;
            }
        } while (!mNode.isRoot());
        return false;
    }

    static isAnyNotNull(collection=null) {
        if (collection === null || collection.length === 0) {
            return false;
        }
        for (const item of collection) {
            if (item !== null ||
                item !== undefined) {
                return true;
            }
        }
        return false;
    }

    isDescendantOf(node=null) {
        if (node === null
            || this.isRoot()
            || node.isLeaf()
            || this === node) {
            return false;
        }
        let mNode = this;
        do {
            mNode = mNode.parent();
            if (node === mNode) {
                return true;
            }
        } while (!mNode.isRoot());
        return false;
    }

    isLeaf() {
        let trees = this.subtrees();
        return trees === 0;
    }

    isRoot() {
        return this.parent === null;
    }

    isSiblingOf(node=null) {
        return node !== null
            && !this.isRoot()
            && !node.isRoot()
            && this.parent() === node.parent();
    }

    iterator() {
        return null;
    }

    level() {
        if (this.isRoot()) {
            return 0;
        }
        let l = 0;
        let node = this;
        do {
            node = node.parent();
            l++;
        } while (!node.isRoot());
        return level;
    }

    static linkParent(node, parent) {
        if (node !== null) {
            node.parent = parent;
        }
    }

    parent() {
        return this.myParent;
    }

    path(descendant=null) {
        if (descendant === null
            || this.isLeaf()
            || this === descendant) {
            return [this];
        }
        let errorMessage = "Unable to build the path between tree nodes. ";
        if (descendant.isRoot()) {
            let message = errorMessage + `Current node ${descendant}s is root`;
            throw new ReferenceError("TreeNodeException " + message);
        }
        let path = [];
        let node = descendant;
        path.push(node);
        do {
            node = node.parent();
            path.unshift(node);
            if (this === node) {
                return path;
            }
        } while (!node.isRoot());
        let message = errorMessage +
            `The specified tree node ${descendant}s is not the descendant of tree node ${this}s`;
        throw new ReferenceError("TreeNodeException " + message);
    }

    static populateAction(collection) {
        return new TraversalAction({

            perform: (node) => {
                collection.push(node);
            },

            isCompleted: () => {
                return false;
            }

        });
    }

    postOrdered() {
        if (this.isLeaf()) {
            return [this];
        }
        let mPostOrdered = [];
        let action = TreeNode.populateAction(mPostOrdered);
        this.traversePostOrder(action);
        return mPostOrdered;
    }

    preOrdered() {
        if (this.isLeaf()) {
            return [this];
        }
        let mPreOrdered = [];
        let action = TreeNode.populateAction(mPreOrdered);
        this.traversePreOrder(action);
        return mPreOrdered;
    }

    remove(node=null) {
        if (node === null
            || this.isLeaf()
            || node.isRoot()) {
            return false;
        }
        if (this.dropSubtree(node)) {
            return true;
        }
        let trees = this.subtrees();
        for (const subtree of trees) {
            if (subtree.remove(node)) {
                return true;
            }
        }
        return false;
    }

    removeAll(nodes=null) {
        if (this.isLeaf()
            || TreeNode.areAllNulls(nodes)) {
            return false;
        }
        let result = false;
        for (const node of nodes) {
            let currentResult = this.remove(node);
            if (!result && currentResult) {
                result = true;
            }
        }
        return result;
    }

    root() {
        if (this.isRoot()) {
            return this;
        }
        let node = this;
        do {
            node = node.parent();
        } while (!node.isRoot());
        return node;
    }

    setData(data) {
        this.data = data;
    }

    size() {
        if (this.isLeaf()) {
            return 1;
        }
        const count = [0];
        let action = new TraversalAction({

            perform: (node) => {
                count[0]++;
            },

            isCompleted: () => {
                return false;
            }

        });
        this.traversePreOrder(action);
        return count[0];
    }

    subtrees() {
        return null;
    }

    toString() {
        let builder = "\n";
        let topNodeLevel = this.level();
        let action = new TraversalAction({

            perform: (node) => {
                let nodeLevel = node.level() - topNodeLevel;
                for (let i = 0; i < nodeLevel; i++) {
                    builder += "|  ";
                }
                builder += "+- " + node.data() + "\n";
            },

            isCompleted: () => {
                return false;
            }

        });
        this.traversePreOrder(action);
        return builder;
    }

    traversePostOrder(action) {
        if (!action.isCompleted()) {
            if (!this.isLeaf()) {
                let trees = this.subtrees();
                for (const subtree of trees) {
                    subtree.traversePostOrder(action);
                }
            }
            action.perform(this);
        }
    }

    traversePreOrder(action) {
        if (!action.isCompleted()) {
            action.perform(this);
            if (!this.isLeaf()) {
                let trees = this.subtrees();
                for (const subtree of trees) {
                    subtree.traversePreOrder(action);
                }
            }
        }
    }

    static unlinkParent(node) {
        node.parent = null;
    }

}

export class MultiTreeNode extends TreeNode {

    constructor({data = null } = {}) {
        super({ data });
    }

    addSubtrees(subtrees) {
        if (TreeNode.areAllNulls(subtrees)) {
            return false;
        }
        for (const subtree of subtrees) {
            TreeNode.linkParent(subtree, this);
            if (!this.add(subtree)) {
                return false;
            }
        }
        return true;
    }

    dropSubtrees(subtrees) {
        if (this.isLeaf()
            || TreeNode.areAllNulls(subtrees)) {
            return false;
        }
        let result = false;
        for (const subtree of subtrees) {
            let currentResult = this.dropSubtree(subtree);
            if (!result && currentResult) {
                result = true;
            }
        }
        return result;
    }

    hasSubtrees(subtrees) {
        if (this.isLeaf()
            || TreeNode.areAllNulls(subtrees)) {
            return false;
        }
        for (const subtree of subtrees) {
            if (!this.hasSubtree(subtree)) {
                return false;
            }
        }
        return true;
    }

    siblings() {
        if (this.isRoot()) {
            let message = `"Unable to find the siblings. The tree node ${this.root()}s is root`;
            throw new ReferenceError("TreeNodeException " + message);
        }
        let parentSubtrees = this.parent.subtrees();
        let parentSubtreesSize = parentSubtrees.length;
        if (parentSubtreesSize === 1) {
            return [];
        }
        let siblings = [];
        for (const parentSubtree of parentSubtrees) {
            if (parentSubtree !== this) {
                siblings.push(parentSubtree);
            }
        }
        return siblings;
    }
}

const DEFAULT_BRANCHING_FACTOR = 10;

const MAX_ARRAY_SIZE = Number.MAX_VALUE - 8;

export class ArrayMultiTreeNode extends MultiTreeNode {

    constructor({ data = null, branchingFactor = DEFAULT_BRANCHING_FACTOR } = {}) {
        super({ data });
        if (branchingFactor < 0) {
            throw new RangeError("IllegalArgumentException Branching factor can not be negative");
        }
        this.subtreesSize = 0;
        this.branchingFactor = 0;
        this.branchingFactor = branchingFactor;
        this.mySubtrees = new Array(branchingFactor);
    }

    add(subtree) {
        if (subtree === null) {
            return false;
        }
        TreeNode.linkParent(subtree, this);
        this.ensureSubtreesCapacity(this.subtreesSize + 1);
        this.mySubtrees[this.subtreesSize++] = subtree;
        return true;
    }

    addSubtrees(subtrees) {
        if (TreeNode.areAllNulls(subtrees)) {
            return false;
        }
        for (const subtree of subtrees) {
            TreeNode.linkParent(subtree, this);
        }
        let subtreesArray = subtrees;
        let subtreesArrayLength = subtreesArray.length;
        this.ensureSubtreesCapacity(this.subtreesSize + subtreesArrayLength);
        util.arraycopy(subtreesArray, 0, this.mySubtrees, this.subtreesSize, subtreesArrayLength);
        this.subtreesSize += subtreesArrayLength;
        return subtreesArrayLength != 0;
    }

    clear() {
        if (!this.isLeaf()) {
            for (let i = 0; i < this.subtreesSize; i++) {
                let subtree = this.mySubtrees[i];
                TreeNode.unlinkParent(subtree);
            }
            this.mySubtrees = new Array(this.branchingFactor);
            this.subtreesSize = 0;
        }
    }

    contains(node=null) {
        if (node === null
            || this.isLeaf()
            || node.isRoot()) {
            return false;
        }
        for (let i = 0; i < this.subtreesSize; i++) {
            let subtree = this.mySubtrees[i];
            if (subtree.equals(node)) {
                return true;
            }
            if (subtree.contains(node)) {
                return true;
            }
        }
        return false;
    }

    dropSubtree(subtree) {
        if (subtree === null
            || this.isLeaf()
            || subtree.isRoot()) {
            return false;
        }
        let mSubtreeIndex = this.indexOf(subtree);
        if (mSubtreeIndex < 0) {
            return false;
        }
        let mNumShift = this.subtreesSize - mSubtreeIndex - 1;
        if (mNumShift > 0) {
            util.arraycopy(this.mySubtrees, mSubtreeIndex + 1, this.mySubtrees, mSubtreeIndex, mNumShift);
        }
        this.mySubtrees[--this.subtreesSize] = null;
        TreeNode.unlinkParent(subtree);
        return true;
    }

    ensureSubtreesCapacity(minSubtreesCapacity) {
        if (minSubtreesCapacity > this.mySubtrees.length) {
            this.increaseSubtreesCapacity(minSubtreesCapacity);
        }
    }

    hasSubtree(subtree=null) {
        if (subtree === null
            || this.isLeaf()
            || subtree.isRoot()) {
            return false;
        }
        for (let i = 0; i < this.subtreesSize; i++) {
            let mSubtree = this.mySubtrees[i];
            if (subtree.equals(mSubtree)) {
                return true;
            }
        }
        return false;
    }

    height() {
        if (this.isLeaf()) {
            return 0;
        }
        let h = 0;
        for (let i = 0; i < this.subtreesSize; i++) {
            let mSubtree = this.mySubtrees[i];
            h = Math.max(h, mSubtree.height());
        }
        return h + 1;
    }

    increaseSubtreesCapacity(minSubtreesCapacity) {
        let oldSubtreesCapacity = this.mySubtrees.length;
        let newSubtreesCapacity = oldSubtreesCapacity + (oldSubtreesCapacity >> 1);
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

    indexOf(subtree) {
        for (let i = 0; i < this.subtreesSize; i++) {
            let mSubtree = this.mySubtrees[i];
            if (mSubtree.equals(subtree)) {
                return i;
            }
        }
        return -1;
    }

    isLeaf() {
        return this.subtreesSize === 0;
    }

    iterator() {
        return new TreeNodeIterator({

            list: this,

            leftMostNode: () => {
                return this.mySubtrees[0];
            },

            rightSiblingNode: () => {
                let mParent = this.parent;
                let rightSiblingNodeIndex = mParent.indexOf(this) + 1;
                return rightSiblingNodeIndex <= mParent.subtreesSize ?
                    mParent.mySubtrees[rightSiblingNodeIndex] : null;
            }

        });
    }

    remove(node=null) {
        if (node === null
            || this.isLeaf()
            || node.isRoot()) {
            return false;
        }
        if (this.dropSubtree(node)) {
            return true;
        }
        for (let i = 0; i < this.subtreesSize; i++) {
            let subtree = this.mySubtrees[i];
            if (subtree.remove(node)) {
                return true;
            }
        }
        return false;
    }

    siblings() {
        if (this.isRoot()) {
            let message = `Unable to find the siblings. The tree node ${this.root()}s is root`;
            throw new RangeError("TreeNodeException " + message);
        }
        let mParent = this.parent;
        let parentSubtreesSize = mParent.subtreesSize;
        if (parentSubtreesSize == 1) {
            return [];
        }
        let parentSubtreeObjects = mParent.subtrees;
        let siblings = new Array(parentSubtreesSize - 1);
        for (let i = 0; i < parentSubtreesSize; i++) {
            let parentSubtree = parentSubtreeObjects[i];
            if (!parentSubtree.equals(this)) {
                siblings.push(parentSubtree);
            }
        }
        return siblings;
    }

    subtrees() {
        if (this.isLeaf()) {
            return [];
        }
        let subtrees = [];
        for (let i = 0; i < this.subtreesSize; i++) {
            let subtree = this.mySubtrees[i];
            subtrees.push(subtree);
        }
        return subtrees;
    }

    traversePostOrder(action) {
        if (!action.isCompleted()) {
            if (!this.isLeaf()) {
                for (let i = 0; i < this.subtreesSize; i++) {
                    let subtree = this.mySubtrees[i];
                    subtree.traversePostOrder(action);
                }
            }
            action.perform(this);
        }
    }

    traversePreOrder(action) {
        if (!action.isCompleted()) {
            action.perform(this);
            if (!this.isLeaf()) {
                for (let i = 0; i < this.subtreesSize; i++) {
                    let subtree = this.mySubtrees[i];
                    subtree.traversePreOrder(action);
                }
            }
        }
    }

}

export class LinkedMultiTreeNode extends MultiTreeNode {

    constructor({ data = null, branchingFactor = DEFAULT_BRANCHING_FACTOR } = {}) {
        super({ data, branchingFactor });
        this.leftMostNode = null;
        this.lastSubtreeNode = null;
        this.rightSiblingNode = null;
    }

    add(subtree=null) {
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

    clear() {
        if (!this.isLeaf()) {
            let nextNode = this.leftMostNode;
            while (nextNode !== null) {
                TreeNode.unlinkParent(nextNode);
                let nextNodeRightSiblingNode = nextNode.rightSiblingNode;
                nextNode.rightSiblingNode = null;
                nextNode.lastSubtreeNode = null;
                nextNode = nextNodeRightSiblingNode;
            }
            this.leftMostNode = null;
        }
    }

    contains(node=null) {
        if (node === null
            || this.isLeaf()
            || node.isRoot()) {
            return false;
        }
        let nextSubtree = this.leftMostNode;
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

    dropSubtree(subtree) {
        if (subtree === null
            || this.isLeaf()
            || subtree.isRoot()) {
            return false;
        }
        if (this.leftMostNode.equals(subtree)) {
            this.leftMostNode = this.leftMostNode.rightSiblingNode;
            TreeNode.unlinkParent(subtree);
            subtree.rightSiblingNode = null;
            return true;
        } else {
            let nextSubtree = this.leftMostNode;
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

    hasSubtree(subtree=null) {
        if (subtree === null
            || this.isLeaf()
            || subtree.isRoot()) {
            return false;
        }
        let nextSubtree = this.leftMostNode;
        while (nextSubtree !== null) {
            if (nextSubtree.equals(subtree)) {
                return true;
            } else {
                nextSubtree = nextSubtree.rightSiblingNode;
            }
        }
        return false;
    }

    height() {
        if (this.isLeaf()) {
            return 0;
        }
        let h = 0;
        let nextNode = this.leftMostNode;
        while (nextNode !== null) {
            h = Math.max(h, nextNode.height());
            nextNode = nextNode.rightSiblingNode;
        }
        return h + 1;
    }

    isLeaf() {
        return this.leftMostNode === null;
    }

    iterator() {
        return new TreeNodeIterator({
            list: this,

            leftMostNode: () => {
                return this.leftMostNode;
            },

            rightSiblingNode: () => {
                return this.rightSiblingNode;
            }

        });
    }

    remove(node=null) {
        if (node === null
            || this.isLeaf()
            || node.isRoot()) {
            return false;
        }
        if (this.dropSubtree(node)) {
            return true;
        }
        let nextSubtree = this.leftMostNode;
        while (nextSubtree !== null) {
            if (nextSubtree.remove(node)) {
                return true;
            }
            nextSubtree = nextSubtree.rightSiblingNode;
        }
        return false;
    }

    siblings() {
        if (this.isRoot()) {
            let message = `Unable to find the siblings. The tree node ${this.root()}s is root`;
            throw new ReferenceError("TreeNodeException " + message);
        }
        let firstNode = this.parent().leftMostNode;
        if (firstNode.rightSiblingNode === null) {
            return [];
        }
        let s = [];
        let nextNode = firstNode;
        while (nextNode !== null) {
            if (!nextNode.equals(this)) {
                s.push(nextNode);
            }
            nextNode = nextNode.rightSiblingNode;
        }
        return s;
    }

    subtrees() {
        if (this.isLeaf()) {
            return [];
        }
        let subtrees = [];
        subtrees.push(this.leftMostNode);
        let nextSubtree = this.leftMostNode.rightSiblingNode;
        while (nextSubtree !== null) {
            subtrees.push(nextSubtree);
            nextSubtree = nextSubtree.rightSiblingNode;
        }
        return subtrees;
    }

    traversePostOrder(action) {
        if (!action.isCompleted()) {
            if (!this.isLeaf()) {
                let nextNode = this.leftMostNode;
                while (nextNode !== null) {
                    nextNode.traversePostOrder(action);
                    nextNode = nextNode.rightSiblingNode;
                }
            }
            action.perform(this);
        }
    }

    traversePreOrder(action) {
        if (!action.isCompleted()) {
            action.perform(this);
            if (!this.isLeaf()) {
                let nextNode = this.leftMostNode;
                while (nextNode !== null) {
                    nextNode.traversePreOrder(action);
                    nextNode = nextNode.rightSiblingNode;
                }
            }
        }
    }

}