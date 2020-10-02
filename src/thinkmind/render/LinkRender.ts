import { ComputeNode } from '../item/ComputeNode';
import { VNode } from 'snabbdom/build/package/vnode';
import { h } from 'snabbdom/build/package/h';
import { NodeAttr } from '@/thinkmind/item/NodeAttr';
import { LinkAttr } from '@/thinkmind/item/LinkAttr';
import { RenderContext } from './RenderContext';

export class LinkRender  {
    render(renderContext:RenderContext, rootNode: ComputeNode, childNode: ComputeNode, isHorizontal:boolean, scale:number=1): VNode[] {
        let attrNode: NodeAttr = rootNode.data;
        let linkAttr: LinkAttr = attrNode.linkAttr;
        let beginNode = rootNode
        let endNode = childNode
        let beginX
        let beginY
        let endX
        let endY
        if (isHorizontal) {
            let beginNode = rootNode
            if (rootNode.x > childNode.x) {
                beginNode = childNode
                endNode = rootNode
            }
            beginX = Math.round(beginNode.x + beginNode.width - beginNode.hgap)
            beginY = Math.round(beginNode.y + beginNode.height / 2)
            endX = Math.round(endNode.x + endNode.hgap)
            endY = Math.round(endNode.y + endNode.height / 2)
        } else {
            if (rootNode.y > childNode.y) {
                beginNode = childNode
                endNode = rootNode
            }
            beginX = Math.round(beginNode.x + beginNode.width / 2)
            beginY = Math.round(beginNode.y + beginNode.height - beginNode.vgap)
            endX = Math.round(endNode.x + endNode.width / 2)
            endY = Math.round(endNode.y + endNode.vgap)
        }
        if (beginNode.isRoot()) {
            beginX = Math.round(beginNode.x + beginNode.width / 2)
            beginY = Math.round(beginNode.y + beginNode.height / 2)
        }
        if (endNode.isRoot()) {
            endX = Math.round(endNode.x + endNode.width / 2)
            endY = Math.round(endNode.y + endNode.height / 2)
        }
 
        const getBezierCurveVorH = (isHorizontal: boolean): string => {
            if (isHorizontal) {
                return 'M ' + 
                (beginX / scale) + ' ' + 
                (beginY / scale) + 
                ' C ' + 
                (Math.round(beginX + (beginNode.hgap + endNode.hgap) / 2) / scale) + ' ' + 
                (beginY / scale) + ' ' + 
                (Math.round(endX - (beginNode.hgap + endNode.hgap) / 2) / scale) + ' ' + 
                (endY / scale) + ' ' + 
                (endX / scale) + ' ' + 
                (endY / scale);
            } else {
                return 'M ' + 
                (beginX / scale) + ' ' + 
                (beginY / scale) + 
                "C " +
                (beginX / scale) + ' ' + 
                (Math.round(beginY + (beginNode.vgap + endNode.vgap) / 2) / scale) + ' ' +
                (endX / scale) + ' ' + 
                (Math.round(endY - (beginNode.vgap + endNode.vgap) / 2) / scale) + ' ' +
                (endX / scale) + ' ' + 
                (endY / scale);
            }
        }
        
        return [h("path",
            {
                ns: RenderContext.NS_svg,
                attrs:
                {
                    stroke: linkAttr.lineColor,
                    strokeWidth: 10,
                    strokeLinecap: 'round',
                    fill: 'none',
                    d: getBezierCurveVorH(isHorizontal)
                }
            })];
    }
}