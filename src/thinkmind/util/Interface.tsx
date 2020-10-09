import {AppHistory} from "../scene/AppHistory";
import {NodeLayer} from '../scene/NodeLayer';
import { NodeAttr } from '../item/NodeAttr';

export class Point {
    x: number
    y: number
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
