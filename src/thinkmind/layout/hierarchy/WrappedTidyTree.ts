import { ComputeNode } from '../../item/ComputeNode';

export class WrappedTidyTree {
    // Width and height.
    w: number= 0;
    h: number = 0;

    x: number = 0;
    y: number = 0;

    prelim = 0;
    mod = 0;
    shift = 0;
    change = 0;

    // Left and right thread.
    tl = null;
    tr = null;

    // Extreme left and right nodes.
    el: WrappedTidyTree ;
    er: WrappedTidyTree ;

    // Sum of modifiers at the extreme nodes.
    msel = 0;
    mser = 0;

    // Array of children and number of children.
    c: WrappedTidyTree[] = [];
    cs: number = 0;

    constructor(w: number, h: number, y: number, c: WrappedTidyTree[] = []) {
        this.w = w
        this.h = h
        this.y = y
        this.c = c
        this.cs = c.length
    }

    static fromNode(root: ComputeNode, isHorizontal): WrappedTidyTree {
        const trees: WrappedTidyTree[] = [];
        root.children.forEach((child) => {
            trees.push(WrappedTidyTree.fromNode(child, isHorizontal)!);
        })
        if (isHorizontal) {
            return new WrappedTidyTree(root.height, root.width, root.x, trees);
        }
        return new WrappedTidyTree(root.width, root.height, root.y, trees)
    }
}


