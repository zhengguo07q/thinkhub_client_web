import { VNode } from 'snabbdom/build/package/vnode';
import { LayoutManager } from '../layout/LayoutManager';
import { RenderObject } from '../render/RenderContext';
import { RenderUtil } from '../render/RenderUtil';
import { ContextHolder } from '../util/ContextHolder';
import HtmlSizeAlgoUtil from '../util/HtmlSizeAlgoUtil';


export class InputContent extends ContextHolder {
    content: string;
    initialize() { }

    destory() { }

    /**
     * 事件文本输入
     * @param event 
     * @param vnode 
     */
    eventTextareaInput(event: InputEvent, vnode: VNode) {
        let textInput: HTMLElement = event.currentTarget as HTMLElement;
        let height = textInput.scrollHeight;

        let newWidth = HtmlSizeAlgoUtil.adjustmentWidth(textInput);
        let id = RenderUtil.getIdBySel(vnode.sel!);
        let attr = this.sceneContext.nodeLayer.items.get(id)!;

        let foreignElement: HTMLElement = document.getElementById(RenderObject.NodeForeignObject + id)!;
        let rectElement: HTMLElement = document.getElementById(RenderObject.NodeRect + id)!;
        let borderElement: HTMLElement = document.getElementById(RenderObject.NodeBorder + id)!;

        foreignElement.setAttribute('width', newWidth + '');
        foreignElement.setAttribute('height', height + '');

        rectElement.setAttribute('width', newWidth + 2 * attr.paddingX + '');
        rectElement.setAttribute('height', height + 2 * attr.paddingY + '');

        borderElement.setAttribute('width', newWidth + 2 * attr.paddingX + 6 + '');
        borderElement.setAttribute('height', height + 2 * attr.paddingY + 6 + '');
    }

    /**
     * 离开的时候需要恢复到鼠标不可点状态,开始调整布局
     * @param event 
     * @param vnode 
     */
    eventTextareaBlur(event: FocusEvent, vnode: VNode) {
        let textInput: HTMLElement = event.currentTarget as HTMLElement;
        textInput.style.pointerEvents = 'none';
        textInput.autofocus = false;
        event.stopPropagation();
        if (textInput.innerHTML != this.content) {    //内容不相等，则需要重新调整
            this.change(textInput, RenderUtil.getIdBySel(vnode.sel!));
        }
    }

    /**
     * 时间文本焦点
     * @param event 
     * @param vnode 
     */
    eventTextareaFocus(event: FocusEvent, vnode: VNode) {
        let textInput: HTMLElement = event.currentTarget as HTMLElement;
        this.content = textInput.innerHTML;
    }

    /**
     * 
     */
    change(textInput: HTMLSpanElement, id: string) {
        let attrNode = this.sceneContext.nodeLayer.items.get(id)!;      //值写入
        attrNode.updateConent(textInput.innerHTML)
        LayoutManager.getInstance().markChange();
        LayoutManager.getInstance().layout(true);
    }

    /**
     * 双击节点让这个节点文本可输入
     * @param event 
     * @param vnode 
     */
    onDbClickRect(event: MouseEvent, vnode: VNode) {
        this.logger.debug("双击编辑");
        let foreign: any = event.currentTarget;
        let nodeId = RenderUtil.getIdBySel(foreign.id);
        let textInput: HTMLElement = document.getElementById(RenderObject.NodeTextarea + nodeId) as HTMLElement;
        textInput.style.pointerEvents = 'auto';
        textInput.autofocus = true;
        textInput.contentEditable = "plaintext-only";
    }


}