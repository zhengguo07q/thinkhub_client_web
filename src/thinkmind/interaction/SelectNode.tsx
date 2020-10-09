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
        document.addEventListener('keydown', this.eventShiftDown)   //shift只有down up事件
        document.addEventListener('keyup', this.eventShiftKeyUp)
    }

    eventShiftDown(event: KeyboardEvent){
        let that = SelectNode.getInstance<SelectNode>();
        if(event.key == 'Shift'){
            that.shiftState = true;
        }
    }

    /**
     * 弹起shift键盘事件，
     */
    eventShiftKeyUp(event: KeyboardEvent){
        let that = SelectNode.getInstance<SelectNode>();
        if(event.key == 'Shift'){
            that.shiftState = false;
        }
    }

    /**
     * 点击的时候设置当前的选择，按住shift，是追加。不是则是添加
     * @param event 
     * @param node 
     */
    eventGroupClick(event: MouseEvent, node:VNode){
        
        let foreign: any = event.currentTarget;
        let nodeId = RenderUtil.getIdBySel(foreign.id);
        this.logger.debug("点击设置元素", nodeId);
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
     * 点击背景，取消所有选择
     * @param event 
     * @param node 
     */
    eventBackgroundClick(event: MouseEvent, node:VNode){
        let nodeLayer = this.sceneContext.nodeLayer;
        this.logger.debug("取消选择的元素", nodeLayer.selIdSet);
        nodeLayer.selIdSet.forEach((id)=>{ //去掉之前的显示状态
            let textarea: HTMLTextAreaElement = document.getElementById(RenderObject.NodeBorder + id) as HTMLTextAreaElement;
            if(textarea != undefined){
                textarea.style.stroke = 'none';
            }
        });
        nodeLayer.selIdSet.clear();
    }

    /**
     * 移入的时候，设置边框可见
     * @param event 
     * @param node 
     */
    eventGroupEnter(event: MouseEvent, node:VNode){
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
    eventGroupLeave(event: MouseEvent, node:VNode){
        let foreign: any = event.currentTarget;
        let nodeId = RenderUtil.getIdBySel(foreign.id);
        if(this.sceneContext.nodeLayer.selIdSet.has(nodeId) == false){
            let textarea: HTMLTextAreaElement = document.getElementById(RenderObject.NodeBorder + nodeId) as HTMLTextAreaElement;
            textarea.style.stroke = 'none';
        }
    }


    destory(){
        document.removeEventListener('keydown', this.eventShiftDown)   //shift只有down up事件
        document.removeEventListener('keyup', this.eventShiftKeyUp)
    }
}