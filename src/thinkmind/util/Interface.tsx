import {AppHistory} from "../scene/AppHistory";
import {NodeLayer} from '../scene/NodeLayer';
import { NodeAttr } from '../item/NodeAttr';

export class Point {
    x: number
    y: number

    static distance(p1:Point, p2:Point){
        let a:number = ((p1.x-p2.x)*(p1.x - p2.x)) + ((p1.y-p2.y)*(p1.y-p2.y));
        return Math.sqrt(a);
    }

    static from(x:number, y:number):Point{
        let p=  new Point();
        p.x = x;
        p.y = y;
        return p;
    }
}

export class Rect {
    x: number
    y: number 
    width: number
    height: number

}


export type ItemId = number
export type NodeId = number

export type Item = NodeAttr 


export type SceneContext = {
    nodeLayer: NodeLayer;
    appHistory: AppHistory;
    rootElement:HTMLElement;
}
