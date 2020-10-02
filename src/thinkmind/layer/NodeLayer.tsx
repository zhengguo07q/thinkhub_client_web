//import * as d3 from 'd3'
import {Item } from '../util/Interface'
import { NodeAttr } from '../item/NodeAttr'
import { BackgroundAttr } from '../item/BackgoundAttr';


export class NodeLayer {
    items: Map<string, Item> = new Map<string, Item>();     //保存所有的元素
    selIdSet: Set<string> = new Set<string>();              //当前选择的itemId
    rootItem: NodeAttr;
    backgroundAttr:BackgroundAttr;
}
