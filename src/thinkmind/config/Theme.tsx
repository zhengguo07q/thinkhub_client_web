export type LinkLineType = 'line' | 'curve' | 'round';

export enum LinkPositionType {
    center,         //正中心
    axisCenter,     //坐标轴中心
    baseLine,       //基线
}

export enum BackgroundModelType{
    backgroundBorder,       //背景边框模式
    baseLine,               //基线模式
}

//定义了主题的类型，里面包含内容的样式，主题的样式，链接的样式等
//链接样式表定义
export type LinkStyle = {
    lineType?: string;                  //行类型
    collapsedOffset:number;             //折叠偏移
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

    linkPos:LinkPositionType;           //链接位置
    backgroundType:BackgroundModelType; //背景边框模式
    showCollapsed:boolean;              //显示折叠
};

export type TopicStyle = {            //主题样式
    contentStyle: TopicContentStyle;   //主题内容样式
    linkStyle: LinkStyle;              //链接样式
};

//主题描述
export type ThemeDesc = {
    id:string;
    name:string;
    img:string;
}

export type ThemeType = {               //主题类型
    themeDesc:ThemeDesc;
    background: string;                 //背景色
    highlightColor: string;             //行高颜色
    hoverColor: string;                 //随机颜色
    marginH: number;                    //边距水平
    marginV: number;                    //边距垂直
    borderWidthSelect:string;           //选择边框
    borderRadiusSelect:string;          //选择边框

    rootTopic?: TopicStyle;             //根主题样式
    primaryTopic?: TopicStyle;          //主主题样式
    normalTopic?: TopicStyle;           //正常主题样式
    aloneTopic?: TopicStyle;            //独立主题样式
};


