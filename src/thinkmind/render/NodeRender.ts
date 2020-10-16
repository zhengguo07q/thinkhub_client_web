import { ComputeNode } from '../item/ComputeNode';
import { VNode } from 'snabbdom/build/package/vnode';
import { h } from 'snabbdom/build/package/h';

import { NodeAttr } from '@/thinkmind/item/NodeAttr';
import { RenderContext, RenderObject, RenderOrientation } from './RenderContext';
import { EventHelper } from '../util/EventHelper';
import { Color } from '../util/ColorUtil'

/** 
 * 	<g>
        <rect x="100" y="150" rx='8' ry='8' width="180" height="72"   fill="#5e7297">
        </rect>
        <text x="132" y="194" font-family='verdana' font-size='28' line-height='28' font-weight='bold'>中心主题</text>
        <rect x="95" y="145" rx='8' ry='8' width="190" height="82" stroke="#a2d1e4" stroke-width="3" fill="transparent" >
        </rect>
    </g>
 */
enum Orientation {
    left,
    top,
    right,
    bottom,
}
export class NodeRender {
    render(renderContext: RenderContext, computeNode: ComputeNode, isHorizontal: boolean): VNode[] {
        const attr: NodeAttr = computeNode.data

        const x = Math.round(computeNode.x + computeNode.hgap)
        const y = Math.round(computeNode.y + computeNode.vgap)
        const width = Math.round(computeNode.width - computeNode.hgap * 2)
        const height = Math.round(computeNode.height - computeNode.vgap * 2)

        const contentWidth = Math.round(width - 2 * attr.paddingX);
        const contentHeight = Math.round(height - 2 * attr.paddingY);

        let nodes = [
            h("g#" + RenderObject.NodeGroup + attr.data.id, {
                ns: RenderContext.NS_svg,
                attrs: { transform: 'translate(' + x + ' ' + y + ')' },
                on: {
                    mousedown: [EventHelper.eventGroupClick, EventHelper.eventGroupDown],
                    mouseenter: EventHelper.eventGroupEnter,
                    mouseleave: EventHelper.eventGroupLeave,
                }
            }, [
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
                            class: 'nodeBorder',
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
                            fill: attr.background,
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
                            fill: attr.background,
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
        return nodes;
    }

    /**
     * 
     * @param renderContext 
     * @param computeNode 
     * @param isHorizontal 
     * @param refOrientation 
     */
    renderCollapsed(renderContext: RenderContext, beginNode: ComputeNode, isHorizontal: boolean, orientation: RenderOrientation): VNode | undefined {
        const attr: NodeAttr = beginNode.data;
        let beginX: number, beginY: number;
        //算出位置方向
        switch (orientation) {
            case RenderOrientation.LEFT:
                beginX = Math.round(beginNode.x - attr.linkAttr.collapsedOffset);
                beginY = Math.round(beginNode.y + beginNode.height / 2);
                break;
            case RenderOrientation.RIGHT:
                beginX = Math.round(beginNode.x + beginNode.width - beginNode.hgap + attr.linkAttr.collapsedOffset);
                beginY = Math.round(beginNode.y + beginNode.height / 2);
                break;
            case RenderOrientation.TOP:
                beginX = Math.round(beginNode.x + beginNode.width / 2);
                beginY = Math.round(beginNode.y - attr.linkAttr.collapsedOffset);
                break;
            case RenderOrientation.BOTTOM:
                beginX = Math.round(beginNode.x + beginNode.width / 2);
                beginY = Math.round(beginNode.y + beginNode.height - beginNode.vgap + attr.linkAttr.collapsedOffset);
                break;
        }
        let v: VNode | undefined = undefined;
        if (beginNode.isRoot()) {
            return undefined;
        }
        //算出位置
        if (attr.isCollapsed) {
            v = h("g#" + RenderObject.NodeCollapsed + attr.data.id, {
                ns: RenderContext.NS_svg,
                attrs: { transform: 'translate(' + beginX + ' ' + beginY + ')' },
                on:{click:EventHelper.eventCollapsedClickOpen},
            }, [
                h("circle", {
                    attrs: {
                        cx: 0, cy: 0, r: 5,
                    },
                    style: {
                        stroke: attr.linkAttr.lineColor, strokeWidth: '1', fill: renderContext.backgroundAttr.background,
                    },
                    ns: RenderContext.NS_svg,
                }),
                h("text", {
                    attrs: {
                        x: -3, y: 3,
                    },
                    style: {
                        stroke: attr.linkAttr.lineColor, strokeWidth: '1', fill: renderContext.backgroundAttr.background, userSelect:'none' , fontSize: '9', lineHeight: '12', fontWeight:'100'
                    },
                    ns: RenderContext.NS_svg,
                }, [attr.data.childs.length])
            ]);
        } else {
            v = h("g#" + RenderObject.NodeCollapsed + attr.data.id, {
                ns: RenderContext.NS_svg,
                attrs: { transform: 'translate(' + beginX + ' ' + beginY + ')' },
                style: { visibility: 'hidden', },
                on: { click: EventHelper.eventCollapsedClickClose },
            }, [
                h("circle", {
                    attrs: {
                        cx: 0, cy: 0, r: 5,
                    },
                    style: {
                        stroke: attr.linkAttr.lineColor, strokeWidth: '1', fill: renderContext.backgroundAttr.background,
                    },
                    ns: RenderContext.NS_svg,
                }),
                h("line", {
                    attrs: {
                        x1: -4, y1: 0, x2: 4, y2: 0
                    },
                    style: {
                        stroke: attr.linkAttr.lineColor, strokeWidth: '1', fill: renderContext.backgroundAttr.background,
                    },
                    ns: RenderContext.NS_svg,
                })
            ]);
        }

        return v;
    }

    /**
     * 一些辅助性图形
     * @param computeNode 
     */
    renderExts(computeNode: ComputeNode): VNode[] {
        const attr: NodeAttr = computeNode.data
        let exts: VNode[] = [];
        computeNode.showBBox = true;
        if (computeNode.showBBox) {
            let bbox = computeNode.getBoundingBox();
            exts.push(h("rect#" + RenderObject.NodeExt + attr.data.id, {
                attrs:
                {
                    x: bbox.left,
                    y: bbox.top,
                    width: bbox.width - bbox.left,
                    height: bbox.height - bbox.top,
                },
                style: {
                    strokeWidth: '1',
                    stroke: Color.randomColor(),
                    fillOpacity: '0',
                },
                ns: RenderContext.NS_svg
            }));
        }
        return exts;
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