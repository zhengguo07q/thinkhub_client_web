import { ContextHolder } from '../util/ContextHolder';
import { RenderContext, RenderObject} from '../render/RenderContext';
import {SVG, Box} from '@svgdotjs/svg.js'
import  '@svgdotjs/svg.draggable.js'
import { VNode } from 'snabbdom/build/package/vnode';
import { Point } from '../util/Interface';
import { LayoutManager } from '../layout/LayoutManager';
import { NodeAttr } from '../item/NodeAttr';
import { RenderManager } from '../render/RenderManager';
import { ComputeNode } from '../item/ComputeNode';

export class DragNode extends ContextHolder{
    protected isDrag:boolean = false;
    protected svgEle;
    protected lastClick:Point;
    protected lastCheck:Point;
    protected box;
    protected isMouse:boolean;

    protected nodeId:string|undefined;
    protected pos:number;
    protected static MAX_DISTANCE:number = 5;

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
        this.lastCheck = this.lastClick = this.getCoordsFromEvent(ev);

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
        that.logger.debug(Point.distance(currentClick, that.lastCheck));
        if(Point.distance(currentClick, that.lastCheck) > DragNode.MAX_DISTANCE){
            let offset = that.getSvgOffset(currentClick);
            that.showInsertObject(offset);
            that.lastCheck = currentClick;
        }

    }

    /**
     * 显示插入对象位置
     * @param offset 
     */
    showInsertObject(offset:Point){
        let nodeLayer = this.sceneContext.nodeLayer;
        let node = LayoutManager.getInstance().getInserObject(offset);
        let needLayout = false;
        node = this.excludeSelectList(node);
        if(node != undefined){  //不在任何位置
            
            let pos = node.getSubPosition(offset);
            if(node.id)
            if((this.nodeId && this.nodeId!= node.id) || this.pos != pos){
                let nodeAttr:NodeAttr = node.data;
                nodeAttr.addNodeAttrDrag(nodeLayer.items, pos);
                needLayout = true;
                this.nodeId = node.id;
                this.pos = pos;
                this.logger.debug("添加新元素到", nodeAttr.data.content, pos);
            }
        }else{
            if(this.nodeId != undefined){
                this.nodeId = undefined;       //=undefined
                NodeAttr.deleteNodeAttrDrag(nodeLayer.items);
                needLayout = true;
            }
        }
        
        if(needLayout){
            LayoutManager.getInstance().set(nodeLayer.rootItem);
            LayoutManager.getInstance().layout(true);
            this.logger.debug("重新调整布局");
        }
    }

    /**
     * 如果当前对象是选择列表中的节点，不进行拖拽
     * @param node 
     */
    excludeSelectList(node:ComputeNode|undefined):ComputeNode|undefined{
        if(node == undefined){
            return;
        }
        let ret:ComputeNode|undefined = node;
        let nodeLayer = this.sceneContext.nodeLayer;
        nodeLayer.selIdSet.forEach((id:string)=>{
            if(node.id == id){
                ret = undefined;
            }
        });
        return ret;
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
    
    /**
     * 交换节点位置
     */
    exchangeNodePosition(){
        if(this.nodeId == undefined){
            return ;
        }
        let nodeLayer = this.sceneContext.nodeLayer;
        let newParent = nodeLayer.items.get(this.nodeId)!;
        nodeLayer.selIdSet.forEach((id:string)=>{
            let targetAttrNode = nodeLayer.items.get(id)!;
            targetAttrNode.exchangeNodeAttr(nodeLayer.items, newParent, this.pos);
        });
        
    }
        
    endDrag(event:MouseEvent) {
        let that = DragNode.getInstance<DragNode>();
        that.logger.debug("关闭拖动");
        that.drag(event);
        that.exchangeNodePosition();

        const eventMove = (that.isMouse ? 'mousemove' : 'touchmove')
        const eventEnd = (that.isMouse ? 'mouseup' : 'touchend')

        window.removeEventListener(eventMove, that.drag);
        window.removeEventListener(eventEnd, that.endDrag);

        that.destoryElement();
        that.isDrag = false;
    }
    

    destory(){}
}