import { TopicStyle } from '../config/Theme';
import { NodeAttr } from '../item/NodeAttr';
import { ContextHolder } from '../util/ContextHolder';
import Mousetrap from 'mousetrap';
import { ThemeUtil } from '../config/ThemeUtil';
import { UUID } from '../util/MathUtil';
import { LinkAttr } from '../item/LinkAttr';
import { createNewNode, MindData } from '../dataSource/MindData';
import DataCache from '../dataSource/DataCache';
import { LayoutManager } from '../layout/LayoutManager';
import { RenderManager } from '../render/RenderManager';

/**
 * 通过操作创建节点
 */
export class CreateNode extends ContextHolder {
    initialize() {
        Mousetrap.bind("tab", this.eventKeyTab.bind(this))
    }

    eventKeyTab(event: ExtendedKeyboardEvent, combo: string) {
        let nodeLayer = this.sceneContext.nodeLayer;
        if (nodeLayer.selIdSet.size == 0) {
            return;
        }
        //对每个选择的对象，根据样式，得到基本属性，然后传递去存储
        nodeLayer.selIdSet.forEach((id) => {
            let pAttr = nodeLayer.items.get(id)!;
            let newData: MindData = createNewNode('') as MindData;
            let cAttr = pAttr.addNodeAttrChild(newData);
            nodeLayer.items.set(cAttr.data.id, cAttr);       //添加attr缓存
        });

        LayoutManager.getInstance().markChange();
        
        let rootComputeNode = LayoutManager.getInstance().layout();
        RenderManager.fastRender(rootComputeNode, nodeLayer.backgroundAttr);
    }


    destory() {
        //   this.sceneContext.rootElement.removeEventListener("click", this.listener)
    }
}