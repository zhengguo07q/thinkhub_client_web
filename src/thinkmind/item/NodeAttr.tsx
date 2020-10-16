import { ThemeManagerInstance } from '../config/ThemeManager';
import { SceneScreen } from '../scene/SceneScreen';
import { LinkAttr } from './LinkAttr';
import DataCache from '../dataSource/DataCache';
import { createNewNode, MindData } from '../dataSource/MindData';
import { TypeUtil } from '../util/TypeUtil';
import { ThemeType, TopicStyle } from '../config/Theme';
import log, {Logger} from 'loglevel';

/**
 * 属性指代的是可被人直接操控的属性
 */
export class NodeAttr{
    static logger:Logger = log.getLogger("NodeAttr");
    static dragNode:NodeAttr|undefined;               //拖拽节点，如果之前有，需要删除

    data:MindData;
    isCollapsed:boolean = false;            //是否闭合

    nodeType:string = 'Rectangle';              //节点渲染类型

    marginH:number = 5;                    //边距水平
    marginV:number = 5;                    //边距垂直

    border:string = '0px';                    //边框
    borderRadius:string = '5';              //边角
    borderWidth: string = '1';               //边宽
    borderStyle: string = 'none';              //边框样式
    borderColor: string = '#ffffff';           //边框颜色

    paddingX:number = 0;
    paddingY:number = 0;

    background: string = '#a2d1e4';            //背景色

    width: number = 42;                         //宽
    height: number = 42;                        //高

    color: string = '#54616b';                  //颜色
    fontFamily: string = 'verdana';             //字体类型
    fontSize: string = '18px';                  //字体大小
    lineHeight: string = '18px';                //行高
    fontWeight: string = '';                     //粗体

    themeLevel: number = 3;                  //主题类型级别
    isTemp:boolean = false;                 //是否为临时节点

    linkAttr: LinkAttr;     //链接属性

    static fromTheme(object:any):NodeAttr{
        let attr = new NodeAttr();
        return Object.assign(attr, object);
    }


    /**
     * 对所有的节点执行回调函数
     * @param callback 
     */
    eachNode(callback: Function) {
        var nodes: NodeAttr[] = [this];
        var current: NodeAttr;
        while (current = nodes.pop()!) {
            callback(current)
            var ids = current.data.childs;
            for(var i=0;i<ids.length; i++){
                var id = ids[i];
                var node = SceneScreen.context.nodeLayer.items.get(id);
                if(node == undefined){
                    continue;
                }
                nodes.push(node);
            }
        }
    }

    /**
     * 根据父节点创建子节点
     * @param pAttr 
     */
    createNodeAttr(newData:MindData, topic?:TopicStyle) :NodeAttr{
        topic = topic || ThemeManagerInstance.getSubTopicStyle(this.themeLevel);
        let item: NodeAttr = NodeAttr.fromTheme(topic.contentStyle);
        newData.content = topic.contentStyle.content;
        item.data = newData;
        item.linkAttr = LinkAttr.fromTheme(topic.linkStyle);
        return item;
    } 

    /**
     * 添加一个拖拽节点到显示中，永远只存在一个拖拽节点
     * @param refItems 
     */
    addNodeAttrDrag(refItems: Map<string, NodeAttr>, pos:number){
        if(NodeAttr.dragNode != undefined && NodeAttr.dragNode.data.id != this.data.id){        //不是子对象，需要销毁重新构建
            let dragData = NodeAttr.dragNode.data;
            let pNode = refItems.get(dragData.pid)!;                    //获得父节点
            NodeAttr.logger.debug("删除之前的", pNode.data.childs, dragData.id);
            TypeUtil.arrayRemove(pNode.data.childs, dragData.id);       //从父中删除
            refItems.delete(NodeAttr.dragNode.data.id);                 //删除之前的 
            NodeAttr.logger.debug("删除之前的", pNode.data.childs, dragData.id);       
            NodeAttr.dragNode = undefined;
        }
        let newData: MindData = createNewNode('得到') as MindData;
        let topic = ThemeManagerInstance.getTheme().aloneTopic;
        NodeAttr.dragNode = this.createNodeAttr(newData, topic);
        NodeAttr.dragNode.isTemp = true;
        TypeUtil.arrayInsert(this.data.childs, pos, NodeAttr.dragNode.data.id); //插入到父特定位置
        NodeAttr.dragNode.data.pid = this.data.id;
        refItems.set(NodeAttr.dragNode.data.id, NodeAttr.dragNode);
    }

    /**
     * 删除拖拽节点
     * @param refItems 
     */
    static deleteNodeAttrDrag(refItems: Map<string, NodeAttr>){
        if(NodeAttr.dragNode != undefined ){        //不是子对象，需要销毁重新构建
            let dragData = NodeAttr.dragNode.data;
            let pNode = refItems.get(dragData.pid)!;                    //获得父节点
            this.logger.debug("删除之前的", pNode.data.childs, dragData.id);
            TypeUtil.arrayRemove(pNode.data.childs, dragData.id);       //从父中删除
            refItems.delete(NodeAttr.dragNode.data.id);                 //删除之前的 
            this.logger.debug("删除之前的", pNode.data.childs, dragData.id);       
            NodeAttr.dragNode = undefined;
        }
    }

    /**
     * 存储返回调用, 添加子节点
     * @param newData 
     */
    addNodeAttrChild(newData:MindData):NodeAttr{
        let cAttr = this.createNodeAttr(newData);
        this.data.childs.push(cAttr.data.id);
        cAttr.data.pid = this.data.id;
        
        DataCache.addNode(this.data.id, newData);    //异步添加到存储
        return cAttr;
    }

    /**
     * 删除子节点，只要有关联的后续统一在这里删除，不使用eachNode
     * @param newData 
     */
    removeNodeAttrChildAll(refItems: Map<string, NodeAttr>){
        let ids:string[] = [];
        ids.push(this.data.id);
        let id:string;
        while(id = ids.pop()!){
            let node = refItems.get(id)!;
            if(node == undefined){
                continue;
            }
            ids = ids.concat(node.data.childs);
            refItems.delete(id);
        }
        DataCache.removeNode(this.data.pid, this.data);    //异步添加到存储
    }

    /**
     * 更新节点数据
     * @param content 
     */
    updateConent(content:string){
        this.data.content = content;
        DataCache.updateNode(this.data);
    }

    /**
     * 更新主题
     */
    updateTheme(){
        let style = ThemeManagerInstance.getTopicStyle(this.themeLevel);

        Object.assign(this, style.contentStyle);
        Object.assign(this.linkAttr, style.linkStyle);
    }

    /**
     * 交换父节点
     * @param refItems 
     * @param newParent 
     * @param pos 
     */
    exchangeNodeAttr(refItems: Map<string, NodeAttr>, newParent:NodeAttr, pos:number){
        let oldParent = refItems.get(this.data.pid)!;
        TypeUtil.arrayRemove(oldParent.data.childs, this.data.id);  //把原来的父引用删除
        this.data.pid = newParent.data.id;
        TypeUtil.arrayInsert(newParent.data.childs, pos, this.data.id); //把新的引用插入到特定位置

        DataCache.exchangeNode(newParent.data.id, this.data.id, pos);
    }

    /**
     * 得到含有隐藏节点的列表
     */
    getHideNode():NodeAttr[]{
        let hides:NodeAttr[] = [];
        this.eachNode((node:NodeAttr)=>{
            if(node.data.isSubVisible == false && node.data.childs.length>0){ //子对象不显示而且含有子对象
                hides.push(node);
            }
        })
        return hides;
    }
} 