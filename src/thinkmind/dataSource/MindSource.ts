import { TypeUtil } from '../util/TypeUtil';
import { MindData, MindDataInitialize, MindTagType, createNewNode, createRefNode } from './MindData';
import StorageUtil from './StorageUtil';
import log, { Logger } from 'loglevel';

/**
 * 原则，管理的数据里面都是必须数据，而且可以直接导出的结构数据。
 */
class MindSource {
    logger:Logger = log.getLogger('MindSource');

    rootData: MindData;                          //根节点，原生对象，其他数据不应该保存在里面
    ROOT:MindData; //保存数据库的根节点
    CURRENT: MindData;
    PRIVATE: MindData;
    TEMP: MindData;           //临时
    SHARE: MindData;          //分享，引用  自己分享给别人的
    RECENT: MindData;           //最近，引用  自动添加，最近使用的
    COLLECT: MindData;        //收藏, 引用, 别人的，不是拷贝的
    MEETING: MindData;

    CURRENT_LIST: MindData[];
    PRIVATE_LIST: MindData[];
    TEMP_LIST: MindData[];           //临时
    SHARE_LIST: MindData[];          //分享，引用  自己分享给别人的
    RECENT_LIST: MindData[];           //最近，引用  自动添加，最近使用的
    COLLECT_LIST: MindData[];        //收藏, 引用, 别人的，不是拷贝的
    MEETING_LIST: MindData[];

    isInit: boolean = false;
    MAX_RECENT: number = 10;


    async getDefaultRoot() {
        await this.checkLoad();
        return this.CURRENT;
    }

    async checkLoad() {
        this.logger.info("load db");
        if (this.isInit) {
            return;
        }
        
        const openRes = await StorageUtil.make();
        if (openRes.isNew == true) {
            for (let i = 0; i < MindDataInitialize.length; i++) {
                await StorageUtil.add(MindDataInitialize[i]);
            }
        }
        this.ROOT = await StorageUtil.query("content", "Root")
        for (let i = 0; i < this.ROOT.childs!.length; i++) {      //引用和特殊才做缓存
            let typeData = await StorageUtil.get(this.ROOT.childs![i]);
            this[typeData.content] = typeData;
            this[typeData.content + '_LIST'] = await this.getSimpleSubNode(typeData);       //缓存当前的其他引用
        }
        this.checkInitNode();

        this.isInit = true
    }


    /**
     * 添加引用，引用只有父对子对关系，没有子对父的关系，需要去除掉重复的，添加时如果有重复则先删除
     * 引用是一个独立的对象
     * @param id 
     */
    async addRecent(id: string) {
        let refData = await this.getUniqueSameLevelRef(this.RECENT, id);

        TypeUtil.arrayRemove(this.RECENT.childs, refData.id);       //删除之前的记录, 如果有的话
        this.RECENT.childs.push(refData.id);                        //把引用对象追到最后
        if (this.RECENT.childs.length > this.MAX_RECENT) {
            let popId = this.RECENT.childs.pop()!;
            await StorageUtil.remove(popId);                        //之前的最近使用的引用不需要了
        }
        await StorageUtil.update(this.RECENT);
    }


    /**
     * 获得对象的唯一引用对象，(没被关联)
     * @param parentData 
     * @param id 
     */
    async getUniqueSameLevelRef(parentData: MindData, id: string) {
        let uniqueData: MindData | undefined;
        for (let i = 0; i < parentData.childs.length; i++) {
            let sId = parentData.childs[i];
            let sData = await StorageUtil.get(sId);
            let refId = sData.childs[0];                //获得引用的对象的id
            if (refId == id) {
                uniqueData = sData;
                break;
            }
        }
        if (uniqueData == undefined) {
            let referedNode = await StorageUtil.get(id);    //获取被引用对象
            uniqueData = createRefNode(referedNode);     //创建一个新的引用节点
            uniqueData.pid = parentData.id;
            parentData.childs.push(uniqueData.id);      //建立起关系    //原则上父对象在这里要更新的
            await StorageUtil.add(uniqueData);          //新建的需要存储起来
        }
        return uniqueData;
    }

    /**
     * 得到节点下所有的下一级子节点
     * @param data 
     */
    async getSimpleSubNode(data: MindData) {
        let nodes: MindData[] = []
        for (let i = 0; i < data.childs.length; i++) {
            let sdata = await StorageUtil.get(data.childs[i]);
            nodes.push(sdata);
        }
        return nodes;
    }

    /**
     * 部分节点如果是初始化状态且里面为空，需要创建初始化节点
     */
    async checkInitNode() {
        let newNodes = ["CURRENT", "PRIVATE", "TEMP"]
        for (let i = 0; i < newNodes.length; i++) {
            let newNodeName = newNodes[i];
            let docNode = this[newNodeName] as MindData;
            if (docNode.childs.length == 0) {
                let newNode = createNewNode("新主题")
                newNode.pid = docNode.id;               //关系需要在添加函数之前建立
                docNode.childs.push(newNode.id);
                await this.addSubNode(docNode, newNode);
            }
        }
    }


    async addSubNode(p: MindData, c: MindData) {
        await StorageUtil.add(c);
        await StorageUtil.update(p);
    }

    /**
     * 彻底删除子节点以及后续的其他节点
     * @param p 
     * @param c 
     */
    async removeSubNode(p: MindData, c: MindData) {
        await StorageUtil.update(p);        //更新父节点

        let subs: string[] = [], delIds: string[] = [];
        subs.push(c.id);
        let id: string;
        while (id = subs.pop()!) {
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


    async getSubTreeByDepth(id: string, depth: number) {
        depth--;
        let childNodes: Map<string, MindData> = new Map<string, MindData>();
        var data: MindData = await StorageUtil.get(id);
        childNodes.set(data.id, data);
        if (depth > 0) {
            data.isSubVisible = true;
            let list = await this.visibleSubTreeByDepth(data, depth);
            list.forEach((item) => {
                childNodes.set(item.id, item);
            })
        } else {
            data.isSubVisible = false;
        }
        return childNodes;
    }

    /**
     * 根据深度得到子对象树，如果对象是引用则子对象不再加载
     * @param data 
     * @param depth 
     */
    async visibleSubTreeByDepth(data: MindData, depth: number) {
        let childNodes: MindData[] = [];
        depth--;
        for (let i = 0; i < data.childs.length; i++) {
            var child: MindData = await StorageUtil.get(data.childs[i]);
            childNodes.push(child);
            if (depth > 0 && child.type != MindTagType.REF) {               //引用的对象子对象不再加载
                child.isSubVisible = true;
                let ccnodes = await this.visibleSubTreeByDepth(child, depth);
                childNodes = childNodes.concat(ccnodes);
            } else {
                child.isSubVisible = false;
            }
        }
        return childNodes;
    }


    async getTabTypeList(tabType: string) {
        let tabList: MindData[] = [];
        await this.checkLoad();
        let mindData: MindData = this[tabType];

        for (let i = 0; i < mindData.childs.length; i++) {
            let node = await StorageUtil.get(mindData.childs[i]);
            tabList.push(node);
        }
        return JSON.parse(JSON.stringify(tabList)); //所有使用icestore的都需要深拷贝
    }


}
export default new MindSource();