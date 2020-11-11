import { Point } from '../util/Interface';
import { NodeAlgoAttrBase } from './NodeAlgoAttr';
import log, {Logger} from 'loglevel';
import { NodeAttr } from './NodeAttr';

export class ComputeNode {
    static computeNodeCaches: Map<string, ComputeNode>;
    logger:Logger = log.getLogger("ComputeNode");

    id: string;            //id
    hgap: number;       //垂直间距
    vgap: number;       //水平间距
    x: number;          
    y: number;
    width: number;
    height: number;
    depth: number;
    parent: ComputeNode;
    children: ComputeNode[];
    data: any;
    showBBox:boolean = false;
    isTemp:boolean = false;
    bbox;
    static isCreateComplete:boolean = false;    //创建完成后，所有的调用计算数据都会开始缓存

    constructor(data:NodeAttr, algoAttr: NodeAlgoAttrBase) {
        this.vgap = this.hgap = 0

        var hgap = algoAttr.getHGap(data);
        var vgap = algoAttr.getVGap(data);
        this.data = data;
        var rect = algoAttr.getWidthAndHeight(data);
        this.width = rect.width;
        this.height = rect.height;
        this.id = algoAttr.getId(data)
        this.x = this.y = 0
        this.depth = 0
        this.isTemp = data.isTemp;
        if (!this.children) {
            this.children = []
        }
        this.addGap(hgap, vgap)
    }

    /**
     * 构建布局节点树
     * @param data 
     * @param attrAlgo 
     * @param isolated 
     */
    static build(data, attrAlgo: NodeAlgoAttrBase, isolated): ComputeNode{
        this.computeNodeCaches = new Map<string, ComputeNode>();
        
        var rootNode: ComputeNode = new ComputeNode(data, attrAlgo);
        this.computeNodeCaches[rootNode.id] = rootNode;

        if (!isolated && !data.isCollapsed) { //不是独立的，也不是收缩状态
            const nodes: ComputeNode[] = [];        //用来做遍历的对象
            nodes.push(rootNode);
            var node: ComputeNode;
            while (node = nodes.pop()!) {
                if (!node.data.isCollapsed) {   //不是收缩状态，需要对子节点进行处理
                    const children = attrAlgo.getChildren(node.data);   //获得attr里到children数据
                    const length = children ? children.length : 0;      //存在则遍历
                    node.children = [];
                    if (children && length) {
                        for (var i = 0; i < length; i++) {
                            console.log(children[i].data.id, children[i].data.content);
                            const child = new ComputeNode(children[i], attrAlgo);   //创建当前节点的子对象
                            
                            node.children.push(child);                  //建立子到父的关系
                            child.parent = node;                        //建立父到子的关系
                            child.depth = node.depth + 1;               //子对象深度+1
                            nodes.push(child);                          //把子对象放入需要遍历处理的队列中
                            this.computeNodeCaches[child.id] = child;   //放到全局缓存里
                        }
                    }
                }
            }
        }
        return rootNode;
    }
    
    /**
     * 判断是否为根节点
     */
    isRoot() {
        return (this.depth === 0)
    }

    /**
     * 添加水平间距和垂直
     * @param hgap 
     * @param vgap 
     */
    addGap(hgap: number, vgap: number) {
        this.hgap += hgap
        this.vgap += vgap
        this.width += 2 * hgap
        this.height += 2 * vgap
    }

    /**
     * 对所有的节点执行回调函数
     * @param callback 
     */
    eachNode(callback: Function) {
        var nodes: ComputeNode[] = [this];
        var current: ComputeNode;
        while (current = nodes.pop()!) {
            callback(current)
            nodes = nodes.concat(current.children)
        }
    }

    /**
     * 得到执行节点的bb盒子
     */
    getBoundingBox() {
        if(this.bbox != undefined){
            return this.bbox;
        }
        const bb = {
            left: Number.MAX_VALUE,
            top: Number.MAX_VALUE,
            width: 0,
            height: 0
        }
        this.eachNode((node: ComputeNode) => {
            bb.left = Math.min(bb.left, node.x)
            bb.top = Math.min(bb.top, node.y)
            bb.width = Math.max(bb.width, node.x + node.width)
            bb.height = Math.max(bb.height, node.y + node.height)
        })
//        this.logger.trace("计算getBoundingBox", this.data.data.content, bb);
        if(ComputeNode.isCreateComplete == true){  
            this.bbox = bb;
        }
        return bb
    }

    /**
     * 对执行对节点包含子节点执行平移
     * @param tx 
     * @param ty 
     */
    translate(tx = 0, ty = 0) {
        this.eachNode((node: ComputeNode) => {
            node.x += tx
            node.y += ty
        })
    }

    /**
     * 计算执行的节点的bb盒子，并且向左平移
     */
    right2left() {
        const bb = this.getBoundingBox()
        this.eachNode((node: ComputeNode) => {
            node.x = node.x - (node.x - bb.left) * 2 - node.width
        })
        this.translate(bb.width, 0)
    }

    /**
     * 计算执行的节点的bb盒子，并且向上平移
     */
    down2up() {
        const bb = this.getBoundingBox()
        this.eachNode((node: ComputeNode) => {
            node.y = node.y - (node.y - bb.top) * 2 - node.height
        })
        this.translate(0, bb.height)
    }

    /**
     * 得到命中节点, 有待优化
     * @param p 
     */
    getHit(p:Point):ComputeNode|undefined{
        let hitNode:ComputeNode|undefined = undefined;
        this.eachNode((node:ComputeNode)=>{
            if(node.isTemp == false && node.isHit(p)){
                hitNode = node;
            }
        })
        return hitNode;
    }

    getSubPosition(p:Point):number{
        let pos:number = 0;
        this.children.forEach((node:ComputeNode)=>{
            let bbox = node.getBoundingBox();
            let heightLine = (bbox.top + bbox.height)/2;
            if(p.x > heightLine){
                pos += 1;
            }
        });
        return pos;
    }

    /**
     * 检测命中
     * @param p 
     */
    isHit(p:Point):boolean{
        const {left, top, width, height} = this.getBoundingBox();   //左位置，顶位置， 右位置， 下位置
        if(p.x > left && p.x <  width && p.y > top && p.y < height){
            return true;
        }
        return false;
    }
}

