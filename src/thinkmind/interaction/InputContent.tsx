import { VNode } from 'snabbdom/build/package/vnode';
import { LayoutManager } from '../layout/LayoutManager';
import { RenderObject } from '../render/RenderContext';
import { RenderManager } from '../render/RenderManager';
import { RenderUtil } from '../render/RenderUtil';
import { ContextHolder } from '../util/ContextHolder';
import  HtmlSizeAlgoUtil  from '../util/HtmlSizeAlgoUtil';


export class InputContent extends ContextHolder {
    content:string ;
    initialize() {}

    destory() {}

    onFocus(event: FocusEvent, vnode: VNode) {
        let textInput: HTMLElement = event.currentTarget as HTMLElement;
        this.content = textInput.innerHTML;
    }

    onInput(event: InputEvent, vnode: VNode) {
        let textInput: HTMLElement = event.currentTarget as HTMLElement;
        let oldWidth = parseInt(textInput.getAttribute("width")!);
        let oldHeight = parseInt(textInput.getAttribute("height")!);
        let isAdjust = HtmlSizeAlgoUtil.adjustmentSize(textInput);

        //调整外框大小
        if(isAdjust){
            let id = RenderUtil.getIdBySel(vnode.sel!);
            let newWidth = parseInt(textInput.getAttribute("width")!);
            let newHeight = parseInt(textInput.getAttribute("height")!);
            this.setNodeSize(id, oldWidth, oldHeight, newWidth, newHeight);
        }
    }

    /**
     * 设置父容器的大小
     * @param id 
     * @param width 
     * @param height 
     */
    setNodeSize(id:string, owidth:number, oheight:number, width:number, height: number){
        let changeW = width - owidth, changeH = height - oheight;
        
        let foreignElement:SVGForeignObjectElement = document.getElementById(RenderObject.NodeForeignObject + id)! as any;

        foreignElement.setAttribute('width', parseInt(foreignElement.getAttribute('width')!) + changeW + '');
        foreignElement.setAttribute('height', parseInt(foreignElement.getAttribute('height')!) + changeH + '');

        let rectElement:SVGRectElement = document.getElementById(RenderObject.NodeRect + id) as any;
        rectElement.setAttribute('width', parseInt(rectElement.getAttribute('width')!) + changeW + '');
        rectElement.setAttribute('height', parseInt(rectElement.getAttribute('height')!) + changeH + '');

        let borderElement:SVGRectElement = document.getElementById(RenderObject.NodeBorder + id) as any;
       borderElement.setAttribute('width', parseInt(borderElement.getAttribute('width')!) + changeW + '');
       borderElement.setAttribute('height', parseInt(borderElement.getAttribute('height')!) + changeH + '');
    }

    /**
     * 
     */
    change(textInput:HTMLSpanElement, id:string) {
        let attrNode = this.sceneContext.nodeLayer.items.get(id)!;      //值写入
        attrNode.updateConent(textInput.innerHTML)
        LayoutManager.getInstance().markChange();
        let rootComputeNode = LayoutManager.getInstance().layout();
        RenderManager.fastRender(rootComputeNode, this.sceneContext.nodeLayer.backgroundAttr);
    }

    /**
     * 离开的时候需要恢复到鼠标不可点状态,开始调整布局
     * @param event 
     * @param vnode 
     */
    onBlurTextarea(event: FocusEvent, vnode: VNode) {
        let textInput: HTMLElement = event.currentTarget as HTMLElement;
        textInput.style.pointerEvents = 'none';
        textInput.autofocus = false;
        event.stopPropagation();
        if(textInput.innerHTML != this.content){    //内容不相等，则需要重新调整
            this.change(textInput, RenderUtil.getIdBySel(vnode.sel!));
        }
    }

    /**
     * 双击节点让这个节点文本可输入
     * @param event 
     * @param vnode 
     */
    onDbClickRect(event: MouseEvent, vnode: VNode) {
        let foreign: any = event.currentTarget;
        let nodeId = RenderUtil.getIdBySel(foreign.id);
        let textInput: HTMLElement = document.getElementById(RenderObject.NodeTextarea + nodeId) as HTMLElement;
        textInput.style.pointerEvents = 'auto';
        textInput.autofocus = true;
        textInput.contentEditable = "true";
    }


}