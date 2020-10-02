import { ComputeNode } from '../item/ComputeNode';
import { VNode } from 'snabbdom/build/package/vnode';
import { h } from 'snabbdom/build/package/h';
import { NodeAttr } from '@/thinkmind/item/NodeAttr';
import { RenderContext, RenderObject } from './RenderContext';
import { EventHelper } from '../util/EventHelper';

/** 
 * 	<g>
        <rect x="100" y="150" rx='8' ry='8' width="180" height="72"   fill="#5e7297">
        </rect>
        <text x="132" y="194" font-family='verdana' font-size='28' line-height='28' font-weight='bold'>中心主题</text>
        <rect x="95" y="145" rx='8' ry='8' width="190" height="82" stroke="#a2d1e4" stroke-width="3" fill="transparent" >
        </rect>
    </g>
 */
export class NodeRender {
    render(renderContext: RenderContext, computeNode: ComputeNode): VNode[] {
        const attr: NodeAttr = computeNode.data

        const x = Math.round(computeNode.x + computeNode.hgap)
        const y = Math.round(computeNode.y + computeNode.vgap)
        const width = Math.round(computeNode.width - computeNode.hgap * 2)
        const height = Math.round(computeNode.height - computeNode.vgap * 2)

        const contentWidth = Math.round(width - 2 * attr.paddingX);
        const contentHeight = Math.round(height - 2 * attr.paddingY);

        return [
            h("g#" + attr.data.id, { ns: RenderContext.NS_svg, attrs: { transform: 'translate(' + x + ' ' + y + ')' } }, [
                h("rect#" + RenderObject.NodeBorder + attr.data.id,
                    {
                        attrs:
                        {
                            x: '-3',
                            y: '-3',
                            width: width + 6,
                            height: height + 6,
                            rx: renderContext.backgroundAttr.borderRadiusSelect,
                            ry: renderContext.backgroundAttr.borderRadiusSelect,
                        },
                        style: {
                            stroke: 'none',
                            strokeWidth: renderContext.backgroundAttr.borderWidthSelect,
                            fill: 'none',
                        },
                        ns: RenderContext.NS_svg
                    }),
                h("rect#" + RenderObject.NodeRect + attr.data.id,
                    {
                        attrs:
                        {
                            width: width,
                            height: height,
                            rx: attr.borderRadius,
                            ry: attr.borderRadius,
                            stroke: attr.borderColor,
                            fill: attr.background
                        },
                        on:{
                            mouseenter: EventHelper.eventBorderEnter,
                            mouseleave: EventHelper.eventBorderLeave,
                            click: EventHelper.eventBorderClick,
                        },
                        ns: RenderContext.NS_svg
                    }),
                h("foreignObject#" + RenderObject.NodeForeignObject + attr.data.id,
                    {
                        attrs:
                        {
                            x: attr.paddingX,
                            y: attr.paddingY,
                            width: contentWidth,
                            height: contentHeight,
                            stroke: attr.borderColor,
                            fill: attr.background
                        },
                        on:
                        {
                            dblclick: EventHelper.eventForeignDbClick,
                        },
                        ns: RenderContext.NS_svg
                    }, [
                    h("div#" + RenderObject.NodeTextarea + attr.data.id,
                        {
                            style: NodeRender.getTextStyleObject(attr, {}),
                            attrs:
                            {
                                width: contentWidth,
                                height: contentHeight,
                                contentEditable: "false",
                            },
                            on:
                            {
                                focus: EventHelper.eventTextareaFocus,
                                input: EventHelper.eventTextareaInput,
                                blur: EventHelper.eventTextareaBlur
                            },
                        }, attr.data.content)
                ])])];
    }

    /**
     * 获得文本域的样式对象
     * @param attr 
     */
    static getTextStyleObject(attr: NodeAttr, object: any): any {
        return Object.assign({ //white-space: pre-wrap; word-break: break-word; pointer-events: none; user-select: none;
            resize: 'none',
            border: '0 none',
            backgroundColor: attr.background,
            color: attr.color,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            pointerEvents: 'none',
            userSelect: 'none',
            fontFamily: attr.fontFamily,
            fontSize: attr.fontSize,
            fontWeight: attr.fontWeight,
            outline: 'none',
        }, object);
    }
}