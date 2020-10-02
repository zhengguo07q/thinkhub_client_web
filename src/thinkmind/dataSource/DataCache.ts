import MindSource from './MindSource';
import { MindData, MindTabType } from './MindData';
import { JsonCreate } from '../interaction/JsonCreate';
import StorageUtil from './StorageUtil';
import { EventManager, EventType } from '../util/Event';


class DataCache {
    treeMap: Map<string, MindData> = new Map<string, MindData>();
    cacheCrumbs: MindData[] = [];
    cacheSiblings: MindData[] = [];

    rootId: string;
    depth:number = 3;


    async setRootDefault(){
        let defaultRoot = await MindSource.getDefaultRoot();
        await this.setRoot(defaultRoot.id);
    }

    /**
     * 设置跟节点，如果有深度，则把深度缓存
     * @param id 
     */
    async setRoot(id: string, depth?:number) {
        this.depth = depth || this.depth;
        if(id == undefined){
            return;
        }
        this.rootId = id;
        await this.getSubTreeByDepth(this.depth); 
        await this.updateRecentReference();
        await this.updateNodeCrumb();
        await this.updateNodeSibling();
        EventManager.dispatcher(EventType.MindDataSetRootNode);

        JsonCreate.getInstance<JsonCreate>().create(this.rootId, this.treeMap); //完成了ui事件后再开始渲染树
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
     * 更新最近使用的引用
     * @param tabType 
     */
    async updateRecentReference(){
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
     * 更新节点存储数据
     * @param data 
     */
    async updateNode(data:MindData){
        await StorageUtil.update(data);
    }

}

export default new DataCache();