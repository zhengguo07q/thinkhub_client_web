import { MindData } from './MindData';
import log, { Logger } from 'loglevel';

type NewDatabase = {
    isNew:boolean
}

class StorageUtil {
    logger:Logger = log.getLogger("StorageUtil");

    databaseName = "thinkhub";
    tableName = "mindnode";
    keyId = "id";
    mindDataName = "mindroot";
    version = 1;
    db:IDBDatabase;

    dataCache: Map<string, MindData> = new Map<string, MindData>();            //所有对象引用

    /**
     * 打开数据库
     */
    openDatabase() {
        let that = this;
        let promise = new Promise<NewDatabase>((resolve, reject)=>{
            that.logger.info("openDatabase")
            let request:IDBOpenDBRequest = window.indexedDB.open(this.databaseName, this.version);
            
            request.onerror = function (event) {
                that.logger.error('数据库打开报错');
            };
            request.onsuccess = function (event) {
                that.db = (event.target as IDBOpenDBRequest).result;
                that.logger.info('数据库打开成功');
                resolve({isNew:false});
            };
            request.onupgradeneeded = function (event:IDBVersionChangeEvent) {
                that.logger.info("创建新的数据库", that.databaseName);
                that.db = (event!.target as IDBOpenDBRequest).result;

                if (!that.db.objectStoreNames.contains(that.tableName)) {
                    let objectStore:IDBObjectStore = that.db.createObjectStore(that.tableName, { keyPath: that.keyId });
                    objectStore.createIndex('content', 'content', { unique: false });
                    that.logger.info("创建表成功", that.tableName);
                    objectStore.transaction.oncomplete = function (params) {
                        resolve({isNew:true});
                    }
                }
            }
        });
        return promise;
    }

    /**
     * 写入数据库
     * @param val 
     */
    add(val:MindData) {
        let that = this;
        that.dataCache.set(val.id, val);
        let promise = new Promise<MindData>((resolve, reject)=>{
            var request = that.db.transaction(that.tableName, 'readwrite').objectStore(that.tableName).add(val);

            request.onsuccess = function (event) {
                that.logger.debug('数据写入成功,', val);
                resolve();
            };
    
            request.onerror = function (event) {
                that.logger.error('数据写入失败', val);
                reject();
            }
        })
        return promise;
    }

    /**
     * 更新数据库
     * @param val 
     */
    update(val:any) {
        let that = this;
        that.dataCache.set(val.id, val);
        let promise = new Promise((resolve, reject)=>{
            var request = that.db.transaction([that.tableName], 'readwrite')
                .objectStore(that.tableName)
                .put(val);

            request.onsuccess = function (event) {
                that.logger.debug('数据更新成功', val);
                resolve();
            };

            request.onerror = function (event) {
                that.logger.error('数据更新失败', val);
                reject();
            }
        });
        return promise;
    }

    /**
     * 获取数据
     * @param id 
     * @param cb 
     */
    get(id:string) {
        let data = this.dataCache.get(id);
        if(data != undefined){
            return data;
        }
        let that = this;
        
        let promise = new Promise<MindData>((resolve, reject)=>{
            var transaction = that.db.transaction([that.tableName]);
            var objectStore = transaction.objectStore(that.tableName);
            var request = objectStore.get(id);
            that.logger.debug("get  id:", id);
            request.onerror = function (event) {
                that.logger.error('事务失败, id', id);
                reject();
            };

            request.onsuccess = function (event) {
                if(request.result){
                    let data:MindData = (request.result);
                    that.dataCache.set(data.id, data);
                    resolve(data)
                } else {
                    that.logger.error('未获得数据记录, id:', id);
                }
            };
        });
        return promise;
    }

    /**
     * 查询特定特定列
     * @param indexName 
     * @param value 
     * @param cb 
     */
    query(indexName:string, value:string){
        let that = this;
        let promise = new Promise<MindData>((resolve, reject)=>{
            var transaction = that.db.transaction([that.tableName], 'readonly');
            var store = transaction.objectStore(that.tableName);
            that.logger.debug("query  key:", indexName, " value:", value);
            var index = store.index(indexName);
            var request = index.get(value);

            request.onsuccess = function (event) {
                if(request.result){
                    let data = request.result;
                    that.dataCache.set(data.id, data);
                    resolve(data);
                } else {
                    that.logger.error('未获得数据记录, key:', indexName, " value:", value);
                }
            }});
        return promise;
    }

    /**
     * 删除数据
     * @param id 
     */
    remove(id:string) {
        let that = this;
        let promise = new Promise<string>((resolve, reject)=>{
            var request = this.db.transaction([this.tableName], 'readwrite')
                .objectStore(this.tableName)
                .delete(id);

            request.onsuccess = function (event) {
                that.dataCache.delete(id);
                that.logger.debug('数据删除成功', id);
                resolve(id);
            };
        });
        return promise;
    }
}

export default new StorageUtil();