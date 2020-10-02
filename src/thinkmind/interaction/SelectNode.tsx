import { VNode } from 'snabbdom/build/package/vnode';
import { RenderUtil } from '../render/RenderUtil';
import { ContextHolder } from '../util/ContextHolder';
import { RenderContext, RenderObject } from '../render/RenderContext';
//import Mousetrap from 'mousetrap'


export class SelectNode extends ContextHolder{
    shiftState:boolean = false;
    selectId:string = '';

    initialize(){
        this.shiftState = false;
        document.addEventListener('keydown', this.eventShiftDown.bind(this))   //shift只有down up事件
        document.addEventListener('keyup', this.eventShiftKeyUp.bind(this))
    }

    eventShiftDown(event: KeyboardEvent){
        if(event.key == 'Shift'){
            this.shiftState = true;
        }
    }

    /**
     * 弹起shift键盘事件，
     */
    eventShiftKeyUp(event: KeyboardEvent){
        if(event.key == 'Shift'){
            this.shiftState = false;
        }
    }

    /**
     * 点击的时候设置当前的选择，按住shift，是追加。不是则是添加
     * @param event 
     * @param node 
     */
    eventBorderClick(event: MouseEvent, node:VNode){
        let foreign: any = event.currentTarget;
        let nodeId = RenderUtil.getIdBySel(foreign.id);

        let nodeLayer = this.sceneContext.nodeLayer;

        if(this.shiftState == false){ //如果没有按住shift，只保留之前的id，其他全干掉
            nodeLayer.selIdSet.forEach((id)=>{ //去掉之前的显示状态
                if(id != nodeId){
                    let textarea: HTMLTextAreaElement = document.getElementById(RenderObject.NodeBorder + id) as HTMLTextAreaElement;
                    if(textarea != undefined){
                        textarea.style.stroke = 'none';
                    }
                }
            })
            let isExists = nodeLayer.selIdSet.has(nodeId)
            nodeLayer.selIdSet.clear(); //清理缓存
            if(isExists){
                nodeLayer.selIdSet.add(nodeId); //之前就存在，重新加回去
            }
        }

        if(nodeLayer.selIdSet.has(nodeId) == true){  //之前有，则删除
            nodeLayer.selIdSet.delete(nodeId);
        }else{
            nodeLayer.selIdSet.add(nodeId);//不然则追加起来
        }
    }

    /**
     * 移入的时候，设置边框可见
     * @param event 
     * @param node 
     */
    eventBorderEnter(event: MouseEvent, node:VNode){
        if(this.checkToInner(event)){       //进入时跟内部有关系，
            return ;
        }
        console.log("eventBorderEnter", event, node);
        let foreign: any = event.currentTarget;
        let nodeId = RenderUtil.getIdBySel(foreign.id);
        this.selectId = nodeId;
        let textarea: HTMLTextAreaElement = document.getElementById(RenderObject.NodeBorder + nodeId) as HTMLTextAreaElement;
        textarea.style.stroke = this.sceneContext.nodeLayer.backgroundAttr.highlightColor;  //设置边框颜色
    }

    /**
     * 移出时候，如果没有确定被选择，则取消显示
     * @param event 
     * @param node 
     */
    eventBorderLeave(event: MouseEvent, node:VNode){
        if(this.checkToInner(event)){       //目的是内部，返回
            return ;
        }
        let foreign: any = event.currentTarget;
        let nodeId = RenderUtil.getIdBySel(foreign.id);
        if(this.sceneContext.nodeLayer.selIdSet.has(nodeId) == false){
            let textarea: HTMLTextAreaElement = document.getElementById(RenderObject.NodeBorder + nodeId) as HTMLTextAreaElement;
            textarea.style.stroke = 'none';
        }
    }

    /**
     * 只要有目的为SVGForeignObjectElement 则说明这个移动与内部有关系
     * @param event 
     */
    checkToInner(event: MouseEvent):boolean{
        let src:SVGElement = (event.target|| event.srcElement) as SVGElement;
        let to:SVGElement = event.relatedTarget as SVGElement;
        if((src  && src.localName == "foreignObject") || (to && to.localName == "foreignObject")){
            return true;
        }
        return false;
    }

    destory(){
        document.removeEventListener('keydown', this.eventShiftDown)   //shift只有down up事件
        document.removeEventListener('keyup', this.eventShiftKeyUp)
    }
}