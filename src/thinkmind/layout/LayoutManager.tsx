import { BackgroundAttr } from '../item/BackgoundAttr';
import { ComputeNode } from '../item/ComputeNode';
import { NodeAlgoAttrBase } from '../item/NodeAlgoAttr';
import { Point } from '../util/Interface';
import { BaseLayout } from './layouts/BaseLayout';
import { DownwardOrganizationalLayout } from './layouts/DownwardOrganizationalLayout';
import { LeftLogicalLayout } from './layouts/LeftLogicalLayout';
import { RightLogicalLayout } from './layouts/RightLogicalLayout';
import { StandardLayout } from './layouts/StandardLayout';
import { UpwardOrganizationalLayout } from './layouts/UpwardOrganizationalLayout';
import log, {Logger} from 'loglevel';

export enum LayoutType {
    LeftLogical,
    RightLogical,
    Downward,
    Upward,
    Standard,
}

const HORIZONTAL_LAYOUTS = [
    'LeftLogical',
    'RightLogical',
    'Standard'
]

/**
 * 画布大小，画布永远为内容宽高+2屏幕宽高
 */
export class LayoutManager {
    logger:Logger = log.getLogger("LayoutManager");
    static instance:LayoutManager;
    layoutType: LayoutType = LayoutType.Standard;
    root: any;
    algoAttr: NodeAlgoAttrBase;
    extraEdges = [];

    layoutTree:BaseLayout;
    change:boolean = false;

    protected firstId:string = '';
    protected firstOrigin:Point = new Point();    //第一次的布局坐标

    backgroundAttr:BackgroundAttr;

    isHorizontal(type: string) {
        return HORIZONTAL_LAYOUTS.indexOf(type) > -1
    }

    /**
     * 重新设置布局类型
     * @param layoutType 
     */
    setLayoutType(layoutType: LayoutType) {
        if (this.layoutType == layoutType) {
            return;
        }
        this.layoutType = layoutType;
        this.markChange()
    }

    /**
     * 得到布局类型
     */
    getLayoutType() {
        return this.layoutType;
    }

    /**
     * 设置布局对象
     * @param root 
     * @param algoAttr 
     * @param extraEdges 
     */
    set(root: any, algoAttr: NodeAlgoAttrBase, backgroundAttr:BackgroundAttr, extraEdges = []) {
        this.root = root;
        this.algoAttr = algoAttr;
        this.backgroundAttr = backgroundAttr;
        this.extraEdges = extraEdges;
        this.markChange();
    }

    /**
     * 标记改变
     */
    markChange(){
        this.change = true;
    }

    /**
     * 执行布局
     */
    layout() :ComputeNode{
        switch (this.layoutType) {
            case LayoutType.LeftLogical:
                this.layoutTree = new LeftLogicalLayout(this.root, this.algoAttr, this.extraEdges);
                break;
            case LayoutType.RightLogical:
                this.layoutTree = new RightLogicalLayout(this.root, this.algoAttr, this.extraEdges);
                break;
            case LayoutType.Downward:
                this.layoutTree = new DownwardOrganizationalLayout(this.root, this.algoAttr, this.extraEdges);
                break;
            case LayoutType.Upward:
                this.layoutTree = new UpwardOrganizationalLayout(this.root, this.algoAttr, this.extraEdges);
                break;
            default :
                this.layoutTree = new StandardLayout(this.root, this.algoAttr, this.extraEdges);
                break;
        }

        var root = this.layoutTree.doLayout();
        this.calculateBackground(root);
        this.calculateOrigin(root);

        return root;
    }

    /**
     * 布局场景，明确在场景中的位置
     * @param compute 
     */
    calculateBackground(compute:ComputeNode){
        const {left, top, width, height} = compute.getBoundingBox(); //内容的宽和高
        this.backgroundAttr.setContentSize(width, height);

        const offsetWidth = this.backgroundAttr.marginH;    
        const offsetHeight = this.backgroundAttr.marginV;
        compute.eachNode((node:ComputeNode)=>{          //所有的节点，偏移到一定位置，为两边留空
            node.x = node.x + offsetWidth;      
            node.y = node.y + offsetHeight;
        })

        this.backgroundAttr.setRootCenterPosition(compute.x + compute.width/2, compute.y + compute.height/2);
    }

    /**
     * 保持根节点不动
     */
    calculateOrigin(compute:ComputeNode){
        //记录第一次的数据，不然则调整位置
        if(compute.id != this.firstId){
            this.firstOrigin.x = compute.x;
            this.firstOrigin.y = compute.y;

            this.firstId = compute.id; 
        }else{
            var diff = {x: compute.x - this.firstOrigin.x, y: compute.y - this.firstOrigin.y};
    
            //计算子节点
            compute.eachNode((node: ComputeNode) => {
                node.children.forEach((child: ComputeNode) => {
                    child.x -= diff.x;
                    child.y -= diff.y;
                })
            })
            compute.x = this.firstOrigin.x; //保证原点
            compute.y = this.firstOrigin.y;
        }
    }

    /**
     * 显示插入位置
     * @param p 
     */
    getInserObject(p:Point){
        let root = this.layoutTree.getRoot();
        let hitNode = root.getHit(p);
        return hitNode;
    }

    tree(){
        console.log('ComputeNode: ');
        this.print(this.layoutTree.getRoot(), '');
    }

    print(node:ComputeNode, prefix:string){
        var i;
        console.log(prefix + node.id)
        prefix = prefix + '    ';
        for (i = 0; i<node.children.length ; i++){
            this.print(node.children[i], prefix);
        }
    }

    /**
     * 静态方法
     */
    static getInstance():LayoutManager{
        if(this.instance == null){
            this.instance = new LayoutManager();
        }
        return this.instance;
    }
}

