import MindSource from './MindSource';
import { MindData, MindTabType, MindTagType } from './MindData';
import { JsonCreate } from '../interaction/JsonCreate';
import StorageUtil from './StorageUtil';
import { EventManager, EventType } from '../util/Event';
import log, {Logger} from 'loglevel';
import LocalStorageUtil from '../util/LocalStorageUtil';


class DataCache {
    logger: Logger = log.getLogger("DataCache");
    treeMap: Map<string, MindData> = new Map<string, MindData>();
    cacheCrumbs: MindData[] = [];
    cacheSiblings: MindData[] = [];

    rootId: string;
    id:string;
    depth:number = 4;
    static KEY_DEPTH:string = "key_depth";

    /**
     * 载入设置的key
     */
    getDepth(){
        let storageDepth = LocalStorageUtil.getItem(DataCache.KEY_DEPTH);
        if(storageDepth != undefined ){
            let storageDepthNum = parseInt(storageDepth);
            if(storageDepthNum >= 1 && storageDepthNum <= 6){
                this.depth = parseInt(storageDepth);
            }else{
                LocalStorageUtil.removeItem(DataCache.KEY_DEPTH)
            }
        }
        return this.depth;
    }

    async setRootDefault(){
        console.info("set default root");
        let defaultRoot = await MindSource.getDefaultRoot();
        await this.setRoot(defaultRoot.id);
    }

    /**
     * 设置跟节点，如果有深度，则把深度缓存
     * @param id 
     */
    async setRoot(id: string, depth?:number) {
        this.depth = depth || this.depth;
        this.id = id;
        if(id == undefined){
            return;
        }
        LocalStorageUtil.setItem(DataCache.KEY_DEPTH, this.depth);
        this.logger.info("set root: ", id, " level: ", this.depth);

        this.rootId = await this.checkReferenceRoot(id);
        await this.getSubTreeByDepth(this.depth); 
        await this.updateRecentReference();
        await this.updateNodeCrumb();
        await this.updateNodeSibling();
        EventManager.dispatcher(EventType.MindDataSetRootNode);

        JsonCreate.getInstance<JsonCreate>().create(this.rootId, this.treeMap); //完成了ui事件后再开始渲染树
    }

    /**
     * 重新设置，用于刷新
     */
    async setRootReset(){
        this.setRoot(this.id, this.depth);
    }

    /**
     * 得到当前界面上显示的导图树
     * @param depth 
     */ 
    async getSubTreeByDepth(depth: number) {
        const data = await MindSource.getSubTreeByDepth(this.rootId, depth);
        this.treeMap = data;
    };

    /**
     * 更新节点的导航链路
     */
    async updateNodeCrumb() {
        let ids: string[] = [], nodes: MindData[] = [];
        ids.push(this.rootId);
        let id: string;
        while (id = ids.pop()!) {
            let node = await StorageUtil.get(id);
            nodes.push(node);
            if (node.id == MindSource.ROOT.id) {
                break;
            }
            ids.push(node.pid!);
        }
        this.cacheCrumbs = nodes.reverse();
    }

    /**
     * 更新根节点的兄弟缓存
     */
    async updateNodeSibling() {
        let siblings: MindData[] = [];
        let rootNode = await StorageUtil.get(this.rootId);          //当前的根节点
        if (rootNode.id != MindSource.ROOT.id) {
            let parentNode = await StorageUtil.get(rootNode.pid!);  //它的父亲节点
            for (let i = 0; i < parentNode.childs.length; i++) {
                let siblingNode = await StorageUtil.get(parentNode.childs[i]);
                siblings.push(siblingNode);
            }
        }
        this.cacheSiblings = siblings;
    }


    /**
     * 检查跟节点是否为引用，如果为引用则返回它下面的子节点实体，不是原路返回
     * @param id 
     */
    async checkReferenceRoot(id:string){
        let realId = id;
        let checkedNode = await StorageUtil.get(id);
        if(checkedNode.type == MindTagType.REF){
            let sNodeId = checkedNode.childs[0];
            if(sNodeId == undefined){
                this.logger.error("checkReferenceRoot error, id:", id, 'childs length = 0');
            }
            let realNode = await StorageUtil.get(sNodeId);
            realId = realNode.id;
        }
        this.logger.debug("checkReferenceRoot, src id:", id, "real id:", realId);
        return realId;
    }

    /**
     * 更新最近使用的引用
     * @param tabType 
     */
    async updateRecentReference(){
        if(this.rootId == MindSource.ROOT.id || this.rootId == MindSource.RECENT.id){ //去掉自身，避免死循环
            return;
        }
        
        await MindSource.addRecent(this.rootId);
        MindSource.RECENT_LIST = await MindSource.getSimpleSubNode(MindSource.RECENT);
        MindSource.RECENT_LIST = MindSource.RECENT_LIST.reverse();
    }

    /**
     * 直接获得引用缓存
     * @param tabType 
     */
    getReference(tabType:MindTabType):MindData[]{
        return MindSource[MindTabType[tabType] + '_LIST'] || [];
    }

    /**
     * 添加节点存储数据
     * @param pId 
     * @param sData 
     */
    async addNode(pId: string, sData: MindData) {
        let pData = this.treeMap.get(pId)!;
        await MindSource.addSubNode(pData, sData);  //关联关系在里面设置
        this.treeMap.set(sData.id, sData);
    }

    /**
     * 删除节点数据
     * @param pId 
     * @param sData 
     */
    async removeNode(pId: string, sData: MindData) {
        let pData = this.treeMap.get(pId)!;
        let delIds = await MindSource.removeSubNode(pData, sData);  //关联关系在里面设置
        delIds.forEach((id) => {
            this.treeMap.delete(id);
        });
    }

    /**
     * 交换原来的节点, 这里只需要更新就好了
     * @param nPId 
     * @param sId 
     * @param pos 
     */
    async exchangeNode(oPid:string,  sId:string, pos:number){
        let sData = this.treeMap.get(sId)!;         //自身
        let npData = this.treeMap.get(sData.pid)!;   //新的父节点
        let opData = this.treeMap.get(oPid)!;       //旧的父节点
        
        await StorageUtil.update(sData);
        await StorageUtil.update(npData);
        await StorageUtil.update(opData);
    }

    /**
     * 更新节点存储数据
     * @param data 
     */
    async updateNode(data:MindData){
        await StorageUtil.update(data);
    }

}

export default new DataCache();