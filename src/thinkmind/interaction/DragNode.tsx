import { ContextHolder } from '../util/ContextHolder';
import { RenderContext, RenderObject} from '../render/RenderContext';
import {SVG, Box} from '@svgdotjs/svg.js'
import  '@svgdotjs/svg.draggable.js'
import { VNode } from 'snabbdom/build/package/vnode';
import { Point } from '../util/Interface';
import { LayoutManager } from '../layout/LayoutManager';
import { NodeAttr } from '../item/NodeAttr';
import { ComputeNode } from '../item/ComputeNode';

export class DragNode extends ContextHolder{
    protected isDrag:boolean = false;
    protected svgEle;
    protected lastClick:Point;
    protected lastCheck:Point;
    protected box;
    protected isMouse:boolean;

    protected lastHitNodeId:string|undefined;
    protected lastInsertPosition:number;
    protected lastInsertNodeId:string|undefined;
    protected currentExcludeSelectList:string[]|undefined;
    protected static MAX_DISTANCE:number = 5;

    initialize(){
    }


    onStartDrag(ev:MouseEvent, n:VNode) {
        if(this.isDrag == true || this.sceneContext.nodeLayer.selIdSet.size == 0){
            return;
        }
        this.logger.debug("开启拖动");
        this.isDrag = true;
        this.isMouse = !ev.type.indexOf('mouse')   //  判断是鼠标还是触摸

        // Check for left button
        if (this.isMouse && ev.which !== 1 && ev.buttons !== 0) {
            return
        }

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
        let list = this.svgEle.find('.nodeBorder'); //取消掉元素掉边框
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
        if(Point.distance(currentClick, that.lastCheck) > DragNode.MAX_DISTANCE){
            let offset = that.getSvgOffset(currentClick);
            that.showInsertObject(offset);
            that.lastCheck = currentClick;
        }
    }

    /**
     * 获得当前点击位置相对在svg容器中的相对偏移
     * @param currentClick 
     */
    getSvgOffset(currentClick:Point){
        let svgContainer = document.querySelector("#" + RenderContext.SVG_ID) as SVGSVGElement;
        let boundRect = svgContainer.getBoundingClientRect();     
        let offsetLeft =  boundRect.left;
        let offsetTop = boundRect.top;

        //点击位置-左边不包含的区域
        let x = currentClick.x - offsetLeft;
        let y = currentClick.y - offsetTop;
        return {x:x, y:y};
    }

    /**
     * 如果当前对象是选择列表中的节点或者子节点中，不进行拖拽
     * @param node 
     */
    excludeSelectList(node:ComputeNode|undefined):ComputeNode|undefined{
        if(node == undefined){  
            return;
        }
        let nodeLayer = this.sceneContext.nodeLayer;

        if(this.currentExcludeSelectList == undefined){
            
            let excludeSelectList:string[] = [];
            nodeLayer.selIdSet.forEach((id:string)=>{ //获得所有选择的子节点列表
                let node = nodeLayer.items.get(id)!;
                excludeSelectList = excludeSelectList.concat(node.eachNodeGetNodeAllIds());
            });
            this.currentExcludeSelectList = excludeSelectList;
        }

        if(this.currentExcludeSelectList.indexOf(node.data.id) < 0){    //没有点到被选择的元素或者子元素
            return node;
        }
        return;
    }

    /**
     * 显示插入对象位置
     * @param offset 
     */
    showInsertObject(offset:Point){
        let nodeLayer = this.sceneContext.nodeLayer;
        let needLayout = false;

        let hitNode = LayoutManager.getInstance().getHitNode(offset);  //这个节点的父节点才是
        hitNode = this.excludeSelectList(hitNode);

        if(hitNode == undefined && this.lastHitNodeId != undefined){           //没有命中节点或者命中了被选的节点和它的子节点
            this.lastHitNodeId = undefined;       //=undefined
            this.lastInsertNodeId = undefined;
            NodeAttr.deleteNodeAttrDrag(nodeLayer.items);
            needLayout = true;
        }

        if(hitNode != undefined){
            let addchildNode = nodeLayer.items.get(hitNode!.id)!;
            //如果是移动到了根节点上
            let addParentNode = nodeLayer.items.get(addchildNode.data.pid);
            let insertPosition:number;
            if(addParentNode != undefined){
                insertPosition = addParentNode.getChildPosition(hitNode!.id)    //找出元素位置
            }else{
                addParentNode = nodeLayer.rootItem;
                insertPosition = addParentNode.data.childs.length;
            }
    
            if((this.lastHitNodeId && this.lastHitNodeId!= hitNode!.id) || this.lastInsertPosition != insertPosition){
                addParentNode.addNodeAttrDrag(nodeLayer.items, insertPosition);
                needLayout = true;
                this.logger.debug("添加新元素到", addParentNode.data.content, this.lastInsertPosition, insertPosition);
                this.lastHitNodeId = hitNode!.id;
                this.lastInsertPosition = insertPosition;
                this.lastInsertNodeId = addParentNode.data.id;
            }
        }
        
        if(needLayout){
            LayoutManager.getInstance().set(nodeLayer.rootItem);
            LayoutManager.getInstance().layout(true);
            this.logger.debug("重新调整布局");
        }
    }



    /**
     * 得到鼠标位置坐标
     * @param ev 
     */
    getCoordsFromEvent(event){
        if (event.changedTouches) {
            event = event.changedTouches[0]
        }
        return Point.from(event.clientX, event.clientY);
    }
    
    /**
     * 交换节点位置
     */
    exchangeNodePosition(){
        if(this.lastInsertNodeId == undefined){
            return ;
        }
        let nodeLayer = this.sceneContext.nodeLayer;
        NodeAttr.deleteNodeAttrDrag(nodeLayer.items);

        let newParent = nodeLayer.items.get(this.lastInsertNodeId)!;
        nodeLayer.selIdSet.forEach((id:string)=>{
            let targetAttrNode = nodeLayer.items.get(id)!;
            targetAttrNode.exchangeNodeAttr(nodeLayer.items, newParent, this.lastInsertPosition);
            targetAttrNode.eachNodeUpdateTheme();
        });
        
        LayoutManager.getInstance().set(nodeLayer.rootItem);
        LayoutManager.getInstance().layout(true);
    }

        
    endDrag(event:MouseEvent) {
        let that = DragNode.getInstance<DragNode>();
        that.logger.debug("关闭拖动");
        that.drag(event);
        that.exchangeNodePosition();

        this.currentExcludeSelectList = undefined;
        this.lastInsertPosition = 0;
        this.lastHitNodeId = undefined;
        this.lastInsertNodeId = undefined;

        const eventMove = (that.isMouse ? 'mousemove' : 'touchmove')
        const eventEnd = (that.isMouse ? 'mouseup' : 'touchend')

        window.removeEventListener(eventMove, that.drag);
        window.removeEventListener(eventEnd, that.endDrag);
        
        that.destoryElement();
        that.isDrag = false;
    }
    

    destory(){}
}