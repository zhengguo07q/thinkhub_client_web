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
                EventManager.dispatcher(EventType.Message, {content:"此节点不允许被删除"})
                return ;
            }
            
            nodeAttr.removeNodeAttrChildAll(nodeLayer.items);
            let pAttr = nodeLayer.items.get(nodeAttr?.data.pid);
            TypeUtil.arrayRemove(pAttr?.data.childs!, nodeAttr); //删除父对象下子对象
        })
        LayoutManager.getInstance().markChange();
        nodeLayer.selIdSet.clear();
        
        let rootComputeNode = LayoutManager.getInstance().layout();
        RenderManager.fastRender(rootComputeNode, nodeLayer.backgroundAttr);
    }

    destory(){
        Mousetrap.unbind("backspace", this.eventKeyDelete.bind(this))
    }
}