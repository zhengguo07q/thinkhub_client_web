import { Point } from '../util/Interface';

/**
 * 
 */
export class BackgroundAttr{
    background: string = '#ffffff';                //背景色
    highlightColor: string = '';            //行高颜色
    borderWidthSelect:string = '3';
    borderRadiusSelect:string = '3';
    randomColor: boolean = false;              //随机颜色
    marginH: number = 0;                    //边距水平
    marginV: number = 0;                    //边距垂直
    contentWidth:number = 0;
    contentHeight:number = 0;
    element:HTMLElement;                    //显示区域内容
    rootPos:Point;
    adjustScroll:boolean = true;                   //第一次的时候需要调整滚动
    

    static fromJs(object:any):BackgroundAttr{
        let attr = new BackgroundAttr();
        return Object.assign(attr, object);
    }

    /**
     * 每次调整显示后，需要重新设置外框
     * @param element 
     */
    setElement(element:HTMLElement){
        this.element = element;
        if(this.marginH == 0 && this.marginV == 0){
            this.marginH = this.element.clientWidth/2;      //没有设置，则设置为一半视口大小
            this.marginV = this.element.clientHeight/2;
        }
    }

    setContentSize(width:number, height:number){
        this.contentWidth = width;
        this.contentHeight = height;
    }

    setRootCenterPosition(x:number, y:number){
        this.rootPos = {x:x, y:y};
    }

    scroll(){
        if(this.adjustScroll == true){
            //测试，内容不大时移动到中间
          /*  if(this.contentWidth < this.element.clientWidth){  
                this.element.scrollLeft = this.rootPos.x - this.contentWidth/2;
            }else{
                this.element.scrollLeft = this.rootPos.x - this.element.clientWidth/2;
            }
            
            if(this.contentHeight < this.element.clientHeight){
                this.element.scrollTop = this.rootPos.y - this.contentHeight/2;
            }else{
                this.element.scrollTop = this.rootPos.y - this.element.clientHeight/2;
            }
            */
            this.element.scrollLeft = this.rootPos.x - this.element.clientWidth/2;
            this.element.scrollTop = this.rootPos.y - this.element.clientHeight/2;
            this.adjustScroll = false;
        }
    }

    getSceneWidth():number{
        return this.marginH * 2 + this.contentWidth;
    }

    getSceneHeight():number{
        return this.marginV * 2 + this.contentHeight;
    }
};

