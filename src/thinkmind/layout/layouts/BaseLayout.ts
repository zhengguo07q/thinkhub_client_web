import { ComputeNode } from '../../item/ComputeNode';
import { NodeAlgoAttrBase } from '../../item/NodeAlgoAttr';


class Edge {
    source: any;
    target: any;
}

class NodeData {
    data: any;
    id: any;
    // position
    x: number;
    y: number;
    centX: number;
    centY: number;
    // size
    hgap: number;
    vgap: number;
    height: number;
    width: number;
    actualHeight: number;
    actualWidth: number;
    // depth
    depth: number;
}

export class BaseLayout {
    protected root: ComputeNode;
    protected algoAttr: NodeAlgoAttrBase;
    protected extraEdges;
    
    constructor(root: any, algoAttr: NodeAlgoAttrBase, extraEdges = []) {
        this.root = ComputeNode.build(root, algoAttr, false);
        this.algoAttr = algoAttr;
        this.extraEdges = extraEdges;
    }

    getRoot():ComputeNode{
        return this.root;
    }

    doLayout() :ComputeNode{
        throw new Error('please override this method')
    }

    getNodes(): NodeData[] {
        var nodes: NodeData[] = [];
        let countByDepth = {};
        this.root.eachNode((node: ComputeNode) => {
            countByDepth[node.depth] = countByDepth[node.depth] || 0;
            countByDepth[node.depth]++;
            nodes.push({
                // origin data
                data: node.data,
                id: node.id,
                // position
                x: node.x,
                y: node.y,
                centX: node.x + node.width / 2,
                centY: node.y + node.height / 2,
                // size
                hgap: node.hgap,
                vgap: node.vgap,
                height: node.height,
                width: node.width,
                actualHeight: node.height - node.vgap * 2,
                actualWidth: node.width - node.hgap * 2,
                // depth
                depth: node.depth
            });
        })
        return nodes;
    }

    /**
     * 获取边缘关系，获取每个对象和它所拥有的子对象的父子关系连接
     */
    getEdges(): Edge[] {
        var edges: Edge[] = [];
        this.root.eachNode((node: ComputeNode) => {
            node.children.forEach((child: ComputeNode) => {
                edges.push({
                    source: node.id,
                    target: child.id
                } as Edge);
            })
        })
        edges.concat(this.extraEdges);
        return edges;
    }
}

