import { SceneScreen } from '../scene/SceneScreen'
import { Rect } from '../util/Interface'
import { NodeAttr } from './NodeAttr'
import HtmlSizeAlgoUtil from '../util/HtmlSizeAlgoUtil'

const PEM = 18
const DEFAULT_HEIGHT = PEM * 2
const DEFAULT_GAP = PEM

//节点的基础属性算法，需要继承自定义
export class NodeAlgoAttrBase {

    getId(d: NodeAttr) {
        return d.data.id;
    }

    getHGap(d: NodeAttr) {
        return d.marginH || DEFAULT_GAP
    }

    getVGap(d: NodeAttr) {
        return d.marginV || DEFAULT_GAP
    }

    getChildren(d: NodeAttr) :any{
        return d.data.childs;
    }

    getWidthAndHeight(d: any){
        const name = d.name || ' '
        return {width: (d.height || DEFAULT_HEIGHT), height: (d.width || (name.split('').length * PEM))}
    }
}

export class NodeAlgoAttr extends NodeAlgoAttrBase {
    static instance: NodeAlgoAttr;

    static build(): NodeAlgoAttr {
        if (this.instance != null) {
            return this.instance;
        }
        var algo: NodeAlgoAttr = new NodeAlgoAttr();
        return algo;
    }


    getChildren(d:NodeAttr){
        var nodes: NodeAttr[] = [];
        let items = SceneScreen.context.nodeLayer.items;
        for(var i=0;i<d.data.childs.length; i++){
            var id = d.data.childs[i];
            let node = items.get(id);
            if(node == undefined){
                continue;
            }
            nodes.push(node);
        }
        return nodes;
    }

    getWidthAndHeight(d:NodeAttr):Rect{
        return HtmlSizeAlgoUtil.calculateHtmlTextareaSize(d);
    }

    getHGap(d:NodeAttr) {
        return d.marginH;
    }
    
    getVGap(d:NodeAttr) {
        return d.marginV;
    }
}