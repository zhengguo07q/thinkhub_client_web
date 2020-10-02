import { SceneContext } from '../util/Interface';
import { NodeLayer } from '../layer/NodeLayer';
import { AppHistory } from './AppHistory';

import { CopyPaste, DragNode, CreateNode, JsonCreate, SelectNode } from '../interaction'
import  MindSource  from '../dataSource/MindSource';
import { RenderManager } from '../render/RenderManager';
import { InputContent } from '../interaction/InputContent';
import { MoveScreen } from '../interaction/MoveScreen';
import { DeleteNode } from '../interaction/DeleteNode';
import { SetRootNode } from '../interaction/SetRootNode';
import { BackgroundAttr } from '../item/BackgoundAttr';
import DataCache from '../dataSource/DataCache';

export class SceneScreen{
    static context: SceneContext;
    /**
     * 全局初始化
     */
    static global(rootElement:HTMLElement){
        var nodeLayer = new NodeLayer();
        var appHistory = AppHistory.fromState(nodeLayer);
        SceneScreen.context = 
        {
            nodeLayer: nodeLayer, 
            appHistory: appHistory,
            rootElement: rootElement,
        };

        this.interaction();

        MindSource.initialize();
        RenderManager.initialize(rootElement);
        setTimeout(()=>{DataCache.setRootDefault(), 1000});
    }

    /**
     * 初始化交互
     */
    static interaction(){
        InputContent.build(InputContent, SceneScreen.context);
        CopyPaste.build(CopyPaste, SceneScreen.context);
       // DragNode.build<DragNode>(DragNode, this.sceneContext);
        CreateNode.build(CreateNode, SceneScreen.context);
        JsonCreate.build(JsonCreate, SceneScreen.context);
        SelectNode.build(SelectNode, SceneScreen.context);
        MoveScreen.build(MoveScreen, SceneScreen.context);
        DeleteNode.build(DeleteNode, SceneScreen.context);
        SetRootNode.build(SetRootNode, SceneScreen.context);
    }

    /**
     * 销毁交互资源
     */
    static unteraction(){
        InputContent.build(InputContent, SceneScreen.context).destory;
        CopyPaste.build(CopyPaste, SceneScreen.context).destory();
      //  DragNode.build<DragNode>(DragNode, this.sceneContext).destory();
        CreateNode.build(CreateNode, SceneScreen.context).destory();
        JsonCreate.build(JsonCreate, SceneScreen.context).destory();
        SelectNode.build(SelectNode, SceneScreen.context).destory();
        MoveScreen.build(MoveScreen, SceneScreen.context).destory();
        SetRootNode.build(SetRootNode, SceneScreen.context);
    }


}