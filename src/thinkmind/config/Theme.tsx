export type LinkLineType = 'line' | 'curve' | 'round';
import ThemeDefault from './ThemeDefault';

//定义了主题的类型，里面包含内容的样式，主题的样式，链接的样式等
//链接样式表定义
export type LinkStyle = {
    lineType?: string;                  //行类型
    
    hasUnderline?: boolean;             //是否有下划线
    lineWidth?: number;                 //行宽
    lineColor?: string;                 //行颜色
    lineRadius?: number;                //行角半径
};

//代表方块的样式
export type TopicContentStyle = {     //主题内容央视定义
    nodeType: string;                     //链接渲染类型
    [key: string]: any;                 //关键字

    marginH: number;                    //边距水平
    marginV: number;                    //边距垂直

    border?: string;                    //边框
    borderRadius?: string;              //边角
    borderWidth?: string;               //边宽
    borderStyle?: string;               //边框样式
    borderColor?: string;               //边框颜色
    
    paddingX: number, 
    paddingY: number,

    background?: string;                //背景色

    width: number;                      //宽
    height: number;                     //高

    color?: string;                     //颜色
    fontFamily?: string;                //字体类型
    fontSize?: string;                  //字体大小
    lineHeight?: string;                //行高

    content: string;
};

export type TopicStyle = {            //主题样式
    contentStyle: TopicContentStyle;   //主题内容样式
    linkStyle: LinkStyle;              //链接样式
};

export type ThemeType = {             //主题类型
    name: string;                       //名字
    background: string;                 //背景色
    highlightColor: string;             //行高颜色
    randomColor?: boolean;              //随机颜色
    marginH: number;                    //边距水平
    marginV: number;                    //边距垂直
    borderWidthSelect:string;           //选择边框
    borderRadiusSelect:string;          //选择边框

    rootTopic?: TopicStyle;             //根主题样式
    primaryTopic?: TopicStyle;          //主主题样式
    normalTopic?: TopicStyle;           //正常主题样式
    aloneTopic?: TopicStyle;            //独立主题样式
};


