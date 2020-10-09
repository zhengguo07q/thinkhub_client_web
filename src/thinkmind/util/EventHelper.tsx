import { VNode } from 'snabbdom/build/package/vnode';
import { InputContent } from '@/thinkmind/interaction/InputContent'; 
import { DragNode, SelectNode } from '../interaction';

export class EventHelper{
    static eventGroupEnter(e:MouseEvent, n:VNode){
        let selectNode = SelectNode.getInstance<SelectNode>();
        selectNode.eventGroupEnter.bind(selectNode, e, n)();
    }

    static eventGroupLeave(e:MouseEvent, n:VNode){
        let selectNode = SelectNode.getInstance<SelectNode>();
        selectNode.eventGroupLeave.bind(selectNode, e, n)();
    }

    static eventGroupClick(e:MouseEvent, n:VNode){
        let selectNode = SelectNode.getInstance<SelectNode>();
        selectNode.eventGroupClick.bind(selectNode, e, n)();
    }

    static eventBackgroundClick(e:MouseEvent, n:VNode){
        let selectNode = SelectNode.getInstance<SelectNode>();
        selectNode.eventBackgroundClick.bind(selectNode, e, n)();
    }

    static eventForeignDbClick(e:MouseEvent, n:VNode){
        let inputContent = InputContent.getInstance<InputContent>();
        inputContent.onDbClickRect.bind(inputContent, e, n)();
    }

    static eventTextareaFocus(e:FocusEvent, n:VNode){
        let inputContent = InputContent.getInstance<InputContent>();
        inputContent.onFocus.bind(inputContent, e, n)();
    }

    static eventTextareaInput(e:InputEvent, n:VNode){
        let inputContent = InputContent.getInstance<InputContent>();
        inputContent.onInput.bind(inputContent, e, n)();
    }

    static eventTextareaBlur(e:FocusEvent, n:VNode){
        let inputContent = InputContent.getInstance<InputContent>();
        inputContent.onBlurTextarea.bind(inputContent, e, n)();
    }

    static eventGroupDown(e:MouseEvent, n:VNode){
        let dragNode = DragNode.getInstance<DragNode>();
        dragNode.onStartDrag.bind(dragNode, e, n)();
    }


}