export class TypeUtil{

    /**
     * s删除元素
     * @param arr 
     * @param ele 
     */
    static arrayRemove(arr:any[], ele:any){
        var index = arr.indexOf(ele);
        if(index > -1) {
            arr.splice(index,1);
        }
    }

    /**
     * 插入到数组位置
     * @param arr 
     * @param index 
     * @param ele 
     */
    static arrayInsert(arr:any[], index:number, ele:any) {
        arr.splice(index, 0, ele);
    }

    /**
     * 把长度超出的字符串缩短为简写
     * @param txt 
     */
    static getShortTxt(txt:string):string{
        var maxLen:number = 10, preLen:number = 6, suffixlen:number = 3;
        if(txt.length <= maxLen){
            return txt
        }
        return txt.substring(0, preLen) + '...' + txt.substring(txt.length-suffixlen, txt.length);
    }
    
    static JsonCopy(json:any):any{
        return JSON.parse(JSON.stringify(json));
    }
}
