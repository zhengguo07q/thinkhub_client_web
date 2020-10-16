import { SceneContext } from '../util/Interface';
import { NodeLayer } from './NodeLayer';
import { AppHistory } from './AppHistory';

import { CopyPaste, CreateNode, DragNode, JsonCreate, SelectNode } from '../interaction'
import { RenderManagerInstance } from '../render/RenderManager';
import { InputContent } from '../interaction/InputContent';
import { MoveScreen } from '../interaction/MoveScreen';
import { DeleteNode } from '../interaction/DeleteNode';
import { SetRootNode } from '../interaction/SetRootNode';
import { EditorNode } from '../interaction/EditorNode';
import DataCache from '../dataSource/DataCache';

import log, {Logger} from 'loglevel'

export class SceneScreen{
    static logger :Logger = log.getLogger("SceneScreen");
    static context: SceneContext;
    /**
     * 全局初始化
     */
    static global(rootElement:HTMLElement){
        this.logger.info("start thinkhub");
        var nodeLayer = new NodeLayer();
        var appHistory = AppHistory.fromState(nodeLayer);
        SceneScreen.context = 
        {
            nodeLayer: nodeLayer, 
            appHistory: appHistory,
            rootElement: rootElement,
        };

        this.interaction();

        RenderManagerInstance.initialize(rootElement);
        this.logger.info("end thinkhub");
        DataCache.setRootDefault();
    }

    /**
     * 初始化交互
     */
    static interaction(){
        InputContent.build(InputContent, SceneScreen.context);
        CopyPaste.build(CopyPaste, SceneScreen.context);
        CreateNode.build(CreateNode, SceneScreen.context);
        JsonCreate.build(JsonCreate, SceneScreen.context);
        SelectNode.build(SelectNode, SceneScreen.context);
        MoveScreen.build(MoveScreen, SceneScreen.context);
        DeleteNode.build(DeleteNode, SceneScreen.context);
        SetRootNode.build(SetRootNode, SceneScreen.context);
        DragNode.build(DragNode, SceneScreen.context);
        EditorNode.build(EditorNode, SceneScreen.context);
    }

    /**
     * 销毁交互资源
     */
    static unteraction(){
        InputContent.build(InputContent, SceneScreen.context).destory;
        CopyPaste.build(CopyPaste, SceneScreen.context).destory();
        CreateNode.build(CreateNode, SceneScreen.context).destory();
        JsonCreate.build(JsonCreate, SceneScreen.context).destory();
        SelectNode.build(SelectNode, SceneScreen.context).destory();
        MoveScreen.build(MoveScreen, SceneScreen.context).destory();
        SetRootNode.build(SetRootNode, SceneScreen.context).destory();
        DragNode.build(DragNode, SceneScreen.context).destory();
        EditorNode.build(EditorNode, SceneScreen.context).destory();
    }


}