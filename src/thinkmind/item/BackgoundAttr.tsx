import { Point } from '../util/Interface';
import log, { Logger } from 'loglevel';

/**
 * 
 */
export class BackgroundAttr{
    logger:Logger = log.getLogger('BackgroundAttr');

    background: string = '#ffffff';                //背景色
    highlightColor: string = '';                    //选择高亮颜色
    hoverColor: string = '';
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

    /**
     * 设置内容中心大小
     * @param width 
     * @param height 
     */
    setContentSize(width:number, height:number){
        this.contentWidth = width;
        this.contentHeight = height;
    }

    /**
     * 设置当前布局的根元素中心点，布局的最中心模式使用这个中心点
     * @param x 
     * @param y 
     */
    setRootCenterPosition(x:number, y:number){
        this.rootPos = {x:x, y:y};
    }

    /**
     * 滚动到位置
     */
    scroll(){
        if(this.adjustScroll == true){
            this.element.scrollLeft = this.rootPos.x - this.element.clientWidth/2;
            this.element.scrollTop = this.rootPos.y - this.element.clientHeight/2;
            this.adjustScroll = false;
        }
    }

    getScrollPosition(){
        return {x: this.element.scrollLeft, y: this.element.scrollTop};
    }

    /**
     * 场景宽
     */
    getSceneWidth():number{
        return this.marginH * 2 + this.contentWidth;
    }

    /**
     * 场景高
     */
    getSceneHeight():number{
        return this.marginV * 2 + this.contentHeight;
    }
};

