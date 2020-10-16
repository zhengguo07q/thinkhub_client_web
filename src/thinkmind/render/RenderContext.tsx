import {init, classModule, propsModule, styleModule, attributesModule, eventListenersModule,  toVNode} from '../util/SnabbdomExport';
import { BackgroundAttr } from '../item/BackgoundAttr'
import { ComputeNode } from '../item/ComputeNode';
import { VNode } from 'snabbdom/build/package/vnode';
import { h } from 'snabbdom/build/package/h';
import { EventHelper } from '../util/EventHelper';


export enum RenderLayerType{
    Background,
    Node,
    NodeExts,
}

export type RenderCache = {
    container:VNode,
    nodes:VNode[],
    nodeExts:VNode[],
}

export const RenderObject = {
    NodeGroup: "ng_",
    NodeRect: "nr_",
    NodeBorder: "nb_",
    NodeForeignObject: "nf_",
    NodeTextarea: "nt_",
    NodeCollapsed:"nc_",
    NodeLine:"nl_",
    NodeGroupLinkAndCollapsed:"nlc_",
    NodeExt:"ex_",
}

export enum RenderOrientation{
    LEFT,
    TOP,
    RIGHT,
    BOTTOM,
}

/**
 * 画布
 */
export class RenderContext{
    static NS_svg: string = "http://www.w3.org/2000/svg";
    static SVG_ID: string = "svg_id";
    static BKG_ID: string = "bkg_id";

    private patch;
    private vnodeRoot:VNode;

    rootElement:HTMLElement;
    backgroundAttr:BackgroundAttr;

    private renderCache: RenderCache = {
        container: h(""),
        nodes:[],
        nodeExts:[],
    };

    initialize(){
        this.patch = init([ 
            classModule, // makes it easy to toggle classes
            propsModule, // for setting properties on DOM elements
            styleModule, // handles styling on elements with support for animations
            attributesModule,
            eventListenersModule, // attaches event listeners
          ])
        this.vnodeRoot = this.patch(this.rootElement, toVNode(this.rootElement));
    }

    /**
     * 计算子节点的方向，方向是可以继承的，主要是为了在子节点隐藏时，知道方向
     * @param parentNode 
     * @param childNode 
     */
    calculateChildOrientation(parentNode:ComputeNode, childNode:ComputeNode, isHorizontal:boolean):RenderOrientation{
        let retOrientation;
        let beginNode = parentNode;
        let endNode = childNode;
        //算出位置方向
        if (isHorizontal) {                     //水平
            if (beginNode.x > endNode.x) {      //根在右边， 交换位置
                retOrientation = RenderOrientation.LEFT;
            }else{
                retOrientation = RenderOrientation.RIGHT;
            }
        } else {                               //垂直
            if (beginNode.y > endNode.y) {     //根在下面，交换位置
                retOrientation = RenderOrientation.TOP;
            }else{
                retOrientation = RenderOrientation.BOTTOM;
            }
        }
        return retOrientation;
    }

    /**
     * 构建渲染画布, 这个需要布局计算完才能确定
     * @param rootComputeNode
     * @param backgroundAttr 
     */
    render(rootComputeNode: ComputeNode, backgroundAttr: BackgroundAttr){
        this.backgroundAttr = backgroundAttr;
        const width = backgroundAttr.getSceneWidth();
        const height = backgroundAttr.getSceneHeight();
        let rootNode = toVNode(this.rootElement);
        rootNode.children = [h('svg#' + RenderContext.SVG_ID, 
        { 
            attrs: 
            { 
                width: width, 
                height: height,
                viewBox:"0 0 " + width+" " + height
            },
            style:{
                margin: '0',
                border: '0',
                padding: '0',
            }
        }, [h('rect#' + RenderContext.BKG_ID,   
        {
            key:'backgroundLayer', 
            attrs:
            {
                x:0,
                y:0,
                width: width, 
                height: height, 
                fill: backgroundAttr.background
            },
            style:{
                margin: '0',
                border: '0',
                padding: '0',
            },
            on:{
                click: EventHelper.eventBackgroundClick,
            }
        })])];

        this.renderCache.container = rootNode;
    }

    wrapperGroup(list:VNode[]){
        return h("g", {ns: RenderContext.NS_svg,}, list);
    }

    /**
     * 更新缓存
     * @param layer 
     * @param nodes 
     */
    update(layer:RenderLayerType, node:VNode[]){
        if(layer == RenderLayerType.Node){
            this.renderCache.nodes = node as VNode[];
        }else if(layer == RenderLayerType.NodeExts){
            this.renderCache.nodeExts = node as VNode[];
        }
    }

    /**
     * 提交渲染
     */
    commit(){
        var svg:VNode = this.renderCache.container.children![0] as VNode;
        svg.children = svg.children!.concat(this.renderCache.nodeExts);
        svg.children = svg.children!.concat(this.renderCache.nodes);
        this.vnodeRoot = this.patch(this.vnodeRoot, this.renderCache.container);
    }
}