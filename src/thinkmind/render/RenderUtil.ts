export class RenderUtil{
    static getIdBySel(sel: string){
        let tag = '@';
        let tagPos = sel.indexOf(tag);
        if(tagPos === -1){
            new Error('svg object id is err : ' + sel);
        }
        return sel.substring(tagPos + 1, sel.length);
    }
}