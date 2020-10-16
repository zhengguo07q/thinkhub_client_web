import { BackgroundAttr } from '../item/BackgoundAttr';
import { ComputeNode } from '../item/ComputeNode';
import { NodeAlgoAttrBase } from '../item/NodeAlgoAttr';
import { Point } from '../util/Interface';
import { BaseLayout } from './layouts/BaseLayout';
import { DownwardLayout } from './layouts/DownwardLayout';
import { LeftLayout } from './layouts/LeftLayout';
import { RightLayout } from './layouts/RightLayout';
import { StandardLayout } from './layouts/StandardLayout';
import { UpwardLayout } from './layouts/UpwardLayout';
import log, { Logger } from 'loglevel';
import { RenderManagerInstance } from '../render/RenderManager';
import { NodeAttr } from '../item/NodeAttr';

export enum LayoutType {
    Standard,
    Right,
    Left,
    Upward,
    Downward,
}

const HORIZONTAL_LAYOUTS = [
    'Left',
    'Right',
    'Standard'
]

/**
 * 画布大小，画布永远为内容宽高+2屏幕宽高
 */
export class LayoutManager {
    logger: Logger = log.getLogger("LayoutManager");
    static instance: LayoutManager;
    layoutType: LayoutType = LayoutType.Standard;
    root: NodeAttr;
    rootCompute: ComputeNode;
    algoAttr: NodeAlgoAttrBase;
    extraEdges = [];

    layoutTree: BaseLayout;
    change: boolean = false;

    backgroundAttr: BackgroundAttr;

    isHorizontal(type: LayoutType) {
        let str = LayoutType[type];
        return HORIZONTAL_LAYOUTS.indexOf(str) > -1
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
    set(root: NodeAttr, algoAttr?: NodeAlgoAttrBase, backgroundAttr?: BackgroundAttr, extraEdges = []) {
        this.root = root;
        this.algoAttr = algoAttr || this.algoAttr;
        this.backgroundAttr = backgroundAttr || this.backgroundAttr;
        this.extraEdges = extraEdges;
        this.markChange();
    }

    /**
     * 标记改变
     */
    markChange() {
        this.change = true;
    }

    /**
     * 执行布局，对内容对操作时，不调整滚动
     */
    layout(isFix: boolean = false) {
        if (isFix) {
            this.backgroundAttr.adjustScroll = false;
        } else {
            this.backgroundAttr.adjustScroll = true;
        }

        if (this.change) {
            ComputeNode.isCreateComplete = false;
            switch (this.layoutType) {
                case LayoutType.Left:
                    this.layoutTree = new LeftLayout(this.root, this.algoAttr, this.extraEdges);
                    break;
                case LayoutType.Right:
                    this.layoutTree = new RightLayout(this.root, this.algoAttr, this.extraEdges);
                    break;
                case LayoutType.Downward:
                    this.layoutTree = new DownwardLayout(this.root, this.algoAttr, this.extraEdges);
                    break;
                case LayoutType.Upward:
                    this.layoutTree = new UpwardLayout(this.root, this.algoAttr, this.extraEdges);
                    break;
                default:
                    this.layoutTree = new StandardLayout(this.root, this.algoAttr, this.extraEdges);
                    break;
            }

            this.rootCompute = this.layoutTree.doLayout();

            this.calculateBackground();
            ComputeNode.isCreateComplete = true;
        }
        RenderManagerInstance.fastRender(this.rootCompute, this.backgroundAttr, this.isHorizontal(this.layoutType));
    }

    /**
     * 布局场景，明确在场景中的位置
     * @param compute 
     */
    calculateBackground() {
        const { left, top, width, height } = this.rootCompute.getBoundingBox(); //内容的宽和高
        this.backgroundAttr.setContentSize(width, height);

        const offsetWidth = this.backgroundAttr.marginH;
        const offsetHeight = this.backgroundAttr.marginV;
        //获得当前和之前的root位置差距，一般情况下，应该不会很大


        this.rootCompute.eachNode((node: ComputeNode) => {          //所有的节点，偏移到一定位置，为两边留空
            node.x = node.x + offsetWidth;
            node.y = node.y + offsetHeight;
        })
        this.logger.debug("设置中心点", this.rootCompute.x + this.rootCompute.width / 2, this.rootCompute.y + this.rootCompute.height / 2);

        this.backgroundAttr.setRootCenterPosition(this.rootCompute.x + this.rootCompute.width / 2, this.rootCompute.y + this.rootCompute.height / 2);
    }

    /**
     * 显示插入位置
     * @param p 
     */
    getInserObject(p: Point) {
        let root = this.layoutTree.getRoot();
        let hitNode = root.getHit(p);
        return hitNode;
    }

    tree() {
        console.log('ComputeNode: ');
        this.print(this.layoutTree.getRoot(), '');
    }

    print(node: ComputeNode, prefix: string) {
        var i;
        console.log(prefix + node.id)
        prefix = prefix + '    ';
        for (i = 0; i < node.children.length; i++) {
            this.print(node.children[i], prefix);
        }
    }

    /**
     * 静态方法
     */
    static getInstance(): LayoutManager {
        if (this.instance == null) {
            this.instance = new LayoutManager();
        }
        return this.instance;
    }
}


export const LayoutManagerInstance = LayoutManager.getInstance();