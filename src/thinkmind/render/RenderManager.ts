import { BackgroundAttr } from '../item/BackgoundAttr';
import { ComputeNode } from '../item/ComputeNode';
import { NodeRender } from './NodeRender';
import { RenderContext, RenderLayerType ,RenderObject} from './RenderContext';
import { LinkRender } from './LinkRender';
import { VNode } from 'snabbdom/build/package/vnode';

import { DragNode } from '../interaction';

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

export class RenderManager {
    static nodeRender: NodeRender;
    static linkRender: LinkRender;
    static renderContext: RenderContext;

    static initialize(htmlElement: HTMLElement) {
        this.createRenderContext(htmlElement);
        this.nodeRender = new NodeRender();
        this.linkRender = new LinkRender();
    }

    /**
     * 创建渲染上下文
     * @param htmlElement 
     */
    static createRenderContext(htmlElement: HTMLElement) {
        this.renderContext = new RenderContext();
        this.renderContext.rootElement = htmlElement;
        this.renderContext.initialize();
    }

    /**
     * 渲染上下文背景
     * @param backgroundAttr 
     */
    static renderBackgound(rootComputeNode: ComputeNode, backgroundAttr: BackgroundAttr): void {
        this.renderContext.render(rootComputeNode, backgroundAttr);
    }

    /**
     * 渲染节点
     * @param rootComputeNode 
     */
    static renderNode(rootComputeNode: ComputeNode) {
        this.nodeRender.render(this.renderContext, rootComputeNode);
        let vnode: VNode[] = [];
        rootComputeNode.eachNode((node: ComputeNode) => {
            var nodeVNode: VNode[] = [];
            node.children.forEach((child: ComputeNode) => {
                var linkVNode: VNode[] = this.linkRender.render(this.renderContext, node, child, true);
                vnode = vnode.concat(linkVNode);
            })
            var nodeVNode: VNode[] = this.nodeRender.render(this.renderContext, node)
            vnode = vnode.concat(nodeVNode);
        });
        this.renderContext.update(RenderLayerType.Node, vnode);
    }

    /**
     * 渲染一些其他扩展性项目
     * @param rootComputeNode 
     */
    static renderExts(rootComputeNode: ComputeNode){
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
    static commit() {
        this.renderContext.commit();
    }

    /**
     * 快速渲染，组合渲染用于在有除开背景，还有元素外其他图层的情况
     * @param rootComputeNode 
     */
    static fastRender(rootComputeNode: ComputeNode, backgroundAttr:BackgroundAttr) {
        this.renderBackgound(rootComputeNode, backgroundAttr);
        this.renderNode(rootComputeNode);
        this.renderExts(rootComputeNode);
        this.commit();

        backgroundAttr.scroll();
    }
} 