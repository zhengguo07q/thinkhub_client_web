import { BaseLayout } from './BaseLayout';
import { ComputeNode } from '../../item/ComputeNode';
import { nonLayeredTidyTreeAlgorithms } from '../algorithms/NonLayeredTidyTreeAlgorithms';

export class StandardLayout extends BaseLayout {
    doLayout() {
        // separate into left and right trees
        const leftTree = ComputeNode.build(this.root.data, this.algoAttr, true)
        const rightTree = ComputeNode.build(this.root.data, this.algoAttr, true)
        const treeSize = this.root.children.length
        const rightTreeSize = Math.round(treeSize / 2)
        for (let i = 0; i < treeSize; i++) {
            const child = this.root.children[i]
            if (i < rightTreeSize) {
                rightTree.children.push(child)
            } else {
                leftTree.children.push(child)
            }
        }
        // do layout for left and right trees
        nonLayeredTidyTreeAlgorithms(rightTree, true)
        nonLayeredTidyTreeAlgorithms(leftTree, true)
        leftTree.right2left()
        // combine left and right trees
        rightTree.translate(leftTree.x - rightTree.x, leftTree.y - rightTree.y)
        // translate root
        this.root.x = leftTree.x
        this.root.y = rightTree.y
        const bb = this.root.getBoundingBox()
        if (bb.top < 0) {
            this.root.translate(0, -bb.top)
        }
        return this.root;
    }
}

