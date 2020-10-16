import { NodeAttr } from '../item/NodeAttr';
import { LayoutManager } from '../layout/LayoutManager';
import { RenderManager } from '../render/RenderManager';
import { ContextHolder } from '../util/ContextHolder';
import { EventManager, EventType } from '../util/Event';
import { TypeUtil } from '../util/TypeUtil';

export class DeleteNode extends ContextHolder{
    initialize(){
        Mousetrap.bind("backspace", this.eventKeyDelete.bind(this))
    }

    eventKeyDelete(){
        let nodeLayer = this.sceneContext.nodeLayer;
        if(nodeLayer.selIdSet.size == 0){
            return;
        }
        //删除所有选择的节点，还有选择的节点下面的子节点
        nodeLayer.selIdSet.forEach((id)=>{
            let nodeAttr = nodeLayer.items.get(id)!;
            if(nodeAttr.data.isLock){
                EventManager.dispatcher(EventType.Message, {content: nodeAttr.data.content + " 节点不允许被删除"})
                return ;
            }
            
            let hideNodes = nodeAttr.getHideNode();
            if(hideNodes.length > 0){
                let hidesStr = "";
                hideNodes.forEach((node)=>{
                    hidesStr += node.data.content + ', '
                });
                EventManager.dispatcher(EventType.Dialog, {content: hidesStr + " 节点包含有没有显示的子节点，确认删除？"})
            }
            
            nodeAttr.removeNodeAttrChildAll(nodeLayer.items);
            let pAttr = nodeLayer.items.get(nodeAttr?.data.pid);
            TypeUtil.arrayRemove(pAttr?.data.childs!, nodeAttr); //删除父对象下子对象
        })
        LayoutManager.getInstance().markChange();
        nodeLayer.selIdSet.clear();
        
        LayoutManager.getInstance().layout(true);
    }

    deleteCallback(){

    }

    destory(){
        Mousetrap.unbind("backspace", this.eventKeyDelete.bind(this))
    }
}