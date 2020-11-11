import { MindData } from "../dataSource/MindData";
import StorageUtil from '../dataSource/StorageUtil';

export default class IAndEUtil{
    /**
     * 批量插入到数据库
     * @param mindList 
     */
    static async sourceImport(mindMap:Map<string, MindData>){
        for(let mind of mindMap.values()){
            await StorageUtil.add(mind);
        }
    }

    /**
     * 从数据库获取
     */
    static sourceExport(){

    }
}

