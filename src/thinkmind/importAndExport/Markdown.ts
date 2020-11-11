import { MindData, createNewNode } from '../dataSource/MindData';
import remark from 'remark';
import IAndEUtil from './IAndEUtil';
import DataCache from '../dataSource/DataCache';
var removePosition = require('unist-util-remove-position')

class Markdown {
    async import(content: string, mountNode: MindData) {
        var tree = remark().parse(content);
        removePosition(tree, true);
        //console.dir(tree, {depth: null})
        console.log(tree);
        let mindMap: Map<string, MindData> = this.convertJson2MindData(tree, mountNode);
        await IAndEUtil.sourceImport(mindMap);
        await DataCache.setRootReset();
    }

    /**
     * 
     * @param json 
     */
    convertJson2MindData(tree: any, rootNode: MindData): Map<string, MindData> {
        let mindMap: Map<string, MindData> = new Map<string, MindData>();
        if (tree.type == 'root') {
            let prevDepth: number = 0;
            let prevData: MindData | undefined;
            for (let i = 0; i < tree.children.length; i++) {
                let item = tree.children[i];
                let currData: MindData | undefined;
                let currDepth: number = 0;
                if (item.type == 'heading') {
                    currDepth = item.depth;
                    currData = this.convertJ2MHeading(mindMap, item, prevData, prevDepth);
                    if (currData != undefined) {
                        mindMap.set(currData.id, currData);
                        if (prevData == undefined) {              //关联上当前有的节点
                            currData.pid = rootNode.id;
                            rootNode.childs.push(currData.id);
                        }
                        prevData = currData;
                        if (currDepth != 0) {
                            prevDepth = currDepth;
                        }
                    }
                }
                if (item.type == 'list') {
                    currData = this.convertJ2MList(mindMap, item, prevData);
                }
            }
        }
        return mindMap;
    }

    /**
     * heading项目
     * @param item 
     * @param prevData 
     * @param prevDepth 
     */
    convertJ2MHeading(mindMap: Map<string, MindData>, item: any, prevData: MindData | undefined, prevDepth: number): MindData | undefined {
        let holder = item.children[0];
        let currDepth = item.depth;
        let currData: MindData | undefined;
        if (holder.type == 'text') {
            currData = createNewNode(holder.value);
            if (prevData != undefined && currDepth > prevDepth) {
                currData.pid = prevData.id;
                prevData.childs.push(currData.id);
            }
            if (prevData != undefined && currDepth <= prevDepth) {
                let parent = this.getParentByDepth(mindMap, prevData, prevDepth, currData, currDepth);
                currData.pid = parent.id;
                parent.childs.push(currData.id);
            }
        }
        return currData;
    }

    /**
     * 找到父亲
     * @param mindMap 
     * @param prevData 
     * @param prevDepth 
     * @param currData 
     * @param currDepth 
     */
    getParentByDepth(mindMap: Map<string, MindData>, prevData: MindData, prevDepth: number, currData: MindData, currDepth: number): MindData {
        let parent: MindData = prevData;
        let distance = prevDepth - currDepth;   //距离为0，说明是兄弟，需要查找父亲
        if(currData.content =="形状"){
            console.log();
        }
        while (distance >= 0 && parent != undefined) {
            parent = mindMap.get(parent.pid)!;
            distance--;
        }
        return parent;
    }

    /**
     * list 里面是一些嵌套的组合，父子节点自然嵌套在里面
     * @param item 
     */
    convertJ2MList(mindMap: Map<string, MindData>, item: any, prevData: MindData | undefined): MindData | undefined {
        let mind: MindData | undefined;
        for (let j = 0; j < item.children.length; j++) {
            let listItem = item.children[j];
            for (let k = 0; k < listItem.children.length; k++) {
                let mixItem = listItem.children[k];
                if (mixItem.type == 'paragraph') {                //内容节点
                    for (let m = 0; m < mixItem.children.length; m++) {
                        let paragraphItem = mixItem.children[m];
                        if (paragraphItem.type == 'text') {
                            mind = createNewNode(paragraphItem.value);
                            if (prevData != undefined) {
                                mind.pid = prevData.id;
                                prevData.childs.push(mind.id);
                            }
                            mindMap.set(mind.id, mind);
                        }
                    }
                } else if (mixItem.type == 'list') {
                    this.convertJ2MList(mindMap, mixItem, mind);
                }
            }
        }
        return mind;
    }


    /**
     * 暂时不支持
     * @param mindData 
     */
    async export(mindData: MindData) {

    }
}

const MarkdownInstance = new Markdown();
export default MarkdownInstance;