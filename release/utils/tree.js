"use strict";
/**
 * This functions rearrange items by their parents
 * Also sets the level value to each of the items
 *
 * Note: Expecting each item has a property called parentId
 * Note: This algorithm will fail if a list has two or more items with same ID
 * NOTE: This algorithm will fail if there is a deadlock of relationship
 *
 * For example,
 *
 * Input
 *
 * id -> parent
 * 1  -> 0
 * 2  -> 0
 * 3  -> 1
 * 4  -> 1
 * 5  -> 2
 * 7  -> 8
 * 6  -> 3
 *
 *
 * Output
 * id -> level
 * 1      -> 0
 * --3    -> 1
 * ----6  -> 2
 * --4    -> 1
 * 2      -> 0
 * --5    -> 1
 * 7     -> 8
 *
 *
 * @param rows
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
function groupRowsByParents(rows, from, to) {
    if (from === void 0) { from = ''; }
    if (to === void 0) { to = ''; }
    if (from !== '' && to !== '') {
        var nodeById = {};
        var l = rows.length;
        var node = null;
        nodeById[0] = new TreeNode(); // that's the root node
        var uniqIDs = rows.reduce(function (arr, item) {
            if (arr.indexOf(item[to]) === -1) {
                arr.push(item[to]);
            }
            return arr;
        }, []);
        for (var i = 0; i < l; i++) {
            nodeById[rows[i][to]] = new TreeNode(rows[i]);
        }
        for (var i = 0; i < l; i++) {
            node = nodeById[rows[i][to]];
            var parent_1 = 0;
            if (node.row.hasOwnProperty(from) && !!node.row[from] && (uniqIDs.indexOf(node.row[from]) > -1)) {
                parent_1 = node.row[from];
            }
            node.parent = nodeById[parent_1];
            node.row['level'] = node.parent.row['level'] + 1;
            node.parent.children.push(node);
        }
        var resolvedRows_1 = [];
        nodeById[0].flatten(function () {
            resolvedRows_1 = resolvedRows_1.concat([this.row]);
        }, true);
        return resolvedRows_1;
    }
    else {
        return rows;
    }
}
exports.groupRowsByParents = groupRowsByParents;
var TreeNode = /** @class */ (function () {
    function TreeNode(row) {
        if (row === void 0) { row = null; }
        if (!row) {
            row = {
                level: -1,
                treeStatus: 'expanded'
            };
        }
        this.row = row;
        this.parent = null;
        this.children = [];
    }
    TreeNode.prototype.flatten = function (f, recursive) {
        if (this.row['treeStatus'] === 'expanded') {
            for (var i = 0, l = this.children.length; i < l; i++) {
                var child = this.children[i];
                f.apply(child, Array.prototype.slice.call(arguments, 2));
                if (recursive)
                    child.flatten.apply(child, arguments);
            }
        }
    };
    return TreeNode;
}());
//# sourceMappingURL=tree.js.map