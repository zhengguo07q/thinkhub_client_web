import { VNode } from 'snabbdom/build/package/vnode';
import { InputContent } from '@/thinkmind/interaction/InputContent'; 
import { SelectNode } from '../interaction';

export class EventHelper{
    static eventForeignOver(e:MouseEvent, n:VNode){
        
        let selectNode = SelectNode.getInstance<SelectNode>();
        selectNode.eventForeignOver.bind(selectNode, e, n)();
    }

    static eventForeignOut(e:MouseEvent, n:VNode){
        let selectNode = SelectNode.getInstance<SelectNode>();
        selectNode.eventForeignOut.bind(selectNode, e, n)();
    }

    static eventForeignClick(e:MouseEvent, n:VNode){
        let selectNode = SelectNode.getInstance<SelectNode>();
        selectNode.eventForeignClick.bind(selectNode, e, n)();
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
}