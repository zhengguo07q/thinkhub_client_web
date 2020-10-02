export class TypeUtil{
    static arrayRemove(arr:any[], ele:any){
        var index = arr.indexOf(ele);
        if(index > -1) {
            arr.splice(index,1);
        }
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
    
}