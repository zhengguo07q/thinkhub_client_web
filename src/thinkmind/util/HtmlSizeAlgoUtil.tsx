import { NodeAttr } from '../item/NodeAttr';
import { Rect } from './Interface';

class HtmlSizeAlgoUtil{
    HIDDEN_STYLE = `position:absolute !important;z-index:-1000 !important;top:0 !important;right:0 !important;  padding:0 !important; margin:0 !important; border:0 !important; word-break:break-all;overflow:visible box-sizing: border-box;`;

    hiddenTextInput: HTMLDivElement | null;
    maxTextWidth:number = 300;

    /**
     * 调整文本域的大小
     * @param textInput 
     */
    adjustmentWidth(textInput:HTMLElement){
        let newWidth:number;
        let textMetrics = this.getTextMetrics(textInput.innerHTML, textInput.style.fontFamily, textInput.style.fontSize);
        if(textMetrics.width < this.maxTextWidth){ //超出开始固定
            newWidth = textMetrics.width + parseInt(textInput.style.fontSize);
            textInput.setAttribute("width", newWidth + ''); //设置出当前需要的宽度
        }else{
            textInput.setAttribute("width", this.maxTextWidth + '');
            newWidth = this.maxTextWidth;
        }
        return newWidth;
    }

    /**
     * 获得字体渲染到大小
     * @param txt 
     * @param fontFamily 
     * @param fontSize 
     */
    getTextMetrics(txt: string, fontFamily?: string, fontSize?: string): TextMetrics {
        fontFamily = fontFamily || "sans-serif";
        fontSize = fontSize || '10';
        let canvas: HTMLCanvasElement = document.createElement("canvas");
        let context2d: CanvasRenderingContext2D = canvas.getContext("2d")!;
        context2d.font = fontSize + ' ' + fontFamily;
        return context2d.measureText(txt);
    }

    /**
     * 计算容纳属性对象的宽和高 
     * @param attr 
     */
    calculateHtmlTextareaSize(attr:NodeAttr):Rect{
        this.hiddenTextInput!.style.fontFamily = attr.fontFamily;
        this.hiddenTextInput!.style.fontSize = attr.fontSize;
        this.hiddenTextInput!.style.fontWeight = attr.fontWeight;
        this.hiddenTextInput!.style.height = "0px";
        this.hiddenTextInput!.style.minWidth = "5px";
        this.hiddenTextInput!.style.maxWidth = "300px";
        this.hiddenTextInput!.innerHTML = attr.data.content;

        let width = this.hiddenTextInput!.scrollWidth! + attr.paddingX * 2;     //需要添加padding
        let height = this.hiddenTextInput!.scrollHeight! + attr.paddingY * 2;

        return {x:0, y:0, width:width , height: height} as Rect;
    }

    

    initialize() {
        if (!this.hiddenTextInput) {
            this.hiddenTextInput = document.createElement('div');
            document.body.appendChild(this.hiddenTextInput);
            this.hiddenTextInput.setAttribute('style', this.HIDDEN_STYLE);
        }
        return this;
    }

    destory() {
        if (this.hiddenTextInput) {
            this.hiddenTextInput.parentNode && this.hiddenTextInput.parentNode.removeChild(this.hiddenTextInput);
            this.hiddenTextInput = null;
        }
        return this;
    }
}


export default new HtmlSizeAlgoUtil().initialize();