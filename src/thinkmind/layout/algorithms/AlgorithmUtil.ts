export class AlgorithmUtil {
    static moveRight(node, move, isHorizontal) {
        if (isHorizontal) {
            node.y += move
        } else {
            node.x += move
        }
        node.children.forEach(child => {
            AlgorithmUtil.moveRight(child, move, isHorizontal)
        })
    }

    static getMin(node, isHorizontal) {
        let res = isHorizontal ? node.y : node.x
        node.children.forEach(child => {
            res = Math.min(AlgorithmUtil.getMin(child, isHorizontal), res)
        })
        return res
    }

    static normalize(node, isHorizontal) {
        const min = AlgorithmUtil.getMin(node, isHorizontal)
        AlgorithmUtil.moveRight(node, -min, isHorizontal)
    }

    static convertBack(converted/* Tree */, root/* TreeNode */, isHorizontal) {
        if (isHorizontal) {
            root.y = converted.x
        } else {
            root.x = converted.x
        }
        converted.c.forEach((child, i) => {
            AlgorithmUtil.convertBack(child, root.children[i], isHorizontal)
        })
    }

    static layer(node, isHorizontal, d = 0) {
        if (isHorizontal) {
            node.x = d
            d += node.width
        } else {
            node.y = d
            d += node.height
        }
        node.children.forEach(child => {
            AlgorithmUtil.layer(child, isHorizontal, d)
        })
    }
}