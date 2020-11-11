import { ContextHolder } from '../util/ContextHolder';
import Mousetrap from 'mousetrap';
import { createNewNode, MindData } from '../dataSource/MindData';
import { LayoutManager } from '../layout/LayoutManager';

/**
 * 通过操作创建节点
 */
export class CreateNode extends ContextHolder {
    initialize() {
        Mousetrap.bind("tab", this.eventKeyTab)
    }

    eventKeyTab(event: ExtendedKeyboardEvent, combo: string) {
        event.preventDefault();
        let that = CreateNode.getInstance<CreateNode>();
        let nodeLayer = that.sceneContext.nodeLayer;
        if (nodeLayer.selIdSet.size == 0) {
            return;
        }
        //对每个选择的对象，根据样式，得到基本属性，然后传递去存储
        nodeLayer.selIdSet.forEach((id) => {
            let pAttr = nodeLayer.items.get(id)!;
            let newData: MindData = createNewNode('') as MindData;
            let cAttr = pAttr.addNodeAttrChild(newData);
            nodeLayer.items.set(cAttr.data.id, cAttr);       //添加attr缓存
            that.logger.debug("创建元素", cAttr.data.id, cAttr.data.content);
        });

        LayoutManager.getInstance().markChange();
        
        LayoutManager.getInstance().layout(true);
    }


    destory() {
        Mousetrap.unbind("tab", this.eventKeyTab.bind(this))
    }
}