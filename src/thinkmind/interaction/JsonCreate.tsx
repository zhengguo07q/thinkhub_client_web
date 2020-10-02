import { ThemeUtil } from '../config/ThemeUtil';
import { NodeAttr } from '../item/NodeAttr';
import { ContextHolder } from '../util/ContextHolder';
import { MindData } from '../dataSource/MindData';
import LoadAction from '../action/LoadAction';
import { ComputeNode } from '../item/ComputeNode';
import { RenderManager } from '../render/RenderManager';
import { NodeAlgoAttr } from '../item/NodeAlgoAttr';
import { LinkAttr } from '../item/LinkAttr';
import { EventManager, EventType } from '../util/Event';
import { LayoutManager, LayoutType } from '../layout/LayoutManager';
import { BackgroundAttr } from '../item/BackgoundAttr';

/**
 * 根据json文件创建节点
 */
export class JsonCreate extends ContextHolder{

    initialize(){}
 
    /**
     * 创建节点
     * @param mindMap 
     */
    create(rootId:string, tree:Map<string, MindData>){
        var depth:number = 1;
        let nodeLayer = this.sceneContext.nodeLayer;
        nodeLayer.items.clear();

        var attrNode:NodeAttr = this.createSubNode(rootId, tree, depth++);
        nodeLayer.rootItem = attrNode;

        nodeLayer.backgroundAttr = BackgroundAttr.fromJs(ThemeUtil.getTheme());
        nodeLayer.backgroundAttr.setElement(this.sceneContext.rootElement);
        this.render();
        EventManager.dispatcher(EventType.CreateJsonComplete);
    }


    render(){
     //   this.sceneContext.appHistory.apply(new LoadAction(this.sceneContext.nodeLayer));
        let nodeLayer = this.sceneContext.nodeLayer;
        LayoutManager.getInstance().set(nodeLayer.rootItem, NodeAlgoAttr.build(), nodeLayer.backgroundAttr);
        LayoutManager.getInstance().setLayoutType(LayoutType.RightLogical);
        LayoutManager.getInstance().markChange();
        var rootComputeNode:ComputeNode = LayoutManager.getInstance().layout();
       // console.log("rootComputeNode", rootComputeNode);
       RenderManager.fastRender(rootComputeNode, nodeLayer.backgroundAttr);
    }

    /**
     * 迭代创建子节点, 创建自身和子线条
     * @param item 
     * @param mindMap 
     * @param level 
     */
    createSubNode(rootId:string, treeMap:Map<string, MindData>, depth:number): NodeAttr{
        //创建属性对象
        let topic = ThemeUtil.getTopicStyle(depth);
        let item:NodeAttr = NodeAttr.fromTheme(topic.contentStyle);
        let md = treeMap.get(rootId)!;

        item.data = md;
        item.themeLevel = depth;
        item.linkAttr = LinkAttr.fromTheme(topic.linkStyle);
        this.sceneContext.nodeLayer.items.set(item.data.id, item);   //缓存

        depth++;
        //创建属性子对象
        if(md.isSubVisible == true){
            md.childs.forEach((childId)=>{
                let smd = treeMap.get(childId)!;
                this.createSubNode(smd.id, treeMap, depth);
            });
        }

        return item;
    }


    destory(){}
}