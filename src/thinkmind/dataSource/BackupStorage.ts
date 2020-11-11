import StorageUtil from './StorageUtil';
import { MindData } from './MindData';
import DataCache from './DataCache';
import { Message } from '@alifd/next';

/**
 * 用来做临时数据备份
 */
class StorageBackup {
    tableName = "mindnode_back";

    /**
     * 清空备份表
     * 遍历存储表获取数据
     */
    async backup(){
        this.clear();
        await this.cache2back();
        Message.success({
            title: '备份成功',
            duration: 1000
        });
    }

    /**
     * 清除存储表
     * 遍历备份获取数据并插入到存储表中
     */
    async recover(){
        StorageUtil.clear();
        await this.back2cache();
        Message.success({
            title: '恢复成功',
            duration: 1000
        });
        DataCache.setRootDefault();
    }

    /**
     * 缓存到备份
     */
    cache2back(){
        let that = this;
        let promise = new Promise<MindData[]>((resolve, reject)=>{
            var transaction = StorageUtil.db.transaction([StorageUtil.tableName], 'readonly');  //存储表
            var store = transaction.objectStore(StorageUtil.tableName);
            var request = store.openCursor();
            
            request.onsuccess = function (event) {
                if(request.result){
                    let cursor = request.result;
                    if(cursor){
                        let mindData = cursor.value as MindData;
                        that.add(mindData);
                        cursor.continue();
                    }
                } else {
                    resolve();
                }
            }});
        return promise;
    }

    /**
     * 备份到缓存
     */
    back2cache(){
        let that = this;
        let promise = new Promise<MindData[]>((resolve, reject)=>{
            var transaction = StorageUtil.db.transaction([that.tableName], 'readonly');     //备份表
            var store = transaction.objectStore(that.tableName);                            //备份表
            var request = store.openCursor();
            
            request.onsuccess = function (event) {
                if(request.result){
                    let cursor = request.result;
                    if(cursor){
                        let mindData = cursor.value as MindData;
                        StorageUtil.add(mindData);                                          //写入到存储表
                        cursor.continue();
                    }
                } else {
                    resolve();
                }
            }});
        return promise;
    }


    /**
     * 写入到备份表
     * @param val 
     */
    add(val:MindData) {
        let that = this;
        let promise = new Promise<MindData>((resolve, reject)=>{
            var request = StorageUtil.db.transaction(that.tableName, 'readwrite').objectStore(that.tableName).add(val); //备份表
            request.onsuccess = function (event) {
                resolve();
            };
            request.onerror = function (event) {
                reject();
            }
        })
        return promise;
    }

    /**
     * 清除备份表
     */
    clear(){
        StorageUtil.db.transaction([this.tableName], 'readwrite')
        .objectStore(this.tableName)
        .clear();
    }
}

export const StorageBackupInstance = new StorageBackup(); 
