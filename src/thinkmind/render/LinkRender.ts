import { ComputeNode } from '../item/ComputeNode';
import { VNode } from 'snabbdom/build/package/vnode';
import { h } from 'snabbdom/build/package/h';
import { NodeAttr } from '@/thinkmind/item/NodeAttr';
import { LinkAttr } from '@/thinkmind/item/LinkAttr';
import { RenderContext,RenderObject } from './RenderContext';
import { EventHelper } from '../util/EventHelper';
import { LinkPositionType } from '../config/Theme'

export class LinkRender  {
    render(renderContext:RenderContext, rootNode: ComputeNode, childNode: ComputeNode, isHorizontal:boolean, scale:number=1): VNode{
        let attrNode: NodeAttr = rootNode.data;
        let linkAttr: LinkAttr = attrNode.linkAttr;

        let beginNode:ComputeNode = rootNode;
        let endNode:ComputeNode = childNode;
        let beginX:number, beginY:number;
        let endX:number, endY:number;

        if (isHorizontal) {                     //水平
            if (rootNode.x > childNode.x) {     //根在右边， 交换位置
                beginNode = childNode;
                endNode = rootNode;
            }
            beginX = Math.round(beginNode.x + beginNode.width - beginNode.hgap);
            if(beginNode.data.linkPos == LinkPositionType.axisCenter){
                beginY = Math.round(beginNode.y + beginNode.height / 2); 
            }else if(beginNode.data.linkPos == LinkPositionType.baseLine){
                beginY = Math.round(beginNode.y + beginNode.height - beginNode.vgap);  //要去掉一个gap
            }
            endX = Math.round(endNode.x + endNode.hgap);

            if(endNode.data.linkPos == LinkPositionType.axisCenter){
                endY = Math.round(endNode.y + endNode.height / 2);
            }else if(endNode.data.linkPos == LinkPositionType.baseLine){
                endY = Math.round(endNode.y + endNode.height - endNode.vgap);
            }
            
        } else {                                //垂直
            if (rootNode.y > childNode.y) {     //根在下面，交换位置
                beginNode = childNode;
                endNode = rootNode;
            }

            beginX = Math.round(beginNode.x + beginNode.width / 2);
            beginY = Math.round(beginNode.y + beginNode.height - beginNode.vgap);
            endX = Math.round(endNode.x + endNode.width / 2);
            endY = Math.round(endNode.y + endNode.vgap);
        }
        //是根节点，则连接点在中间
        if (beginNode.isRoot()) {
            beginX = Math.round(beginNode.x + beginNode.width / 2);
            beginY = Math.round(beginNode.y + beginNode.height / 2);
        }
        if (endNode.isRoot()) {
            endX = Math.round(endNode.x + endNode.width / 2);
            endY = Math.round(endNode.y + endNode.height / 2);
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

        return h("path#"+ RenderObject.NodeLine + attrNode.data.id,
            {
                ns: RenderContext.NS_svg,
                attrs:
                {
                    stroke: linkAttr.lineColor,
                    strokeWidth: linkAttr.lineWidth,
                    strokeLinecap: 'round',
                    fill: 'none',
                    d: getBezierCurveVorH(isHorizontal)
                },
                
            });
    }

    /**
     * 把链接和折叠按钮合并组，用于触发事件
     * @param list 
     */
    wrapperGroupLinkAndCollapsed(node:ComputeNode, list:VNode[]){
        let attr:NodeAttr = node.data;
        if(attr.isCollapsed){
            return h("g#" + RenderObject.NodeGroupLinkAndCollapsed + node.id, {
                ns:RenderContext.NS_svg,
                style:{pointerEvents:"bounding-box",},  //边界盒触发事件
            }, list);
        }else{
            return h("g#" + RenderObject.NodeGroupLinkAndCollapsed + node.id, {
                ns:RenderContext.NS_svg,
                on:{
                    mouseenter: EventHelper.eventLineEnter,
                    mouseleave: EventHelper.eventLineLeave,
                },
                style:{pointerEvents:"bounding-box",},  //边界盒触发事件
            }, list);
        }

    }
}