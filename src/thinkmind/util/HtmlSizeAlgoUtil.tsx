import { NodeAttr } from '../item/NodeAttr';
import { Rect } from './Interface';
import log, {Logger} from 'loglevel';

class HtmlSizeAlgoUtil{
    logger:Logger = log.getLogger('HtmlSizeAlgoUtil');
//visibility:hidden !important;
    HIDDEN_STYLE = `position:absolute !important;z-index:-1000 !important;top:0 !important;right:0 !important;  padding:0 !important; margin:0 !important; border:0 !important; word-break:break-all;`;

    hiddenTextInput: HTMLSpanElement | null;

    maxTextWidth: number = 300;
    
    /**
     * 调整文本域的大小
     * @param textInput 
     */
    adjustmentSize(textInput:HTMLElement):boolean{
        let isAdjust = false;
        let oldHeight = parseInt(textInput.getAttribute("height")!);
        let textMetrics = this.getTextMetrics(textInput.innerHTML, textInput.style.fontFamily, textInput.style.fontSize);

        if(textMetrics.width < this.maxTextWidth){ //超出开始固定
            textInput.setAttribute("width", textMetrics.width + parseInt(textInput.style.fontSize) + ''); //设置出当前需要的宽度
            isAdjust = true;
        }else{
            textInput.setAttribute("width", this.maxTextWidth + '');
        }
        if(textInput.offsetHeight - oldHeight != 0){
            textInput.setAttribute("height", textInput.offsetHeight + '');
            isAdjust = true;
        }
        this.logger.debug(
            "width: ", textInput.getAttribute("width"), 
            "height: ", textInput.getAttribute("height"), 
            "clientWidth: ", textInput.clientWidth, 
            "clientHeight: ", textInput.clientHeight, 
            "offsetWidth: ", textInput.offsetWidth, 
            "offsetHeight: ", textInput.offsetHeight, 
            "scrollWidth: ", textInput.scrollWidth, 
            "scrollHeight: ", textInput.scrollHeight)
        return isAdjust;
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
        this.hiddenTextInput!.innerHTML = attr.data.content;
        let content = attr.data.content
        if(content.length == 0){  //内容被删除后，
            content = "l";
        }
        this.adjustmentPrep(this.hiddenTextInput!, content, attr);

        let width = this.hiddenTextInput!.clientWidth! + attr.paddingX * 2;     //需要添加padding
        let height = this.hiddenTextInput!.scrollHeight! + attr.paddingY * 2;

        return {x:0, y:0, width:width , height: height} as Rect;
    }

    /**
     * 执行预计算
     * @param textInput 
     */
    adjustmentPrep(textInput:HTMLElement, content:string, attr:NodeAttr){
        if(content.length > 20){
            this.logger.debug(content);
        }
        let textMetrics = this.getTextMetrics(content, textInput.style.fontFamily, textInput.style.fontSize);

        if(textMetrics.width < this.maxTextWidth){ //超出开始固定
            textInput.style.width = textMetrics.width + parseInt(textInput.style.fontSize)/2 + 'px'; //设置出当前需要的宽度
        }else{
            textInput.style.width = this.maxTextWidth + 'px';
        }
        textInput.innerHTML = content;
        if(textInput.scrollHeight < parseInt(attr.lineHeight)){
            textInput.style.height = attr.lineHeight;
        }else{
            textInput.style.height = textInput.scrollHeight + 'px';
        }
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