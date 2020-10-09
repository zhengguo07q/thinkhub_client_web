import { ContextHolder } from '../util/ContextHolder';
import { RenderContext, RenderObject} from '../render/RenderContext';
import {SVG, Box} from '@svgdotjs/svg.js'
import  '@svgdotjs/svg.draggable.js'
import { VNode } from 'snabbdom/build/package/vnode';
import { Point } from '../util/Interface';
import { LayoutManager } from '../layout/LayoutManager';
import { ComputeNode } from '../item/ComputeNode';

export class DragNode extends ContextHolder{
    protected isDrag:boolean = false;
    protected svgEle;
    protected lastClick:Point;
    protected box;
    protected isMouse:boolean;

    protected node:ComputeNode;
    protected pos:number;

    initialize(){
    }


    onStartDrag(ev:MouseEvent, n:VNode) {
        if(this.isDrag == true){
            return;
        }
        this.logger.debug("开启拖动");
        this.isDrag = true;
        this.isMouse = !ev.type.indexOf('mouse')   //  判断是鼠标还是触摸

        // Check for left button
        if (this.isMouse && ev.which !== 1 && ev.buttons !== 0) {
            return
        }
        ev.preventDefault()
        ev.stopPropagation()


      //  this.box = this.el.bbox()
        this.lastClick = this.getCoordsFromEvent(ev);

        const eventMove = (this.isMouse ? 'mousemove' : 'touchmove')
        const eventEnd = (this.isMouse ? 'mouseup' : 'touchend')

        // Bind drag and end events to window
        window.addEventListener(eventMove, this.drag);
        window.addEventListener(eventEnd, this.endDrag);

        this.copyElement(n);
    }

    /**
     * 拷贝节点到里面元素，暂时添加，不需要加入到左侧
     * @param vnode 
     */
    copyElement(vnode:VNode){
        this.logger.debug("创建拷贝");
        let svgContainer = document.querySelector("#" + RenderContext.SVG_ID) as SVGSVGElement;
        let container = document.createElementNS(RenderContext.NS_svg, "g");
        let contentHtml ="";

        this.sceneContext.nodeLayer.selIdSet.forEach((id)=>{
            let svgEle:SVGGElement = document.querySelector("#" + RenderObject.NodeGroup + id)! as SVGGElement;
            contentHtml += svgEle.outerHTML;
        });

        container.innerHTML = contentHtml;
        svgContainer.appendChild(container);
        this.svgEle = SVG(container);
        let list = this.svgEle.find('.nodeBorder');
        list.css({stroke:'none'});
            
        this.box = this.svgEle.bbox();
    }

    /**
     * 销毁元素
     */
    destoryElement(){
        this.logger.debug("销毁拷贝");
        this.svgEle.remove();
        this.svgEle = undefined;
    }

    /**
     * 拖动元素
     * @param event 
     */
    drag(event:MouseEvent) {
        let that = DragNode.getInstance<DragNode>();
        const currentClick = that.getCoordsFromEvent(event);
        const dx = currentClick.x - that.lastClick.x
        const dy = currentClick.y - that.lastClick.y
        if (!dx && !dy) return ;

        const x = that.box.x + dx;
        const y = that.box.y + dy;
        that.box = new Box(x, y, that.box.w, that.box.h)

        that.lastClick = currentClick;
        that.svgEle.move(x, y);
        let offset = that.getSvgOffset(currentClick);
        
        let node = LayoutManager.getInstance().getInserObject(offset);
        let pos = node.getSubPosition(offset);

        let nodeLayer = that.sceneContext.nodeLayer;

        if(that.node != node && that.pos != pos){
            let nodeAttr = nodeLayer.items.get(node.id)!;
            nodeAttr.addNodeAttrDrag(nodeLayer.items, pos);
    
            LayoutManager.getInstance().layout();
            that.node = node;
            that.pos = pos;
        }
    }

    /**
     * 获得相对偏移
     */
    getSvgOffset(currentClick){
        let svgContainer = document.querySelector("#" + RenderContext.SVG_ID) as SVGSVGElement;

        let boundRect = svgContainer.getBoundingClientRect();     
        let offsetLeft =  boundRect.left;
        let offsetTop = boundRect.top;

        //点击位置-左边不包含的区域
        let x = currentClick.x - offsetLeft;
        let y = currentClick.y - offsetTop;
       // this.logger.debug("boundRect", boundRect,  "xy", x, y);
        return {x:x, y:y};
    }

    /**
     * 得到鼠标位置坐标
     * @param ev 
     */
    getCoordsFromEvent(ev){
        if (ev.changedTouches) {
            ev = ev.changedTouches[0]
        }
        return { x: ev.clientX, y: ev.clientY }
    }
    
        
    endDrag(event:MouseEvent) {
        let that = DragNode.getInstance<DragNode>();
        that.logger.debug("关闭拖动");
        that.drag(event)

        const eventMove = (that.isMouse ? 'mousemove' : 'touchmove')
        const eventEnd = (that.isMouse ? 'mouseup' : 'touchend')

        window.removeEventListener(eventMove, that.drag);
        window.removeEventListener(eventEnd, that.endDrag);

        that.destoryElement();
        that.isDrag = false;
    }
    

    destory(){}
}