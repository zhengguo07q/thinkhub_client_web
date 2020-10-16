import { BackgroundAttr } from '../item/BackgoundAttr';
import { ComputeNode } from '../item/ComputeNode';
import { NodeRender } from './NodeRender';
import { RenderContext, RenderLayerType, RenderObject, RenderOrientation } from './RenderContext';
import { LinkRender } from './LinkRender';
import { VNode } from 'snabbdom/build/package/vnode';
import { TypeUtil } from '../util/TypeUtil';
import log, {Logger} from 'loglevel';

export enum NodeRenderType {
    Rectangle,
}

export enum LinkRenderType {
    Line,
}

export type RenderBase = (NodeRender | LinkRender);

/**
 * 暂时只支持渲svg渲染
 */
export enum RenderEngine {
    Cancvs,
    SVG,
}

class RenderManager {
    logger:Logger = log.getLogger("RenderManager");
    nodeRender: NodeRender;
    linkRender: LinkRender;
    renderContext: RenderContext;

    initialize(htmlElement: HTMLElement) {
        this.createRenderContext(htmlElement);
        this.nodeRender = new NodeRender();
        this.linkRender = new LinkRender();
    }

    /**
     * 创建渲染上下文
     * @param htmlElement 
     */
    createRenderContext(htmlElement: HTMLElement) {
        this.renderContext = new RenderContext();
        this.renderContext.rootElement = htmlElement;
        this.renderContext.initialize();
    }

    /**
     * 渲染上下文背景
     * @param backgroundAttr 
     */
    renderBackgound(rootComputeNode: ComputeNode, backgroundAttr: BackgroundAttr): void {
        this.renderContext.render(rootComputeNode, backgroundAttr);
    }

    /**
     * 渲染节点
     * @param rootComputeNode 
     */
    renderNode(rootComputeNode: ComputeNode, isHorizontal: boolean) {
        let orientation:RenderOrientation = RenderOrientation.RIGHT;
        let root = this.renderNodeIter(rootComputeNode, isHorizontal, orientation);
        this.renderContext.update(RenderLayerType.Node, [root]);
    }

    /**
     * 
     * @param computeNode 
     * @param isHorizontal 
     */
    renderNodeIter(computeNode: ComputeNode, isHorizontal: boolean, orientation:RenderOrientation): VNode {
        let list = this.nodeRender.render(this.renderContext, computeNode, isHorizontal);   //节点 g_node
        let linkList: VNode[] = [];
        //子链接和子节点
        computeNode.children.forEach((childNode) => {
            orientation = this.renderContext.calculateChildOrientation(computeNode, childNode, isHorizontal);
            var linkVNode: VNode = this.linkRender.render(this.renderContext, computeNode, childNode, isHorizontal);
            linkList.push(linkVNode);
            let childVnode = this.renderNodeIter(childNode, isHorizontal, orientation);
            list.push(childVnode);
        });
        //折叠节点
        this.logger.debug('方向', computeNode.data.data.content, RenderOrientation[orientation]);
        const gCollapsed= this.nodeRender.renderCollapsed(this.renderContext, computeNode, isHorizontal, orientation);//节点折叠 
        if(gCollapsed != undefined){
            linkList.push(gCollapsed);
        }
        let linkAndCollapsed = this.linkRender.wrapperGroupLinkAndCollapsed(computeNode, linkList);
        TypeUtil.arrayInsert(list, 0, linkAndCollapsed);    //g_link线放在最前面

        return this.renderContext.wrapperGroup(list);
    }



    /**
     * 渲染一些其他扩展性项目
     * @param rootComputeNode 
     */
    renderExts(rootComputeNode: ComputeNode) {
        this.nodeRender.renderExts(rootComputeNode);
        let vnodes: VNode[] = [];
        rootComputeNode.eachNode((node: ComputeNode) => {
            vnodes = vnodes.concat(this.nodeRender.renderExts(node));
        });
        this.renderContext.update(RenderLayerType.NodeExts, vnodes);
    }

    /**
     * 组合渲染
     * @param subs 
     * @param subslist 
     */
    commit() {
        this.renderContext.commit();
    }

    /**
     * 快速渲染，组合渲染用于在有除开背景，还有元素外其他图层的情况
     * @param rootComputeNode 
     */
    fastRender(rootComputeNode: ComputeNode, backgroundAttr: BackgroundAttr, isHorizontal: boolean) {
        this.renderBackgound(rootComputeNode, backgroundAttr);
        this.renderNode(rootComputeNode, isHorizontal);
        //   this.renderExts(rootComputeNode);
        this.commit();

        backgroundAttr.scroll();
    }
}


export const RenderManagerInstance = new RenderManager();
