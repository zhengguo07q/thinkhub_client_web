import { RenderContext } from '../render/RenderContext';
import { ContextHolder } from '../util/ContextHolder';
import { GestureOptions, GestureType, Gesture } from '../util/GestureUtil';
import { Rect } from '../util/Interface';

let GestureMoveSceneOptions: GestureOptions = {
    captureTime : 1000,
    onPath (x: number, y: number){
        MoveScreen.getInstance<MoveScreen>().onPath(x, y);
    },
    onGesture (gesture: GestureType){
        MoveScreen.getInstance<MoveScreen>().onGesture(gesture);
    },
}


/**
 * 移动和缩放屏幕
 */
export class MoveScreen extends ContextHolder{
    gesture:Gesture;
    svgElement:SVGSVGElement|null;
    backgroundRect:Rect;
    initialize(){
      //  this.gesture = new Gesture(this.sceneContext.rootElement, GestureMoveSceneOptions)
    }

    /**
     * 计算移动的大小
     * @param x 
     * @param y 
     */
    onPath (x: number, y: number){
        if(this.svgElement == undefined){
            this.svgElement = document.getElementById(RenderContext.SVG_ID) as any as SVGSVGElement;
            let bkgElement = document.getElementById(RenderContext.BKG_ID) as any as SVGRectElement;

            if(this.svgElement == undefined || bkgElement == undefined){
                return;
            }
            this.backgroundRect = new Rect();
            this.backgroundRect.width =  bkgElement.width.baseVal.value;
            this.backgroundRect.height = bkgElement.height.baseVal.value;
        }
        let viewX = this.svgElement.viewBox.baseVal.x ;
        let viewY = this.svgElement.viewBox.baseVal.y ;

        let newX = viewX - x;
        let newY = viewY - y;
        if(newX > 0 && newX < (this.backgroundRect.width - this.svgElement.viewBox.baseVal.width)){
            this.svgElement.viewBox.baseVal.x = newX;
        }
        if(newY > 0 && newY < (this.backgroundRect.height - this.svgElement.viewBox.baseVal.height)){
            this.svgElement.viewBox.baseVal.y = newY;
        }
    }

    /**
     * 计算缩放的大小
     * @param gesture 
     */
    onGesture (gesture: GestureType){
        let top = 0, left = 0, width = 1, height = 1;

        switch(gesture){
            case GestureType.down:
                top += 50;
                break;
            case GestureType.up:
                top -= 50;
                break;
            case GestureType.left:
                left -= 50;
                break;
            case GestureType.right:
                left += 50;
                break;
            case GestureType.zoom:
                width *= 1.5;
                height *= 1.5;
                break;
            case GestureType.mini:
                width /= 1.5;
                height /= 1.5;
                break;
        }
    }

    destory(){
  //      this.gesture.destory();
        this.svgElement = null;
    }
}