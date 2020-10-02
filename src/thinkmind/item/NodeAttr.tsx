import { ThemeUtil } from '../config/ThemeUtil';
import { MindData } from '../dataSource/MindData';
import { SceneScreen } from '../scene/SceneScreen';
import { LinkAttr } from './LinkAttr';
import DataCache from '../dataSource/DataCache';

/**
 * 属性指代的是可被人直接操控的属性
 */
export class NodeAttr{
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
    createNodeAttr(newData:MindData) :NodeAttr{
        let topic = ThemeUtil.getSubTopicStyle(this.themeLevel);
        let item: NodeAttr = NodeAttr.fromTheme(topic.contentStyle);
        item.data = newData;
        item.linkAttr = LinkAttr.fromTheme(topic.linkStyle);
        return item;
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
} 