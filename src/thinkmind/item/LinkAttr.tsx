/**
 * 
 */
export class LinkAttr{
    linkType: string = '';                  //行类型
    
    lineWidth: number = 1;                 //行宽
    lineColor: string ='#ffffff';         //行颜色
    lineRadius: number = 1;                //行角半径
    collapsedOffset:number = 0;

    static fromTheme(object:any):LinkAttr{
        let attr = new LinkAttr();
        return Object.assign(attr, object);
    }
};

