import { TypeUtil } from '../util/TypeUtil';
import { MindData, MindDataInitialize, MindTabType ,createNewNode} from './MindData';
import StorageUtil from './StorageUtil';
import log, {Logger} from 'loglevel';

/**
 * 原则，管理的数据里面都是必须数据，而且可以直接导出的结构数据。
 */
class MindSource {
    logger = log.getLogger('MindSource');

    rootData: MindData;                          //根节点，原生对象，其他数据不应该保存在里面
    ROOT; //保存数据库的根节点
    CURRENT:MindData;
    PRIVATE:MindData;
    TEMP:MindData;           //临时
    SHARE:MindData;          //分享，引用  自己分享给别人的
    RECENT:MindData;           //最近，引用  自动添加，最近使用的
    COLLECT:MindData;        //收藏, 引用, 别人的，不是拷贝的
    MEETING:MindData;

    CURRENT_LIST:MindData[];
    PRIVATE_LIST:MindData[];
    TEMP_LIST:MindData[];           //临时
    SHARE_LIST:MindData[];          //分享，引用  自己分享给别人的
    RECENT_LIST:MindData[];           //最近，引用  自动添加，最近使用的
    COLLECT_LIST:MindData[];        //收藏, 引用, 别人的，不是拷贝的
    MEETING_LIST:MindData[];

    isInit:boolean = false;
    MAX_RECENT:number = 10;

    initialize() {}
    destory() { } 

    async getDefaultRoot(){
        await this.checkLoad();
        return this.CURRENT;
    }

    async checkLoad() {
        if(this.isInit){
            return;
        }
        const openRes = await StorageUtil.openDatabase();
        if (openRes.isNew == true) {
            for(let i=0; i<MindDataInitialize.length; i++){
               await StorageUtil.add(MindDataInitialize[i]);
            }
        }
        this.ROOT = await StorageUtil.query("content", "Root")
        for(let i=0; i<this.ROOT.childs!.length; i++){      //引用和特殊才做缓存
            let typeData = await StorageUtil.get(this.ROOT.childs![i]);
            this[typeData.content] = typeData;
            this[typeData.content + '_LIST'] = await this.getSimpleSubNode(typeData);       //缓存当前的其他引用
        }
        this.checkInitNode();
        this.isInit = true
    }


    /**
     * 添加引用，引用只有父对子对关系，没有子对父的关系，需要去除掉重复的，添加时如果有重复则先删除
     * @param id 
     */
    async addRecent(id:string){
        if(id == this.RECENT.id){       //去掉自身，避免死循环
            return;
        }
        TypeUtil.arrayRemove(this.RECENT.childs, id);       //删除之前的记录
        this.RECENT.childs.push(id);
        if(this.RECENT.childs.length> this.MAX_RECENT){
            this.RECENT.childs.pop();
        }
        await StorageUtil.update(this.RECENT);
    }

    /**
     * 得到节点下所有的下一级子节点
     * @param data 
     */
    async getSimpleSubNode(data:MindData){
        let nodes:MindData[] = []
        for(let i=0; i< data.childs.length; i++){
            let sdata = await StorageUtil.get(data.childs[i]);
            nodes.push(sdata);
        }
        return nodes;
    }

    /**
     * 部分节点如果是初始化状态且里面为空，需要创建初始化节点
     */
    async checkInitNode(){
        let newNodes = ["CURRENT", "PRIVATE", "TEMP"]
        for(let i=0; i<newNodes.length; i++){
            let newNodeName = newNodes[i];
            let docNode = this[newNodeName] as MindData;
            if(docNode.childs.length == 0){
                let newNode = createNewNode("新主题")
                newNode.pid = docNode.id;               //关系需要在添加函数之前建立
                docNode.childs.push(newNode.id);
                await this.addSubNode(docNode, newNode);
            }
        }
    }


    async addSubNode(p:MindData, c:MindData){
        await StorageUtil.add(c);
        await StorageUtil.update(p);
    }

    /**
     * 彻底删除子节点以及后续的其他节点
     * @param p 
     * @param c 
     */
    async removeSubNode(p:MindData, c:MindData){
        await StorageUtil.update(p);        //更新父节点
        
        let subs:string[] = [], delIds:string[] = [];
        subs.push(c.id);
        let id:string;
        while(id = subs.pop()!){
            let s = await StorageUtil.get(id);
            subs = subs.concat(s.childs);
            let delId = await StorageUtil.remove(id);   //删除子节点
            delIds.push(delId);
        }
        return delIds;
    }


    async getParentPath() {
        let id: string | undefined = 'this.currRootId;'
        if (id == undefined || id == this.rootData.id) {
            return [];
        }
        let paths: MindData[] = [];
        while (true) {
            let node = await StorageUtil.get(id!)
            id = node.pid;
            paths.push(node);
            if (node.pid == this.rootData.id) {
                break;
            }
        }
        return paths.reverse();
    }
 

    async getSubTreeByDepth(id:string, depth:number){
        depth--;
        let childNodes:Map<string, MindData> = new Map<string, MindData>();
        var data: MindData = await StorageUtil.get(id);
        childNodes.set(data.id, data); 
        if(depth >0 ){
            data.isSubVisible = true;
            let list = await this.visibleSubTreeByDepth(data, depth);
            list.forEach((item)=>{
                childNodes.set(item.id, item);
            })
        }else{
            data.isSubVisible = false;
        }
        this.logger.debug(childNodes.values());
        return childNodes;
    } 

    async visibleSubTreeByDepth(data: MindData, depth: number) {
        let childNodes:MindData[] = [];
        depth--;
        for(let i=0; i<data.childs.length; i++){
            var child: MindData = await StorageUtil.get(data.childs[i]);
            childNodes.push(child);
            if (depth > 0) {
                child.isSubVisible = true; 
                let ccnodes = await this.visibleSubTreeByDepth(child, depth);
                childNodes = childNodes.concat(ccnodes);
            }else{
                child.isSubVisible = false;
            }
        }
        return childNodes;
     }


    async getTabTypeList(tabType:string){
        let tabList:MindData[] = [];
        await this.checkLoad();
        let mindData:MindData = this[tabType];

        for(let i=0; i<mindData.childs.length; i++){
            let node = await StorageUtil.get(mindData.childs[i]);
            tabList.push(node);
        }
        return JSON.parse(JSON.stringify(tabList)); //所有使用icestore的都需要深拷贝
    }


}
export default new MindSource();