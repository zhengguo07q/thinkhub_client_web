import { NodeAttr } from '../item/NodeAttr';
import { LayoutManager } from '../layout/LayoutManager';
import { ContextHolder } from '../util/ContextHolder';


export class EditorNode extends ContextHolder{
    initialize(){}
    destory(){}

    updateTheme(){
        let nodeLayer = this.sceneContext.nodeLayer;
        nodeLayer.items.forEach((nodeAttr:NodeAttr)=>{
            nodeAttr.updateTheme();
        });

        LayoutManager.getInstance().markChange();
        LayoutManager.getInstance().layout(true);
    }
}